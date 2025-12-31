'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

/**
 * EmergencyClickTracker Component
 * 
 * Tracks when users click emergency service buttons or tabs
 * Monitors:
 * - Emergency tab on /services page (residential/commercial)
 * - Emergency service buttons across the site
 * - Links to emergency pages
 */
export default function EmergencyClickTracker() {
  const { trackEmergencyClicked } = useFacebookEvents();

  useEffect(() => {
    const handleEmergencyClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if clicked element or parent is an emergency-related element
      const emergencyElement = target.closest('[data-emergency], [href*="emergency"], button:has-text("Emergency"), a:has-text("Emergency")') as HTMLElement;
      
      // Also check for common emergency button patterns
      const isEmergencyButton = 
        target.textContent?.toLowerCase().includes('emergency') ||
        target.getAttribute('href')?.includes('emergency') ||
        target.getAttribute('data-emergency') === 'true' ||
        target.classList.contains('emergency-button') ||
        target.classList.contains('emergency-tab');
      
      if (emergencyElement || isEmergencyButton) {
        const source = window.location.pathname;
        const buttonText = target.textContent?.trim() || 'Emergency Service';
        const isTab = target.getAttribute('role') === 'tab' || target.classList.contains('tab');
        
        try {
          await trackEmergencyClicked({
            customData: {
              source: source,
              contentName: buttonText,
              contentType: isTab ? 'emergency_tab' : 'emergency_button',
              serviceName: buttonText,
            }
          });
          
          console.log(`[EmergencyClicked] ${buttonText} from ${source} (${isTab ? 'tab' : 'button'})`);
        } catch (error) {
          console.error('Error tracking emergency click:', error);
        }
      }
    };

    // Add global click listener
    document.addEventListener('click', handleEmergencyClick);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('click', handleEmergencyClick);
    };
  }, [trackEmergencyClicked]);

  return null;
}
