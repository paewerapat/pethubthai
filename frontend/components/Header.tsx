'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ตามหาน้อง' },
    { href: '/posts', label: 'หาบ้าน' },
    { href: '/about', label: 'บทความ' },
    { href: '/shop', label: 'ร้านค้า' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-lg border-b border-white/50">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5fca9f] to-[#6bb8e3] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <span className="text-3xl">🐾</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#5fca9f] to-[#6bb8e3] bg-clip-text text-transparent leading-none">
                PetHub TH
              </span>
              <span className="text-xs text-gray-500 mt-0.5">ช่วยน้องกลับบ้าน</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-[#5fca9f]/10 text-[#5fca9f]'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#5fca9f]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-base font-medium text-gray-700 hover:text-[#5fca9f] px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/post/create"
              className="btn-primary text-base"
            >
              <span>โพสต์ตามหา</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
