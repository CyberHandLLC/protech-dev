'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

/**
 * PageViewTracker Component
 * 
 * Automatically tracks page views across the website using:
 * - Facebook Pixel (client-side)
 * - Facebook Conversions API (server-side)
 * - Google Analytics 4
 * - Google Tag Manager
 * 
 * This component should be placed in the root layout to track all page navigations.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);
  
  // Initialize tracking hooks
  const { trackPageView: trackFacebookPageView } = useFacebookEvents();
  const { trackPageView: trackServerPageView } = useFacebookServerEvents();
  const { trackPageView: trackGooglePageView } = useGoogleTracking();
  
  useEffect(() => {
    // Get the full URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Don't track the same page view twice in a row
    if (url === previousPathRef.current) return;
    
    // Update the previous path for future comparisons
    previousPathRef.current = url;
    
    // Track page view with all tracking systems
    try {
      // Client-side Facebook tracking
      trackFacebookPageView({
        customData: {
          contentName: getPageTitle(pathname),
          contentCategory: getPageCategory(pathname)
        }
      });
      
      // Server-side Facebook tracking
      trackServerPageView({
        pageUrl: url,
        pageTitle: getPageTitle(pathname)
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
    
  }, [pathname, searchParams, trackFacebookPageView, trackServerPageView, trackGooglePageView]);
  
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
