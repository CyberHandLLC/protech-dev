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

          // Generate unique event ID for SessionStart
          const sessionStartEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_session_start';

          // Track with Facebook Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'SessionStart', {
              session_id: sessionIdRef.current,
              entry_url: entryUrl,
              entry_path: pathname,
              referrer: referrer || 'direct',
              source: source,
              timestamp: new Date().toISOString()
            }, {
              eventID: sessionStartEventId
            });
          }

          // Send to Conversions API
          const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1];
          const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1];
          
          fetch('/api/facebook-conversions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              events: [{
                event_name: 'SessionStart',
                event_id: sessionStartEventId,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: entryUrl,
                action_source: 'website',
                user_data: { fbp, fbc },
                custom_data: {
                  session_id: sessionIdRef.current,
                  entry_url: entryUrl,
                  entry_path: pathname,
                  referrer: referrer || 'direct',
                  source: source,
                  timestamp: new Date().toISOString()
                }
              }]
            })
          }).catch(err => console.error('[SessionStart] Conversions API error:', err));

          console.log('[SessionStart] Tracked to Pixel + Conversions API', {
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

    // Track SessionEnd only when user leaves to external site or closes tab
    // We'll use a combination of beforeunload and checking if navigation is internal
    let isInternalNavigation = false;

    // Listen for clicks on internal links to mark as internal navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const currentHost = window.location.hostname;
        const linkHost = new URL(link.href).hostname;
        
        // If clicking a link to the same domain, mark as internal
        if (currentHost === linkHost) {
          isInternalNavigation = true;
          // Reset after a short delay (navigation should happen quickly)
          setTimeout(() => {
            isInternalNavigation = false;
          }, 1000);
        }
      }
    };

    const handleBeforeUnload = () => {
      // Only track SessionEnd if this is NOT an internal navigation
      if (!isInternalNavigation) {
        try {
          const sessionDuration = sessionStartTimeRef.current 
            ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
            : 0;
          
          const exitUrl = typeof window !== 'undefined' ? window.location.href : '';
          
          // Generate unique event ID for SessionEnd
          const sessionEndEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_session_end';
          
          // Track with Facebook Pixel using trackCustom
          if (typeof window !== 'undefined' && typeof (window as any).fbq !== 'undefined') {
            (window as any).fbq('trackCustom', 'SessionEnd', {
              session_id: sessionIdRef.current,
              exit_url: exitUrl,
              exit_path: pathname,
              session_duration_seconds: sessionDuration,
              pages_viewed: pagesViewedRef.current.size,
              timestamp: new Date().toISOString()
            }, {
              eventID: sessionEndEventId
            });
          }

          // Send to Conversions API using sendBeacon for reliability on page unload
          const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1];
          const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1];
          
          const payload = JSON.stringify({
            events: [{
              event_name: 'SessionEnd',
              event_id: sessionEndEventId,
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: exitUrl,
              action_source: 'website',
              user_data: { fbp, fbc },
              custom_data: {
                session_id: sessionIdRef.current,
                exit_url: exitUrl,
                exit_path: pathname,
                session_duration_seconds: sessionDuration,
                pages_viewed: pagesViewedRef.current.size,
                timestamp: new Date().toISOString()
              }
            }]
          });
          
          // Use sendBeacon for reliable delivery during page unload
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/facebook-conversions', payload);
          }

          console.log('[SessionEnd] Tracked to Pixel + Conversions API', {
            session_id: sessionIdRef.current,
            exit_url: exitUrl,
            session_duration: sessionDuration,
            pages_viewed: pagesViewedRef.current.size
          });
        } catch (error) {
          console.error('Error tracking session end:', error);
        }
      }
    };

    // Listen for clicks to detect internal navigation
    document.addEventListener('click', handleClick);
    // Listen for beforeunload to track session end
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
