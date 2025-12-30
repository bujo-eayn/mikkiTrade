import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { rateLimitSignup, getClientIp } from '@/lib/rate-limit';
import { validatePassword } from '@/lib/password-validation';
import { logAuthEvent, AuditEventType } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone, secretToken } = body;

    // Rate limiting - use IP address as identifier
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimitSignup(clientIp);

    if (!rateLimitResult.success) {
      console.log(`Signup rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          error: 'Too many signup attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    // Verify secret token from environment variable
    const EXPECTED_TOKEN = process.env.ADMIN_SIGNUP_SECRET;

    if (!EXPECTED_TOKEN) {
      console.error('ADMIN_SIGNUP_SECRET environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    if (secretToken !== EXPECTED_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, and fullName are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists in the users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Step 1: Create auth user using admin client (bypasses RLS)
    // Email verification is required for production security
    const emailConfirmEnabled = process.env.EMAIL_CONFIRM_ENABLED === 'true';
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/auth/confirm`;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: !emailConfirmEnabled, // Auto-confirm only if email verification is disabled
      user_metadata: {
        full_name: fullName,
        phone: phone || null,
      },
      ...(emailConfirmEnabled && {
        email_redirect_to: redirectUrl,
      }),
    });

    if (authError) {
      console.error('Auth user creation error:', authError);

      // Handle specific Supabase auth errors
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: authError.message || 'Failed to create authentication account' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account - no user returned' },
        { status: 500 }
      );
    }

    // Step 2: Create user profile in database using admin client (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: email,
        full_name: fullName,
        phone: phone || null,
        role: 'admin',
        is_active: true,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);

      // Try to clean up the auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user after profile error:', cleanupError);
      }

      return NextResponse.json(
        { error: `Profile creation failed: ${profileError.message}` },
        { status: 500 }
      );
    }

    // Step 3: Email confirmation
    const emailConfirmMessage = emailConfirmEnabled
      ? 'Account created successfully! Please check your email to verify your account before logging in.'
      : 'Account created successfully! You can now login with your credentials.';

    // Log successful signup
    await logAuthEvent(request, {
      userId: authData.user.id,
      eventType: AuditEventType.SIGNUP_SUCCESS,
      success: true,
      eventData: {
        email,
        role: 'admin',
        requiresEmailVerification: emailConfirmEnabled,
      },
    });

    return NextResponse.json({
      success: true,
      message: emailConfirmMessage,
      requiresEmailVerification: emailConfirmEnabled,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup API error:', error);

    // Provide user-friendly error messages without exposing sensitive details
    let errorMessage = 'An unexpected error occurred during signup. Please try again later.';
    let statusCode = 500;

    if (error instanceof Error) {
      // Handle specific known errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 504;
      } else if (error.message.includes('Invalid') || error.message.includes('required') || error.message.includes('Missing')) {
        errorMessage = error.message;
        statusCode = 400;
      } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        errorMessage = 'An account with this email already exists.';
        statusCode = 409;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
