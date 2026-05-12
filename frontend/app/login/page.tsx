'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Layout from '@/components/Layout';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { login, setToken } from '@/lib/api';

const schema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await login(data.email, data.password);
      setToken(res.access_token);
      router.push(redirect);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }

  return (
    <div className="card">
      <SocialLoginButtons redirect={redirect} />

      <div className="flex items-center gap-3 my-5">
        <hr className="flex-1 border-gray-200" />
        <span className="text-sm text-gray-400">หรือเข้าสู่ระบบด้วยอีเมล</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 ${
            errors.email
              ? 'border-red-300 focus-within:ring-red-200'
              : 'border-gray-200 focus-within:border-[#5fca9f] focus-within:ring-[#5fca9f]/30'
          }`}>
            <FiMail className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 ${
            errors.password
              ? 'border-red-300 focus-within:ring-red-200'
              : 'border-gray-200 focus-within:border-[#5fca9f] focus-within:ring-[#5fca9f]/30'
          }`}>
            <FiLock className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่านของคุณ"
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              กำลังเข้าสู่ระบบ...
            </>
          ) : (
            'เข้าสู่ระบบ'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        ยังไม่มีบัญชี?{' '}
        <Link
          href="/register"
          className="text-[#5fca9f] hover:text-[#4db889] font-medium transition-colors"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/logo-icon.png" alt="PetHub Thai" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
            <h1 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
            <p className="text-gray-500 mt-2">ยินดีต้อนรับกลับมา PetHub TH</p>
          </div>
          <Suspense fallback={<div className="card animate-pulse h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
