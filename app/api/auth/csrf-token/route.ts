import { NextRequest, NextResponse } from 'next/server';
import { createCSRFToken } from '@/lib/csrf';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      // For unauthenticated requests, use IP as session ID
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const sessionId = `guest:${ip}`;
      const token = createCSRFToken(sessionId);

      return NextResponse.json({
        token,
        sessionId: 'guest',
      }, { status: 200 });
    }

    // Get user from session
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
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Generate CSRF token using user ID as session identifier
    const token = createCSRFToken(user.id);

    return NextResponse.json({
      token,
      sessionId: user.id,
    }, { status: 200 });

  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
