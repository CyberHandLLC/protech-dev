'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import useLocationDetection from '@/hooks/useLocationDetection';
import PageLayout from '@/components/PageLayout';
import ServicePageContent from './ServicePageContent';

type ServicePageClientProps = {
  serviceInfo: any;
  category: string;
  service: string;
  locationParam: string;
  serverLocation: string;
};

/**
 * Client component wrapper for service details page
 * Handles client-side location detection and updates
 */
export default function ServicePageClient({ 
  serviceInfo,
  category,
  service,
  locationParam,
  serverLocation
}: ServicePageClientProps) {
  // Use the client-side location detection hook
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // Combine server-side and client-side location data
  const [combinedLocation, setCombinedLocation] = useState<string>(serverLocation);
  
  // Update location when client-side location is detected
  useEffect(() => {
    // Only update if the URL has a generic location (northeast-ohio)
    if (locationParam !== 'northeast-ohio') {
      return;
    }
    
    // If there's a client-side detected location and we're not currently detecting, use it
    if (clientLocation && !isLocating) {
      let locationName = clientLocation;
      try {
        locationName = decodeURIComponent(clientLocation);
      } catch (e) {
        // Only log errors in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error decoding location:', e);
        }
      }
      setCombinedLocation(locationName);
    }
  }, [clientLocation, isLocating, locationParam]);

  // Wrap in PageLayout at the client component level
  return (
    <PageLayout>
      <ServicePageContent 
        serviceInfo={serviceInfo} 
        category={category} 
        service={service} 
        locationParam={locationParam}
        userLocation={combinedLocation} 
        isLocating={isLocating} 
      />
    </PageLayout>
  );
}
