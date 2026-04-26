'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/api';

export default function AuthCallbackPage() {
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#5fca9f] to-[#6bb8e3] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <span className="text-4xl">🐾</span>
        </div>
        <p className="text-gray-500 text-lg">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}
