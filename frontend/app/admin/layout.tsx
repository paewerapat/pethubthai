'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getToken, getMe, type AuthUser } from '@/lib/api';
import { FiGrid, FiUsers, FiFileText, FiLogOut, FiMenu } from 'react-icons/fi';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { href: '/admin/users', label: 'ผู้ใช้งาน', icon: FiUsers },
  { href: '/admin/posts', label: 'จัดการโพสต์', icon: FiFileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!getToken()) { notFound(); return; }
    getMe().then((u) => {
      if (u.role !== 'admin') { notFound(); return; }
      setUser(u);
      setChecking(false);
    }).catch(() => notFound());
  }, []);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-white animate-pulse">กำลังตรวจสอบสิทธิ์...</div>
    </div>
  );

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="px-6 py-5 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">PetHub Thai</p>
        <p className="font-bold text-lg">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-[#5fca9f] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-gray-500">เข้าสู่ระบบในฐานะ</p>
          <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <FiLogOut className="w-4 h-4 shrink-0" />
          กลับสู่เว็บไซต์
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-800">
        <Sidebar />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 bg-gray-900">
          <button className="lg:hidden p-1 text-gray-400" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-white">
            {NAV.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label ?? 'Admin'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
