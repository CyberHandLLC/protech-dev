'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';

/**
 * TimeOnPageTracker Component
 * 
 * Tracks how long users spend on each page
 * Fires engagement events at key milestones: 10s, 30s, 60s, 120s
 */
export default function TimeOnPageTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const milestonesTrackedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset on page change
    startTimeRef.current = Date.now();
    milestonesTrackedRef.current = new Set();

    const milestones = [10000, 30000, 60000, 120000]; // 10s, 30s, 60s, 120s

    const checkMilestones = () => {
      const timeOnPage = Date.now() - startTimeRef.current;

      milestones.forEach(milestone => {
        if (timeOnPage >= milestone && !milestonesTrackedRef.current.has(milestone)) {
          milestonesTrackedRef.current.add(milestone);
          
          // Track engagement milestone to Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'TimeOnPage', {
              duration_seconds: milestone / 1000,
              page_path: pathname,
              engagement_level: milestone >= 60000 ? 'high' : milestone >= 30000 ? 'medium' : 'low'
            });
          }
          
          // Track to Vercel Analytics
          try {
            track('time_on_page', {
              duration_seconds: milestone / 1000,
              page_path: pathname,
              engagement_level: milestone >= 60000 ? 'high' : milestone >= 30000 ? 'medium' : 'low'
            });
          } catch (error) {
            console.error('[TimeOnPage] Vercel Analytics error:', error);
          }
          
          console.log(`[TimeOnPage] ${milestone / 1000}s on ${pathname} - tracked to Meta + Vercel`);
        }
      });
    };

    // Check every 5 seconds
    const interval = setInterval(checkMilestones, 5000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
