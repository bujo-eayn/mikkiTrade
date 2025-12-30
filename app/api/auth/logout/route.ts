import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuthEvent, AuditEventType } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let userId: string | undefined;

    // If we have tokens, sign out from Supabase
    if (accessToken && refreshToken) {
      // Set the session first so we can sign out
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // Get user before signing out
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;

      // Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error('Supabase signOut error:', signOutError);
        // Continue anyway to clear cookies
      }

      // Log logout event
      if (userId) {
        await logAuthEvent(request, {
          userId,
          eventType: AuditEventType.LOGOUT,
          success: true,
        });
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });

    // Clear session cookies
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;

  } catch (error) {
    console.error('Logout API error:', error);

    // Even if there's an error, we should still clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });

    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;
  }
}
