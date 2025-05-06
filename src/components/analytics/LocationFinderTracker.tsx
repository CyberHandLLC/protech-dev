'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

interface LocationFinderTrackerProps {
  locationName: string;
  searchQuery?: string;
  zipCode?: string;
  city?: string;
}

/**
 * LocationFinderTracker Component
 * 
 * Enhanced tracking for service area/location searches
 * Tracks both with Facebook (client and server) and Google Analytics
 */
export default function LocationFinderTracker({
  locationName,
  searchQuery = '',
  zipCode = '',
  city = ''
}: LocationFinderTrackerProps) {
  // Initialize tracking hooks
  const { trackCustomEvent: trackFacebookCustomEvent } = useFacebookEvents();
  const { trackFindLocation: trackServerFindLocation } = useFacebookServerEvents();
  const { trackEvent } = useGoogleTracking();
  
  useEffect(() => {
    // Track the location search with enhanced data
    try {
      // Client-side Facebook tracking
      trackFacebookCustomEvent('FindLocation', {
        customData: {
          contentName: locationName,
          contentCategory: 'Service Areas',
          searchString: searchQuery || city || zipCode
        }
      });
      
      // Server-side Facebook tracking
      trackServerFindLocation({
        locationName: locationName,
        searchQuery: searchQuery || city || zipCode,
        userData: {
          city: city,
          zipCode: zipCode
        }
      });
      
      // Google Analytics tracking
      trackEvent(
        'find_location',
        {
          location_name: locationName,
          search_term: searchQuery || city || zipCode,
          city: city,
          postal_code: zipCode
        }
      );
      
      console.log(`Location finder tracked: ${locationName} - ${searchQuery || city || zipCode}`);
    } catch (error) {
      console.error('Error tracking location finder:', error);
    }
  }, [
    locationName,
    searchQuery,
    zipCode,
    city,
    trackFacebookCustomEvent,
    trackServerFindLocation,
    trackEvent
  ]);
  
  // This component doesn't render anything
  return null;
}
