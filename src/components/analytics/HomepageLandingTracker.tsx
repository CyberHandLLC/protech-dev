'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * HomepageLandingTracker Component
 * 
 * Tracks when a user initially lands on the homepage
 * Only fires once per session, not on every homepage visit
 */
export default function HomepageLandingTracker() {
  const pathname = usePathname();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Only track if on homepage and haven't tracked yet
    if (pathname === '/' && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      
      // Log homepage landing
      console.log('[Homepage Landing] User landed on homepage');
      
      // Note: PageView event already fires, this is just for additional context
      // You can add custom tracking here if needed in the future
    }
  }, [pathname]);

  return null;
}
