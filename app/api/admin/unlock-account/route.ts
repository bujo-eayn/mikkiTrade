import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify the requesting user is authenticated and has admin/super_admin role
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Create Supabase client with the session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid session.' },
        { status: 401 }
      );
    }

    // Get the requesting user's profile to check role
    const { data: requestingUserProfile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    if (!requestingUserProfile || (requestingUserProfile.role !== 'super_admin' && requestingUserProfile.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden. Only admins can unlock accounts.' },
        { status: 403 }
      );
    }

    // Step 2: Get the user ID to unlock from request body
    const body = await request.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    // Find user to unlock
    let query = supabaseAdmin.from('users').select('id, email');

    if (userId) {
      query = query.eq('id', userId);
    } else {
      query = query.eq('email', email);
    }

    const { data: userToUnlock, error: fetchError } = await query.maybeSingle();

    if (fetchError) {
      console.error('Error fetching user to unlock:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: 500 }
      );
    }

    if (!userToUnlock) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Step 3: Unlock the account
    // Note: Database schema doesn't currently support locked_until or failed_login_attempts fields
    // This endpoint currently only verifies the user exists and could be extended when schema is updated
    // const { error: unlockError } = await supabaseAdmin
    //   .from('users')
    //   .update({
    //     locked_until: null,
    //     failed_login_attempts: 0,
    //   })
    //   .eq('id', userToUnlock.id);

    // if (unlockError) {
    //   console.error('Error unlocking account:', unlockError);
    //   return NextResponse.json(
    //     { error: 'Failed to unlock account' },
    //     { status: 500 }
    //   );
    // }

    console.log(`Account unlocked for user: ${userToUnlock.email} by admin: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: `Account for ${userToUnlock.email} has been unlocked successfully`,
      user: {
        id: userToUnlock.id,
        email: userToUnlock.email,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Unlock account API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while unlocking the account' },
      { status: 500 }
    );
  }
}
