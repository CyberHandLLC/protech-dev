'use client';

import { ReactNode } from 'react';
import GlobalSEO from './GlobalSEO';
import dynamic from 'next/dynamic';

// Dynamically import the analytics provider to prevent SSR issues
const AnalyticsProvider = dynamic(() => import('./analytics/AnalyticsProvider'), {
  ssr: false
});

/**
 * ClientGlobalSEO Component
 * 
 * A client component wrapper for GlobalSEO to properly handle client-side rendering
 * This solves the "ssr: false is not allowed with next/dynamic in Server Components" error
 */
export default function ClientGlobalSEO({ 
  children,
  pageFAQs,
  includeFAQs
}: { 
  children: ReactNode;
  pageFAQs?: Array<{
    question: string;
    answer: string;
  }>;
  includeFAQs?: boolean;
}) {
  return (
    <GlobalSEO pageFAQs={pageFAQs} includeFAQs={includeFAQs}>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </GlobalSEO>
  );
}
