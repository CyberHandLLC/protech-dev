'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';

/**
 * ScrollDepthTracker Component
 * 
 * Tracks how far users scroll on each page
 * Fires events at key milestones: 25%, 50%, 75%, 100%
 */
export default function ScrollDepthTracker() {
  const pathname = usePathname();
  const milestonesTrackedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset milestones on page change
    milestonesTrackedRef.current = new Set();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

      // Define milestones
      const milestones = [
        { threshold: 25, label: '25%' },
        { threshold: 50, label: '50%' },
        { threshold: 75, label: '75%' },
        { threshold: 100, label: '100%' }
      ];

      milestones.forEach(({ threshold, label }) => {
        if (scrollPercentage >= threshold && !milestonesTrackedRef.current.has(threshold)) {
          milestonesTrackedRef.current.add(threshold);
          
          // Track scroll depth milestone to Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'ScrollDepth', {
              depth_percentage: threshold,
              page_path: pathname,
              engagement_level: threshold >= 75 ? 'high' : threshold >= 50 ? 'medium' : 'low'
            });
          }
          
          // Track to Vercel Analytics
          try {
            track('scroll', {
              depth_percentage: threshold,
              page_path: pathname,
              engagement_level: threshold >= 75 ? 'high' : threshold >= 50 ? 'medium' : 'low'
            });
          } catch (error) {
            console.error('[ScrollDepth] Vercel Analytics error:', error);
          }
          
          console.log(`[ScrollDepth] ${label} on ${pathname} - tracked to Meta + Vercel`);
        }
      });
    };

    // Throttle scroll events for performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 200);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [pathname]);

  return null;
}
