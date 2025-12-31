'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useGoogleTracking from '@/hooks/useGoogleTracking';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import { useTracking } from '@/context/TrackingContext';

/**
 * PageViewTracker Component
 * 
 * Automatically tracks page views across the website using:
 * - Facebook Conversions API (server-side for Event Match Quality)
 * - Google Analytics 4
 * - Google Tag Manager
 * 
 * Note: Facebook/Meta Pixel also tracks PageView automatically (client-side).
 * Server-side tracking via Conversions API improves Event Match Quality by sending fbp/fbc parameters.
 * 
 * This component should be placed in the root layout to track all page navigations.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);
  
  // Initialize tracking hooks
  const { trackPageView: trackGooglePageView } = useGoogleTracking();
  const { trackPageView: trackFacebookServerPageView } = useFacebookServerEvents();
  
  // Get global tracking context
  const { isTrackingEnabled, pageViewTracked, setPageViewTracked, trackEvent } = useTracking();
  
  useEffect(() => {
    // Skip if tracking is disabled
    if (!isTrackingEnabled) return;
    
    // Get the full URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Prevent duplicate page views - don't track the same URL twice in a row
    if (url === previousPathRef.current) return;
    
    // Update tracking reference for future comparisons
    previousPathRef.current = url;
    
    // Use global tracking context to prevent duplicate tracking
    const uniqueId = `page_view:${url}`;
    if (!trackEvent('page_view', url, uniqueId)) {
      console.log('Page view event throttled by global context');
      return;
    }
    
    // Track page view with both Facebook Conversions API and Google Analytics
    try {
      // Facebook Conversions API (server-side) - improves Event Match Quality
      trackFacebookServerPageView({
        pageUrl: window.location.href,
        pageTitle: getPageTitle(pathname),
        pageCategory: getPageCategory(pathname)
      });
      
      // Google Analytics tracking
      trackGooglePageView(
        'webpage',
        getPageTitle(pathname),
        {
          page_path: pathname,
          page_location: window.location.href
        }
      );
      
      console.log(`Page view tracked: ${pathname}`);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
    
  }, [pathname, searchParams, trackGooglePageView]);
  
  return null; // This component doesn't render anything
}

/**
 * Get a human-readable page title based on the URL path
 */
function getPageTitle(path: string): string {
  // Extract the last part of the path
  const pageName = path.split('/').filter(Boolean).pop() || 'home';
  
  // Clean up and capitalize
  return pageName
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get the page category for analytics based on URL structure
 */
function getPageCategory(path: string): string {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Home';
  if (segments[0] === 'services') return 'Services';
  if (segments[0] === 'about') return 'About';
  if (segments[0] === 'contact') return 'Contact';
  if (segments[0] === 'blog') return 'Blog';
  
  return 'Other';
}
