'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * SessionTracker Component
 * 
 * Tracks user sessions from start to end:
 * - SessionStart: Fires once when user first arrives
 * - SessionEnd: Fires when user leaves the site
 * 
 * Provides session-level metrics:
 * - Session duration
 * - Pages viewed
 * - Entry/exit URLs
 * - Total events triggered
 */
export default function SessionTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const pagesViewedRef = useRef<Set<string>>(new Set());
  const hasTrackedSessionStartRef = useRef<boolean>(false);

  useEffect(() => {
    // Generate session ID once per session
    if (!sessionIdRef.current) {
      sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStartTimeRef.current = Date.now();
      
      // Store in sessionStorage to persist across page navigations
      sessionStorage.setItem('fb_session_id', sessionIdRef.current);
      sessionStorage.setItem('fb_session_start', sessionStartTimeRef.current.toString());
    } else {
      // Retrieve from sessionStorage if page was refreshed
      const storedSessionId = sessionStorage.getItem('fb_session_id');
      const storedStartTime = sessionStorage.getItem('fb_session_start');
      
      if (storedSessionId) sessionIdRef.current = storedSessionId;
      if (storedStartTime) sessionStartTimeRef.current = parseInt(storedStartTime);
    }

    // Track pages viewed
    pagesViewedRef.current.add(pathname);

    // Track SessionStart event (only once per session)
    // Check if we've already tracked this session
    const hasTrackedSession = sessionStorage.getItem('fb_session_tracked');
    
    if (!hasTrackedSessionStartRef.current && !hasTrackedSession) {
      hasTrackedSessionStartRef.current = true;
      sessionStorage.setItem('fb_session_tracked', 'true');
      
      const trackSessionStart = () => {
        try {
          const referrer = typeof document !== 'undefined' ? document.referrer : '';
          const entryUrl = typeof window !== 'undefined' ? window.location.href : '';
          
          // Determine traffic source
          let source = 'direct';
          if (referrer) {
            if (referrer.includes('google')) source = 'google';
            else if (referrer.includes('facebook') || referrer.includes('fb')) source = 'facebook';
            else if (referrer.includes('instagram')) source = 'instagram';
            else source = 'referral';
          }

          // Track with Facebook Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'SessionStart', {
              session_id: sessionIdRef.current,
              entry_url: entryUrl,
              entry_path: pathname,
              referrer: referrer || 'direct',
              source: source,
              timestamp: new Date().toISOString()
            });
          }

          console.log('[SessionStart]', {
            session_id: sessionIdRef.current,
            entry_url: entryUrl,
            entry_path: pathname,
            source: source
          });
        } catch (error) {
          console.error('Error tracking session start:', error);
        }
      };

      // Small delay to ensure pixel is initialized
      setTimeout(trackSessionStart, 500);
    }

    // Track SessionEnd when user actually leaves the site
    const handleBeforeUnload = () => {
      try {
        const sessionDuration = sessionStartTimeRef.current 
          ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
          : 0;
        
        const exitUrl = typeof window !== 'undefined' ? window.location.href : '';
        
        // Track with Facebook Pixel using trackCustom
        if (typeof window !== 'undefined' && typeof (window as any).fbq !== 'undefined') {
          (window as any).fbq('trackCustom', 'SessionEnd', {
            session_id: sessionIdRef.current,
            exit_url: exitUrl,
            exit_path: pathname,
            session_duration_seconds: sessionDuration,
            pages_viewed: pagesViewedRef.current.size,
            timestamp: new Date().toISOString()
          });
        }

        console.log('[SessionEnd]', {
          session_id: sessionIdRef.current,
          exit_url: exitUrl,
          session_duration: sessionDuration,
          pages_viewed: pagesViewedRef.current.size
        });
      } catch (error) {
        console.error('Error tracking session end:', error);
      }
    };

    // Only listen for beforeunload (actual page close/navigation)
    // Do NOT track on visibility change to avoid firing when switching tabs
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
