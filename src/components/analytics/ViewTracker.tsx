'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

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
  
  useEffect(() => {
    // Track a view content event for important pages
    const trackView = async () => {
      try {
        const pageName = contentName || pathname.split('/').pop() || pathname;
        const pageCategory = contentCategory || pathname.split('/')[1] || 'general';
        
        await trackViewContent({
          customData: {
            contentName: pageName,
            contentCategory: pageCategory,
            contentType: contentType
          }
        });
        
        console.log('Page view tracked:', pathname);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    
    trackView();
  }, [pathname, contentType, contentName, contentCategory, trackViewContent]);
  
  // This component doesn't render anything
  return null;
}
