'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import useLocationDetection from '@/hooks/useLocationDetection';
import LocationPrompt from '@/components/LocationPrompt';

type ClientLocationManagerProps = {
  defaultLocation: string;
  onLocationUpdate?: (newLocation: string) => void;
};

/**
 * Client component that handles location detection and permission
 * This isolates client-side JavaScript for location handling
 * Improves TBT by keeping this logic separate from server-rendered content
 */
export default function ClientLocationManager({ 
  defaultLocation, 
  onLocationUpdate 
}: ClientLocationManagerProps) {
  // Access location context for permissions
  const { hasPermission, checkingPermission } = useLocationPermission();
  
  // Use the detection hook for client-side location
  const { userLocation, isLocating } = useLocationDetection();
  
  // Store the currently active location
  const [activeLocation, setActiveLocation] = useState(defaultLocation);
  
  // Update global page state when location changes
  useEffect(() => {
    if (hasPermission && userLocation) {
      setActiveLocation(userLocation);
      
      // Call the callback function if provided
      if (onLocationUpdate && typeof onLocationUpdate === 'function') {
        onLocationUpdate(userLocation);
      }
      
      // Use a custom event to communicate with other components if needed
      const event = new CustomEvent('locationUpdated', { 
        detail: { location: userLocation } 
      });
      window.dispatchEvent(event);
      
      // Optional: Store in localStorage for persistence
      try {
        localStorage.setItem('userLocation', userLocation);
      } catch (e) {
        console.error('Error saving location to localStorage:', e);
      }
    }
  }, [hasPermission, userLocation, onLocationUpdate]);
  
  // Render only the permission prompt if needed
  // This minimizes the client JS footprint
  return checkingPermission ? null : (
    !hasPermission ? <LocationPrompt onLocationUpdated={() => {
      if (onLocationUpdate) onLocationUpdate(defaultLocation);
    }} /> : null
  );
}
