'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import ViewTracker from '../analytics/ViewTracker';

interface ServiceViewTrackerProps {
  serviceName?: string;
  serviceType?: string;
  category?: string;
  location?: string;
}

/**
 * ServiceViewTracker Component
 * 
 * A client component that tracks service page views for Facebook conversion tracking
 * This component combines both general page view tracking and service-specific tracking
 */
export default function ServiceViewTracker({
  serviceName,
  serviceType = 'general',
  category = 'service',
  location
}: ServiceViewTrackerProps) {
  const pathname = usePathname();
  const { trackViewContent } = useFacebookEvents();
  
  // Extract information from the path if not explicitly provided
  const pathParts = pathname.split('/').filter(Boolean);
  const detectedCategory = category || pathParts[1] || 'service';
  const detectedServiceType = serviceType || pathParts[2] || 'general';
  const detectedServiceName = serviceName || pathParts[3] || pathname.split('/').pop() || 'service';
  const detectedLocation = location || (pathParts.length > 4 ? pathParts[4] : undefined);
  
  // Enhanced name with location if available
  const displayName = detectedLocation 
    ? `${detectedServiceName} in ${detectedLocation}` 
    : detectedServiceName;
  
  useEffect(() => {
    // Track the page view as service content
    const trackServiceView = async () => {
      try {
        await trackViewContent({
          customData: {
            contentName: displayName,
            contentCategory: detectedCategory,
            contentType: 'service_page',
            // Include location data if available
            ...(detectedLocation && { 
              location: detectedLocation.replace('-', ' ') 
            })
          }
        });
        
        console.log('Service view tracked:', displayName);
      } catch (error) {
        console.error('Error tracking service view:', error);
      }
    };
    
    trackServiceView();
  }, [pathname, displayName, detectedCategory, detectedLocation, trackViewContent]);
  
  // Also include the general ViewTracker for standard page view tracking
  return <ViewTracker contentType="service_page" contentName={displayName} contentCategory={detectedCategory} />;
}
