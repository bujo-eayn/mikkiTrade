'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success messages from URL
  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccessMessage('Your password has been reset successfully. You can now log in with your new password.');
    } else if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Your email has been verified successfully. You can now log in.');
    } else if (searchParams.get('timeout') === 'true') {
      setError('Your session has expired due to inactivity. Please log in again.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 12) {
        throw new Error('Password must be at least 12 characters');
      }

      console.log('Attempting login for:', email);

      // Call server-side login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('Login response:', { status: response.status, success: data.success });

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.session) {
        throw new Error('No session returned from login');
      }

      // Set the session in the client
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to establish session');
      }

      console.log('Session established, verifying session cookies');

      // Wait for cookies to be written (Next.js/browser cookie sync)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify session was properly set
      const { data: { session: verifiedSession } } = await supabase.auth.getSession();

      console.log('Session verification result:', verifiedSession ? 'Valid' : 'Failed');

      if (!verifiedSession) {
        console.error('Session verification failed - cookies not set');
        console.log('Attempting manual cookie check...');

        // Check if cookies exist
        const cookies = document.cookie;
        console.log('Browser cookies:', cookies.includes('sb-') ? 'Supabase cookies found' : 'No Supabase cookies');

        throw new Error('Session could not be established. Please try again.');
      }

      console.log('Session verified, performing redirect');

      // Production-ready redirect: Use replace() to prevent back button issues
      window.location.replace('/admin/dashboard');

    } catch (err: unknown) {
      console.error('Login error:', err);

      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as { message?: string; error?: string };
        errorMessage = errorObj.message || errorObj.error || JSON.stringify(err);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // Handle specific error messages with user-friendly text
      if (errorMessage.includes('Too many login attempts')) {
        setError('Too many failed login attempts. Please try again in 15 minutes.');
      } else if (errorMessage.includes('Invalid email or password')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in. Check your inbox for the confirmation email.');
      } else if (errorMessage.includes('deactivated')) {
        setError('Your account has been deactivated. Please contact support for assistance.');
      } else if (errorMessage.includes('not authorized') || errorMessage.includes('permission')) {
        setError('You do not have permission to access this admin portal.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#a235c3] flex items-center justify-center p-4">
      {/* Demo Badge */}
      {/* <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-50">
        🎬 DEMO MODE
      </div> */}

      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-2xl shadow-2xl mb-4">
            <Image
              src="/images/logo-motors.png"
              alt="Mikki Trade Motors"
              width={120}
              height={120}
              className="w-auto h-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-cyan-200">Mikki Trade Motors Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="admin@mikkitrade.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#a235c3] focus:ring-[#a235c3] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/admin/forgot-password" className="text-sm text-[#a235c3] hover:text-[#8b2da3] font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">ℹ️ Authentication Required</p>
            <p className="text-xs text-blue-600">
              Please sign in with your authorized admin credentials to access the portal
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Admin Portal Features</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">✅</span> Vehicle Management
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">✅</span> Inquiry Tracking
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">✅</span> Image Upload
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">✅</span> Analytics
              </div>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white hover:text-cyan-200 text-sm transition-colors"
          >
            ← Back to Mikki Trade
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#a235c3] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
