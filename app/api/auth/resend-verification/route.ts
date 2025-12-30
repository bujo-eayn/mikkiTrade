import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getClientIp } from '@/lib/rate-limit';

// In-memory rate limiter for resend verification
const resendAttempts = new Map<string, { count: number; resetTime: number }>();

function rateLimitResendVerification(identifier: string): {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const maxAttempts = 3;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const now = Date.now();
  const entry = resendAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    resendAttempts.set(identifier, { count: 1, resetTime });
    return { success: true, remaining: maxAttempts - 1, resetTime };
  }

  if (entry.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  resendAttempts.set(identifier, entry);
  return { success: true, remaining: maxAttempts - entry.count, resetTime: entry.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIp = getClientIp(request);
    const emailRateLimit = rateLimitResendVerification(`email:${email.toLowerCase()}`);
    const ipRateLimit = rateLimitResendVerification(`ip:${clientIp}`);

    if (!emailRateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many verification email requests. Please try again later.',
          retryAfter: emailRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': emailRateLimit.retryAfter?.toString() || '3600',
          },
        }
      );
    }

    if (!ipRateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: ipRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': ipRateLimit.retryAfter?.toString() || '3600',
          },
        }
      );
    }

    // Check if user exists and if email is already verified
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id, email, auth_id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // Don't reveal if user exists for security
    if (userProfile && userProfile.auth_id) {
      // Check if email is already verified
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userProfile.auth_id);

      if (authUser?.user?.email_confirmed_at) {
        // Email already verified, but don't reveal this
        console.log(`Verification email requested for already verified email: ${email}`);
        return NextResponse.json({
          success: true,
          message: 'If your email is not verified, a verification link has been sent.',
        }, { status: 200 });
      }

      // Resend verification email
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/auth/confirm`;

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (resendError) {
        console.error('Resend verification error:', resendError);
        // Don't reveal the error to prevent email enumeration
      } else {
        console.log(`Verification email resent to: ${email}`);
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If your email is not verified, a verification link has been sent.',
    }, { status: 200 });

  } catch (error) {
    console.error('Resend verification API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
