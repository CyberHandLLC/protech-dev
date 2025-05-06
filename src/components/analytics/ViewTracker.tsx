'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

interface ViewTrackerProps {
  contentType?: string;
  contentName?: string;
  contentCategory?: string;
}

/**
 * ViewTracker Component
 * 
 * A client component that tracks page views and content views for Facebook events
 * This should be added to key pages to track user engagement
 */
export default function ViewTracker({ 
  contentType = 'page',
  contentName,
  contentCategory 
}: ViewTrackerProps) {
  const pathname = usePathname();
  const { trackViewContent } = useFacebookEvents();
  const { trackViewContent: trackServerViewContent } = useFacebookServerEvents();
  const { trackServiceView } = useGoogleTracking();
  
  useEffect(() => {
    // Track a view content event for important pages
    const trackView = async () => {
      try {
        const pageName = contentName || pathname.split('/').pop() || pathname;
        const pageCategory = contentCategory || pathname.split('/')[1] || 'general';
        
        // 1. Track with Facebook client-side
        await trackViewContent({
          customData: {
            contentName: pageName,
            contentCategory: pageCategory,
            contentType: contentType
          }
        });
        
        // 2. Track with Facebook server-side
        await trackServerViewContent({
          contentName: pageName,
          contentCategory: pageCategory,
          contentType: contentType
        });
        
        // 3. Track with Google Analytics
        trackServiceView(
          pageName, 
          pageCategory,
          contentType === 'service_page' ? 50 : 0 // Assign value if it's a service page
        );
        
        console.log('Content view tracked on all platforms:', pageName);
      } catch (error) {
        console.error('Error tracking content view:', error);
      }
    };
    
    trackView();
  }, [pathname, contentType, contentName, contentCategory, trackViewContent, trackServerViewContent, trackServiceView]);
  
  // This component doesn't render anything
  return null;
}
