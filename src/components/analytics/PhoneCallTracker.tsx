'use client';

import React from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

interface PhoneCallTrackerProps {
  phoneNumber: string;
  displayNumber?: string;
  className?: string;
  source?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  style?: React.CSSProperties;
}

/**
 * PhoneCallTracker Component
 * 
 * Enhanced phone call link that tracks clicks across all analytics platforms
 * Wraps a phone number in an anchor tag and tracks when users click to call
 */
export default function PhoneCallTracker({
  phoneNumber,
  displayNumber,
  className = '',
  source = 'Website',
  children,
  showIcon = true,
  style
}: PhoneCallTrackerProps) {
  // Initialize tracking hooks
  const { trackPhoneClick } = useFacebookEvents();
  const { trackContact: trackServerContact } = useFacebookServerEvents();
  const { trackPhoneCall } = useGoogleTracking();
  
  const handlePhoneClick = () => {
    try {
      // Track with client-side Facebook
      trackPhoneClick({
        customData: {
          contentName: `Phone Click: ${displayNumber || phoneNumber}`,
          contentCategory: 'Contact',
          contentType: 'phone_call',
          source: source
        }
      });
      
      // Track with server-side Facebook
      trackServerContact({
        source: `Phone Click - ${source}`
      });
      
      // Track with Google
      trackPhoneCall(source);
      
      console.log(`Phone call tracked: ${phoneNumber} from ${source}`);
    } catch (error) {
      // Don't prevent the phone call if tracking fails
      console.error('Error tracking phone call:', error);
    }
  };
  
  // Format display number or use the provided one
  const displayText = displayNumber || phoneNumber || children || 'Call Now';
  
  return (
    <a 
      href={`tel:${phoneNumber.replace(/\D/g, '')}`} 
      className={className}
      onClick={handlePhoneClick}
      style={style}
    >
      {showIcon && <span className="mr-1">📞</span>}
      {children || displayText}
    </a>
  );
}
