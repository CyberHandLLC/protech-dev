'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

/**
 * EmailClickTracker Component
 * 
 * Automatically tracks when users click any email (mailto:) link on the site
 * Adds a global click listener to capture all email clicks
 */
export default function EmailClickTracker() {
  const { trackEmailClicked } = useFacebookEvents();

  useEffect(() => {
    const handleEmailClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if clicked element or parent is a mailto link
      const emailLink = target.closest('a[href^="mailto:"]') as HTMLAnchorElement;
      
      if (emailLink) {
        const email = emailLink.href.replace('mailto:', '');
        const source = window.location.pathname;
        
        try {
          await trackEmailClicked({
            customData: {
              source: source,
              contentName: `Email Click: ${email}`,
              contentType: 'email_link',
            }
          });
          
          console.log(`[EmailClicked] ${email} from ${source}`);
        } catch (error) {
          console.error('Error tracking email click:', error);
        }
      }
    };

    // Add global click listener
    document.addEventListener('click', handleEmailClick);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('click', handleEmailClick);
    };
  }, [trackEmailClicked]);

  return null; // This component doesn't render anything
}
