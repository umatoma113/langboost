'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // すぐ完了するわけではないので少し遅延させてから完了
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // 体感で調整（例：500ms）

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
