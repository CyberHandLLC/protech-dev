'use client';

import { useFacebookEvents } from '@/hooks/useFacebookEvents';

interface PhoneLinkProps {
  className?: string;
  children?: React.ReactNode;
  phoneNumber?: string;
  source?: string;
}

/**
 * PhoneLink Component
 * 
 * Renders a phone number as a clickable link that tracks the interaction with Facebook
 */
export default function PhoneLink({ 
  className = '', 
  children, 
  phoneNumber = '330-642-HVAC',
  source = 'general'
}: PhoneLinkProps) {
  // Parse phone number to standard format for href
  const formattedNumber = phoneNumber.replace(/\D/g, '');
  const href = `tel:${formattedNumber}`;
  
  // Get Facebook tracking function
  const { trackPhoneClick } = useFacebookEvents();
  
  // Handle phone click with Facebook tracking
  const handlePhoneClick = async () => {
    try {
      await trackPhoneClick({
        customData: {
          contentName: `Phone Click - ${source}`,
          contentCategory: 'Contact Request',
          contentType: 'phone_call'
        }
      });
      console.log('Phone click tracked:', source);
    } catch (error) {
      console.error('Error tracking phone click:', error);
    }
  };
  
  return (
    <a 
      href={href}
      className={className}
      onClick={handlePhoneClick}
    >
      {children || phoneNumber}
    </a>
  );
}
