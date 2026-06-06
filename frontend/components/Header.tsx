'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiUser, FiLogOut, FiChevronDown, FiSearch, FiHome, FiShield } from 'react-icons/fi';
import { getToken, clearToken, getMe, type AuthUser } from '@/lib/api';
import { toast } from 'sonner';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (getToken()) {
      getMe()
        .then(setUser)
        .catch(() => clearToken());
    }

    const raw = sessionStorage.getItem('pending_toast');
    if (raw) {
      sessionStorage.removeItem('pending_toast');
      try {
        const { type, msg } = JSON.parse(raw);
        if (type === 'success') toast.success(msg);
        else toast.error(msg);
      } catch {}
    }
  }, [pathname]);

  function handleLogout() {
    clearToken();
    setUser(null);
    setDropdownOpen(false);
    toast.success('ออกจากระบบเรียบร้อยแล้ว');
    router.push('/');
  }

  const navItems = [
    { href: '/', label: 'กลับบ้าน' },
    { href: '/posts', label: 'ตามหาน้อง' },
    { href: '/adopt', label: 'หาบ้านให้น้อง' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-lg border-b border-white/50">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <img
              src="/images/logo-width-transparent.png"
              alt="PetHub Thai"
              className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
            />
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

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5fca9f] hover:bg-[#5fca9f]/5 transition-colors font-medium"
                        >
                          <FiShield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/my-posts"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        โพสต์ของฉัน
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-base font-medium text-gray-700 hover:text-[#5fca9f] px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setPostMenuOpen((o) => !o)}
                className="btn-primary text-base"
              >
                <span>เพิ่มโพสต์</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {postMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPostMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                    <Link
                      href="/post/create"
                      onClick={() => setPostMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiSearch className="w-4 h-4 text-[#5fca9f]" />
                      โพสต์ตามหาน้อง
                    </Link>
                    <Link
                      href="/adopt/create"
                      onClick={() => setPostMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiHome className="w-4 h-4 text-[#5fca9f]" />
                      ลงประกาศหาบ้านให้น้อง
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="เมนู"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pt-4 pb-3 mt-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[#5fca9f]/10 text-[#5fca9f]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5fca9f] font-medium hover:bg-[#5fca9f]/5 rounded-xl"
                    >
                      <FiShield className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/my-posts"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <FiUser className="w-4 h-4" /> โพสต์ของฉัน
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <FiLogOut className="w-4 h-4" /> ออกจากระบบ
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
              <Link
                href="/post/create"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 btn-primary w-full text-base"
              >
                <span>ประกาศตามหาน้อง</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
