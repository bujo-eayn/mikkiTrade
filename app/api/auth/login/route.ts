import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { rateLimitLogin, getClientIp } from '@/lib/rate-limit';
import { logAuthEvent, AuditEventType } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Rate limiting - use IP address as identifier
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimitLogin(clientIp);

    if (!rateLimitResult.success) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    console.log('Login attempt for email:', email);

    // Step 0: Check user status BEFORE attempting authentication
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id, email, is_active')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // Note: Account lockout feature disabled - database schema doesn't support locked_until/failed_login_attempts
    // if (userCheck) {
    //   // Check if account is locked
    //   if (userCheck.locked_until) {
    //     const lockedUntil = new Date(userCheck.locked_until);
    //     const now = new Date();
    //
    //     if (now < lockedUntil) {
    //       const minutesRemaining = Math.ceil((lockedUntil.getTime() - now.getTime()) / (1000 * 60));
    //       console.log(`Login attempted for locked account: ${email}, locked for ${minutesRemaining} more minutes`);
    //
    //       return NextResponse.json(
    //         {
    //           error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`,
    //           locked: true,
    //           lockedUntil: userCheck.locked_until,
    //         },
    //         { status: 423 } // 423 Locked
    //       );
    //     } else {
    //       // Lock has expired, reset the lock
    //       await supabaseAdmin
    //         .from('users')
    //         .update({
    //           locked_until: null,
    //           failed_login_attempts: 0,
    //         })
    //         .eq('id', userCheck.id);
    //     }
    //   }
    // }

    // Step 1: Authenticate with Supabase using regular client (not admin)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error:', authError);

      // Note: Failed login tracking disabled - database schema doesn't support failed_login_attempts
      // Increment failed login attempts if user exists
      // if (userCheck) {
      //   const newFailedAttempts = (userCheck.failed_login_attempts || 0) + 1;
      //   const maxAttempts = 5;
      //   const lockoutDurationMinutes = 15;
      //
      //   let updateData: any = {
      //     failed_login_attempts: newFailedAttempts,
      //   };
      //
      //   // Lock account if max attempts reached
      //   if (newFailedAttempts >= maxAttempts) {
      //     const lockUntil = new Date();
      //     lockUntil.setMinutes(lockUntil.getMinutes() + lockoutDurationMinutes);
      //     updateData.locked_until = lockUntil.toISOString();
      //
      //     console.log(`Account locked for ${email} until ${lockUntil.toISOString()}`);
      //
      //     // Log account lockout event
      //     await logAuthEvent(request, {
      //       userId: userCheck.id,
      //       eventType: AuditEventType.ACCOUNT_LOCKED,
      //       success: true,
      //       eventData: {
      //         email,
      //         lockoutDurationMinutes,
      //         failedAttempts: newFailedAttempts,
      //       },
      //     });
      //   }
      //
      //   await supabaseAdmin
      //     .from('users')
      //     .update(updateData)
      //     .eq('id', userCheck.id);
      //
      //   // Log failed login attempt
      //   await logAuthEvent(request, {
      //     userId: userCheck.id,
      //     eventType: AuditEventType.LOGIN_FAILED,
      //     success: false,
      //     errorMessage: 'Invalid credentials',
      //     eventData: {
      //       email,
      //       failedAttempts: newFailedAttempts,
      //     },
      //   });
      //
      //   // Inform user about lockout
      //   if (newFailedAttempts >= maxAttempts) {
      //     return NextResponse.json(
      //       {
      //         error: `Too many failed login attempts. Your account has been locked for ${lockoutDurationMinutes} minutes.`,
      //         locked: true,
      //       },
      //       { status: 423 }
      //     );
      //   } else {
      //     const attemptsRemaining = maxAttempts - newFailedAttempts;
      //     console.log(`Failed login for ${email}. Attempts remaining: ${attemptsRemaining}`);
      //   }
      // }

      if (userCheck) {
        // Log failed login attempt
        await logAuthEvent(request, {
          userId: userCheck.id,
          eventType: AuditEventType.LOGIN_FAILED,
          success: false,
          errorMessage: 'Invalid credentials',
          eventData: {
            email,
          },
        });
      } else {
        // User doesn't exist - log anonymous failed attempt
        await logAuthEvent(request, {
          userId: null,
          eventType: AuditEventType.LOGIN_FAILED,
          success: false,
          errorMessage: 'Invalid credentials - user not found',
          eventData: { email },
        });
      }

      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please confirm your email address before signing in. Check your inbox for the confirmation email.' },
          { status: 401 }
        );
      }

      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password. Please check your credentials.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: authError.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No user returned from authentication' },
        { status: 401 }
      );
    }

    console.log('Auth successful, user ID:', authData.user.id);

    // Step 2: Get user profile from database using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    console.log('Profile query result:', { profile, profileError });

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: `Profile fetch failed: ${profileError.message}` },
        { status: 500 }
      );
    }

    if (!profile) {
      console.error('No profile found for auth_id:', authData.user.id);

      // Try to find by email as fallback
      const { data: profileByEmail } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Profile by email fallback:', profileByEmail);

      if (profileByEmail) {
        // Update the auth_id if we found by email
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ auth_id: authData.user.id })
          .eq('email', email);

        if (updateError) {
          console.error('Failed to update auth_id:', updateError);
        } else {
          console.log('Updated auth_id for existing profile');
          // Retry getting the profile
          const { data: updatedProfile } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('auth_id', authData.user.id)
            .maybeSingle();

          if (updatedProfile) {
            return handleProfileValidation(updatedProfile, authData);
          }
        }
      }

      return NextResponse.json(
        {
          error: 'No admin profile found. Please contact your administrator.',
          details: `Auth user exists but no profile found for auth_id: ${authData.user.id}`
        },
        { status: 404 }
      );
    }

    // Step 3: Validate profile and return
    const response = handleProfileValidation(profile, authData);

    // Log successful login
    await logAuthEvent(request, {
      userId: profile.id,
      eventType: AuditEventType.LOGIN_SUCCESS,
      success: true,
      eventData: {
        email: profile.email,
        role: profile.role,
      },
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);

    // Provide user-friendly error messages without exposing sensitive details
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    let statusCode = 500;

    if (error instanceof Error) {
      // Handle specific known errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 504;
      } else if (error.message.includes('Invalid') || error.message.includes('required')) {
        errorMessage = error.message;
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

function handleProfileValidation(profile: any, authData: any) {
  // Check if user is active
  if (!profile.is_active) {
    return NextResponse.json(
      { error: 'Your account has been deactivated. Please contact an administrator.' },
      { status: 403 }
    );
  }

  // Check if user has admin role
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    return NextResponse.json(
      { error: 'You do not have permission to access the admin portal.' },
      { status: 403 }
    );
  }

  // Update last login timestamp
  supabaseAdmin
    .from('users')
    .update({
      last_login: new Date().toISOString(),
    })
    .eq('id', profile.id)
    .then(({ error }) => {
      if (error) {
        console.error('Failed to update last login:', error);
      } else {
        console.log(`Successful login for ${profile.email}`);
      }
    });

  // Log successful login event
  // Note: We can't use logAuthEvent here because we're inside a helper function
  // So we'll log it from the main handler after calling this function

  // Create response with session data
  const response = NextResponse.json({
    success: true,
    message: 'Login successful',
    session: authData.session,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
    }
  }, { status: 200 });

  // Set session cookies on the response
  // This ensures the proxy can read them immediately
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  response.cookies.set('sb-access-token', authData.session.access_token, {
    path: '/',
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
    path: '/',
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  console.log('Session cookies set on response');

  return response;
}
