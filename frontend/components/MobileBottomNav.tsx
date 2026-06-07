'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiHeart, FiUser, FiPlus } from 'react-icons/fi';
import { getToken } from '@/lib/api';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [pathname]);

  const items = [
    { href: '/', label: 'หน้าแรก', icon: FiHome },
    { href: '/posts', label: 'ตามหาน้อง', icon: FiSearch },
    { href: '/post/create', label: 'แจ้งหาย', icon: FiPlus, primary: true },
    { href: '/adopt', label: 'หาบ้าน', icon: FiHeart },
    { href: loggedIn ? '/my-posts' : '/login', label: 'โปรไฟล์', icon: FiUser },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-end">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

          if (primary) {
            return (
              <Link key={label} href={href} className="relative flex flex-col items-center -mt-7">
                <span className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5fca9f] to-[#4db889] flex items-center justify-center shadow-lg shadow-[#5fca9f]/40 ring-4 ring-white">
                  <Icon className="w-6 h-6 text-white" />
                </span>
                <span className="text-[11px] font-semibold text-[#5fca9f] mt-1 mb-2">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon className={`w-5 h-5 ${active ? 'text-[#5fca9f]' : 'text-gray-400'}`} />
              <span className={`text-[11px] font-medium ${active ? 'text-[#5fca9f]' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
