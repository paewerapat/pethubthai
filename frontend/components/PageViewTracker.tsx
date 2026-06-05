'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logEvent, getToken } from '@/lib/api';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = !!getToken();
    logEvent('page_view', {
      metadata: { page: pathname, isLoggedIn },
    });
  }, [pathname]);

  return null;
}
