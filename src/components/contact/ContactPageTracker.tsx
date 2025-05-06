'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import ViewTracker from '../analytics/ViewTracker';

/**
 * ContactPageTracker Component
 * 
 * A client component that tracks contact page views and initiations for Facebook events
 * This tracks the contact page view as an important conversion step
 */
export default function ContactPageTracker() {
  const { trackInitiateCheckout } = useFacebookEvents();
  
  useEffect(() => {
    // Track a contact page view as an initiate checkout event
    const trackContact = async () => {
      try {
        await trackInitiateCheckout({
          customData: {
            contentName: 'Contact Page',
            contentCategory: 'contact',
            contentType: 'contact_initiation'
          }
        });
        
        console.log('Contact page view tracked as initiate checkout');
      } catch (error) {
        console.error('Error tracking contact page view:', error);
      }
    };
    
    trackContact();
  }, [trackInitiateCheckout]);
  
  // Also include the standard ViewTracker
  return <ViewTracker contentType="contact_page" contentName="Contact Page" contentCategory="contact" />;
}
