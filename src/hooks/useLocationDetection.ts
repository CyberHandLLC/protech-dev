'use client';

import { useState, useEffect } from 'react';
import { getDefaultLocation } from '@/utils/location';

/**
 * Hook for detecting user location using Vercel's geolocation headers
 * 
 * This hook queries our server-side API route which uses Vercel's
 * geolocation headers to determine the user's location without
 * requiring permissions. Falls back to a default location if needed.
 */
export default function useLocationDetection() {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      setIsLocating(true);
      
      try {
        // Call our server-side API route that uses Vercel's geolocation
        const response = await fetch('/api/geolocation');
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        setUserLocation(data.location || getDefaultLocation());
      } catch (err) {
        console.error('Failed to get user location', err);
        setError('Unable to detect location');
        setUserLocation(getDefaultLocation());
      } finally {
        setIsLocating(false);
      }
    };
    
    detectLocation();
  }, []);

  return {
    userLocation,
    isLocating,
    error
  };
}
