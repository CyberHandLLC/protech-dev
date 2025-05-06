'use client';

import { useEffect, useRef } from 'react';
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
  const { trackPageView: trackGAContent } = useGoogleTracking();
  
  // Use ref to track if this service page view has already been tracked
  const hasTrackedRef = useRef(false);
  
  useEffect(() => {
    // Don't track during development/preview or if already tracked
    if (process.env.NODE_ENV === 'development' || hasTrackedRef.current) return;
    
    // Mark as tracked to prevent duplicate events
    hasTrackedRef.current = true;
    
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
      trackGAContent('service_page_view', serviceName, {
        service_category: serviceCategory,
        service_description: serviceDescription,
        estimated_value: estimatedValue,
        content_type: 'service'
      });
      
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
    trackGAContent
  ]);
  
  // This component doesn't render anything
  return null;
}
