import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip API routes and static files
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Only run on admin routes
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip auth check for login, signup, and password reset pages
  if (
    path === '/admin/login' ||
    path === '/admin/secret-signup' ||
    path.startsWith('/admin/secret-signup/') ||
    path === '/admin/forgot-password' ||
    path === '/admin/reset-password' ||
    path.startsWith('/admin/auth/confirm')
  ) {
    return NextResponse.next();
  }

  try {
    // Get access token from cookies
    const accessToken = req.cookies.get('sb-access-token')?.value;
    const refreshToken = req.cookies.get('sb-refresh-token')?.value;

    if (!accessToken) {
      console.log('Proxy: No access token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Create Supabase client to verify the session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Set the session
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });

    if (sessionError || !session) {
      console.log('Proxy: Invalid session, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Verify user has admin role using service role key
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role, is_active')
      .eq('auth_id', session.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.log('Proxy: No profile found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Check if user is active
    if (!profile.is_active) {
      console.log('Proxy: User account is inactive');
      const redirectResponse = NextResponse.redirect(new URL('/admin/login?error=account_inactive', req.url));
      // Clear cookies for inactive accounts
      redirectResponse.cookies.delete('sb-access-token');
      redirectResponse.cookies.delete('sb-refresh-token');
      return redirectResponse;
    }

    // Check if user has admin or super_admin role
    if (profile.role !== 'admin' && profile.role !== 'super_admin') {
      console.log('Proxy: User does not have admin role');
      const redirectResponse = NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url));
      // Clear cookies for unauthorized users
      redirectResponse.cookies.delete('sb-access-token');
      redirectResponse.cookies.delete('sb-refresh-token');
      return redirectResponse;
    }

    // Log session status for debugging
    console.log('[Proxy] Path:', path, '| Session:', '✅ Valid', '| Cookies:', 'Found');

    // User is authenticated and authorized, allow access
    return NextResponse.next();

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
