'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/api';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    }
    const redirect =
      (typeof window !== 'undefined' && localStorage.getItem('oauth_redirect')) || '/';
    localStorage.removeItem('oauth_redirect');
    router.replace(redirect);
  }, [router, searchParams]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <img src="/images/logo-icon.png" alt="PetHub Thai" className="w-16 h-16 rounded-2xl object-cover mx-auto animate-pulse shadow-lg" />
        <p className="text-gray-500 text-lg">กำลังเข้าสู่ระบบ...</p>
        <Suspense>
          <AuthCallbackInner />
        </Suspense>
      </div>
    </div>
  );
}
