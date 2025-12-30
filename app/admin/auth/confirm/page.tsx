'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function EmailConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token from URL hash (Supabase sends it in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (!accessToken || type !== 'signup') {
          setStatus('error');
          setMessage('Invalid confirmation link. The link may be expired or malformed.');
          return;
        }

        // Set the session using the access token
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });

        if (error) {
          console.error('Email confirmation error:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email. Please try again.');
          return;
        }

        // Success!
        setStatus('success');
        setMessage('Your email has been verified successfully!');

        // Sign out after confirmation (user needs to login properly)
        await supabase.auth.signOut();

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/admin/login?verified=true');
        }, 3000);

      } catch (err) {
        console.error('Email confirmation error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please contact support.');
      }
    };

    confirmEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#a235c3] flex items-center justify-center p-4">
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
          <h1 className="text-3xl font-bold text-white mb-2">Email Verification</h1>
          <p className="text-cyan-200">Mikki Trade Motors Admin Portal</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-[#a235c3] animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifying Email</h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  You can now sign in to the admin portal with your credentials.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/admin/login"
                  className="block w-full bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  Go to Login
                </Link>
                <p className="text-sm text-gray-500">
                  If you continue to have issues, please contact your administrator.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmailConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#a235c3] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <EmailConfirmContent />
    </Suspense>
  );
}
