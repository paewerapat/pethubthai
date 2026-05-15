'use client';

import { FaGoogle, FaFacebook, FaLine } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Props {
  redirect?: string;
}

export default function SocialLoginButtons({ redirect = '/' }: Props) {
  function startOAuth(provider: 'google' | 'facebook' | 'line') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('oauth_redirect', redirect);
    }
    window.location.href = `${API_URL}/auth/${provider}`;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => startOAuth('google')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium text-base hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
      >
        <FaGoogle className="w-5 h-5 text-[#EA4335]" />
        เข้าสู่ระบบด้วย Google
      </button>

      <button
        type="button"
        onClick={() => startOAuth('facebook')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium text-base hover:border-[#1877F2]/30 hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-sm"
      >
        <FaFacebook className="w-5 h-5 text-[#1877F2]" />
        เข้าสู่ระบบด้วย Facebook
      </button>

      <button
        type="button"
        onClick={() => startOAuth('line')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-[#06C755]/30 bg-[#06C755] text-white font-medium text-base hover:bg-[#05b34d] active:scale-95 transition-all duration-200 shadow-sm"
      >
        <FaLine className="w-5 h-5" />
        เข้าสู่ระบบด้วย LINE
      </button>
    </div>
  );
}
