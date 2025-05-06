'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

interface ServicePageTrackerProps {
  serviceName: string;
  serviceCategory?: string;
  serviceDescription?: string;
  estimatedValue?: number;
}

/**
 * ServicePageTracker Component
 * 
 * Enhanced tracking for service pages that sends more detailed view_content events
 * to both Facebook (client and server) and Google Analytics
 */
export default function ServicePageTracker({
  serviceName,
  serviceCategory = 'HVAC Service',
  serviceDescription = '',
  estimatedValue = 0
}: ServicePageTrackerProps) {
  // Initialize tracking hooks
  const { trackViewContent: trackFacebookViewContent } = useFacebookEvents();
  const { trackViewContent: trackServerViewContent } = useFacebookServerEvents();
  const { trackContent } = useGoogleTracking();
  
  useEffect(() => {
    // Don't track during development/preview
    if (process.env.NODE_ENV === 'development') return;
    
    // Track the service page view with enhanced data
    try {
      // Client-side Facebook tracking
      trackFacebookViewContent({
        customData: {
          contentName: serviceName,
          contentCategory: serviceCategory,
          contentType: 'product',
          value: estimatedValue
        }
      });
      
      // Server-side Facebook tracking
      trackServerViewContent({
        contentName: serviceName,
        contentCategory: serviceCategory,
        contentType: 'product',
        value: estimatedValue
      });
      
      // Google Analytics tracking
      trackContent(
        'service_view',
        {
          item_name: serviceName,
          item_category: serviceCategory,
          item_variant: serviceDescription ? serviceDescription.substring(0, 20) : '',
          value: estimatedValue
        }
      );
      
      console.log(`Service page view tracked: ${serviceName}`);
    } catch (error) {
      console.error('Error tracking service page view:', error);
    }
  }, [
    serviceName, 
    serviceCategory,
    serviceDescription,
    estimatedValue,
    trackFacebookViewContent,
    trackServerViewContent,
    trackContent
  ]);
  
  // This component doesn't render anything
  return null;
}
