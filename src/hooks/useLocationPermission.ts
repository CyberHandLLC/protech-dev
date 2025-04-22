'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to simplify checking and tracking geolocation permission status
 * Optimized for minimal client-side JavaScript footprint to improve mobile TBT
 */
export function useLocationPermission() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [checkingPermission, setCheckingPermission] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  useEffect(() => {
    // Only execute in browser environment
    if (typeof window === 'undefined' || !navigator.permissions) {
      setCheckingPermission(false);
      return;
    }

    // Check permission status with minimal code execution
    async function checkPermission() {
      try {
        const permission = await navigator.permissions.query({ 
          name: 'geolocation' as PermissionName 
        });
        
        setPermissionStatus(permission.state);
        setHasPermission(permission.state === 'granted');
        setCheckingPermission(false);
        
        // Set up permission change listener
        permission.onchange = () => {
          setPermissionStatus(permission.state);
          setHasPermission(permission.state === 'granted');
          
          // Dispatch event for other components to listen for
          if (permission.state === 'granted') {
            window.dispatchEvent(new CustomEvent('locationPermissionGranted'));
          }
        };
      } catch (error) {
        // Fail gracefully
        console.error('Error checking location permission:', error);
        setCheckingPermission(false);
      }
    }
    
    checkPermission();
  }, []);

  return { 
    hasPermission, 
    checkingPermission, 
    permissionStatus 
  };
}
