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
      
      // Only track actual clickable elements (buttons, links, tabs)
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('role') === 'tab' ||
        target.closest('button') !== null ||
        target.closest('a') !== null;
      
      if (!isClickable) return;
      
      // Get the clickable element (might be parent)
      const clickableElement = (
        target.tagName === 'BUTTON' || target.tagName === 'A' ? target : 
        target.closest('button, a, [role="button"], [role="tab"]')
      ) as HTMLElement;
      
      if (!clickableElement) return;
      
      // Check for emergency indicators on the clickable element only
      const text = clickableElement.textContent?.toLowerCase() || '';
      const href = clickableElement.getAttribute('href')?.toLowerCase() || '';
      const dataAttr = clickableElement.getAttribute('data-emergency');
      const ariaLabel = clickableElement.getAttribute('aria-label')?.toLowerCase() || '';
      const className = clickableElement.className?.toLowerCase() || '';
      
      const isEmergencyButton = 
        dataAttr === 'true' ||
        href.includes('/emergency') ||
        className.includes('emergency') ||
        ariaLabel.includes('emergency') ||
        (text.includes('emergency') && text.length < 100) || // Limit text length to avoid schema data
        (text.includes('24/7') && text.length < 100);
      
      if (isEmergencyButton) {
        const source = window.location.pathname;
        const buttonText = clickableElement.textContent?.trim().substring(0, 50) || 'Emergency Service'; // Limit text length
        const isTab = clickableElement.getAttribute('role') === 'tab';
        
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
