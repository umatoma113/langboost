// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader
        color="#29D"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
      />
      {children}
    </SessionProvider>
  );
}
