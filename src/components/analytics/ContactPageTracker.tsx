'use client';

import { ReactNode } from 'react';

/**
 * ContactPageTracker Component
 * 
 * Client component that wraps the Contact page content and adds analytics tracking
 */
export default function ContactPageTracker({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
