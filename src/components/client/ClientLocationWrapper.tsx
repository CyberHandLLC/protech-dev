'use client';

import { useState, useCallback, useEffect } from 'react';
import { LocationProvider } from '@/contexts/LocationContext';
import { getLocationByName } from '@/utils/getLocationByName';
import { defaultLocation } from '@/utils/locationUtils';
import ClientLocationManager from './ClientLocationManager';
import LocationPrompt from '../LocationPrompt';

// Lightweight wrapper for location features
// This component isolates client-side interactive location features
// to minimize JavaScript for mobile TBT optimization

interface ClientLocationWrapperProps {
  defaultLocation: string;
}

export default function ClientLocationWrapper({ defaultLocation: initialLocation }: ClientLocationWrapperProps) {
  const [locationName, setLocationName] = useState(initialLocation || 'Northeast Ohio');
  
  // Handle location updates from the client location manager
  const handleLocationUpdate = useCallback((newLocation: string) => {
    if (newLocation && newLocation !== locationName) {
      setLocationName(newLocation);
      
      // Store in localStorage to avoid re-prompting
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('userLocation', newLocation);
          localStorage.setItem('locationTimestamp', Date.now().toString());
        } catch (e) {
          // Handle in case localStorage is disabled
        }
      }
    }
  }, [locationName]);
  
  // Fetch location from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        const timestamp = localStorage.getItem('locationTimestamp');
        
        // Only use saved location if it's less than 24 hours old
        if (savedLocation && timestamp) {
          const savedTime = parseInt(timestamp, 10);
          const now = Date.now();
          const hoursSince = (now - savedTime) / (1000 * 60 * 60);
          
          if (hoursSince < 24) {
            setLocationName(savedLocation);
          }
        }
      } catch (e) {
        // Silently fail if localStorage is unavailable
      }
    }
  }, []);
  
  // Only render client-side components - no static content
  // This minimizes the JS bundle size for optimal TBT
  return (
    <LocationProvider>
      {/* Only the location detection/prompt functionality */}
      <ClientLocationManager 
        defaultLocation={locationName} 
        onLocationUpdate={handleLocationUpdate} 
      />
      <LocationPrompt />
    </LocationProvider>
  );
}
