import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getClientIp } from '@/lib/rate-limit';

// In-memory rate limiter for password reset
// In production, use Redis or a database
const resetAttempts = new Map<string, { count: number; resetTime: number }>();

function rateLimitPasswordReset(identifier: string): {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const maxAttempts = 3;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const now = Date.now();
  const entry = resetAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    resetAttempts.set(identifier, { count: 1, resetTime });
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
  resetAttempts.set(identifier, entry);
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

    // Rate limiting - use email as identifier (also check IP)
    const clientIp = getClientIp(request);
    const emailRateLimit = rateLimitPasswordReset(`email:${email.toLowerCase()}`);
    const ipRateLimit = rateLimitPasswordReset(`ip:${clientIp}`);

    if (!emailRateLimit.success) {
      console.log(`Password reset rate limit exceeded for email: ${email}`);
      return NextResponse.json(
        {
          error: 'Too many password reset attempts for this email. Please try again later.',
          retryAfter: emailRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': emailRateLimit.retryAfter?.toString() || '3600',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(emailRateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    if (!ipRateLimit.success) {
      console.log(`Password reset rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          error: 'Too many password reset attempts. Please try again later.',
          retryAfter: ipRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': ipRateLimit.retryAfter?.toString() || '3600',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(ipRateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    // Check if user exists (don't reveal this to the client for security)
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id, email, is_active')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (userProfile && userProfile.is_active) {
      // Create Supabase client for password reset
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Send password reset email
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        console.error('Password reset email error:', resetError);
        // Don't reveal the error to the client
      } else {
        console.log(`Password reset email sent to: ${email}`);
      }
    } else {
      console.log(`Password reset requested for non-existent or inactive user: ${email}`);
    }

    // Always return success (prevent email enumeration)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password API error:', error);

    // Generic error message for security
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}
