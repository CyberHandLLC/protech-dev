'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

/**
 * ContactPageTracker Component
 * 
 * Tracks when users visit the contact page - a key conversion step
 * indicating high intent to request HVAC service
 */
export default function ContactPageTracker() {
  const { trackCustomEvent } = useFacebookEvents();
  
  useEffect(() => {
    // Track contact page view as a custom conversion event
    // Add delay to ensure _fbp cookie is set for better Event Match Quality
    const trackContact = async () => {
      try {
        await trackCustomEvent('ContactPageViewed', {
          customData: {
            contentName: 'Contact Page',
            contentCategory: 'contact',
            contentType: 'contact_page',
            source: 'contact_page_visit'
          }
        });
        
        console.log('[ContactPageViewed] User visited contact page');
      } catch (error) {
        console.error('Error tracking contact page view:', error);
      }
    };
    
    // Delay to ensure pixel is initialized and _fbp cookie is set
    const timer = setTimeout(trackContact, 500);
    
    return () => clearTimeout(timer);
  }, [trackCustomEvent]);
  
  return null;
}
