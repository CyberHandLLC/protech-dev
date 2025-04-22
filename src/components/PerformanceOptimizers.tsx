'use client';

import dynamic from 'next/dynamic';

// Import optimizers with no SSR to avoid server-side execution
const TBTOptimizer = dynamic(
  () => import('@/components/TBTOptimizer'),
  { ssr: false }
);

const MobileOptimizer = dynamic(
  () => import('@/components/MobileOptimizer'),
  { ssr: false }
);

const MobilePerformanceManager = dynamic(
  () => import('@/components/MobilePerformanceManager'),
  { ssr: false }
);

/**
 * Performance Optimizers Component
 * 
 * This component loads all performance optimization components
 * It's separated into a client component to allow using dynamic imports with ssr: false
 */
export default function PerformanceOptimizers() {
  return (
    <>
      <TBTOptimizer />
      <MobileOptimizer />
      <MobilePerformanceManager />
    </>
  );
}
