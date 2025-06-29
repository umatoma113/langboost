'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.set(0.4);

    NProgress.done();

  }, [pathname]);

  return null;
}
