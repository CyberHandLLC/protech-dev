'use client';

import { ReactNode } from 'react';

/**
 * AboutPageTracker Component
 * 
 * Client component that wraps the About page content and adds analytics tracking
 */
export default function AboutPageTracker({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
