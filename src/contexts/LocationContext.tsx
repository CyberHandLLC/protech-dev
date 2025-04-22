import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserLocation, 
  ServiceLocation,
  defaultLocation,
  getUserLocation,
  getSavedUserLocation,
  saveUserLocation,
  findNearestLocation
} from '@/utils/locationUtils';

const PERMISSION_CHECK_INTERVAL = 5000; // Check for permission changes every 5 seconds

interface LocationContextType {
  userLocation: UserLocation | null;
  nearestServiceLocation: ServiceLocation;
  isLoading: boolean;
  error: string | null;
  permissionStatus: PermissionState | null;
  setManualLocation: (location: UserLocation) => void;
  refreshLocation: () => Promise<void>;
  promptForLocation: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestServiceLocation, setNearestServiceLocation] = useState<ServiceLocation>(defaultLocation);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  // Check for geolocation permission changes
  const checkPermissionStatus = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.permissions) return;
    
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      
      if (permission.state !== permissionStatus) {
        setPermissionStatus(permission.state);
        console.log('Geolocation permission status changed to:', permission.state);
        
        // If permission was just granted, refresh the location
        if (permission.state === 'granted' && permissionStatus === 'prompt') {
          refreshLocation();
        }
      }
      
      // Set up a listener for permission changes
      permission.onchange = function() {
        setPermissionStatus(permission.state);
        console.log('Permission changed to:', permission.state);
        
        // If permission was just granted, refresh the location
        if (permission.state === 'granted') {
          refreshLocation();
        }
      };
    } catch (err) {
      console.error('Error checking permission status:', err);
    }
  }, [permissionStatus]);
  
  // Initialize location on component mount and set up permission checking
  useEffect(() => {
    initializeLocation();
    
    // Initial permission check
    checkPermissionStatus();
    
    // Set up interval to periodically check permission status
    const intervalId = setInterval(checkPermissionStatus, PERMISSION_CHECK_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [checkPermissionStatus]);

  async function initializeLocation() {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for saved location first
      const savedLocation = getSavedUserLocation();
      
      if (savedLocation) {
        setUserLocation(savedLocation);
        
        // Find the nearest service location to the saved location
        if (savedLocation.coordinates) {
          const nearest = findNearestLocation(
            savedLocation.coordinates.lat,
            savedLocation.coordinates.lng
          );
          setNearestServiceLocation(nearest);
        }
      } else {
        // Try to get the current location
        const currentLocation = await getUserLocation();
        
        if (currentLocation) {
          setUserLocation(currentLocation);
          saveUserLocation(currentLocation);
          
          // Find nearest service location
          if (currentLocation.coordinates) {
            const nearest = findNearestLocation(
              currentLocation.coordinates.lat,
              currentLocation.coordinates.lng
            );
            setNearestServiceLocation(nearest);
          }
        }
      }
    } catch (err) {
      setError('Unable to determine your location. Showing default services.');
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Set location manually (e.g., from a location selector)
  function setManualLocation(location: UserLocation) {
    setUserLocation(location);
    saveUserLocation(location);
    
    // Update nearest service location if coordinates are available
    if (location.coordinates) {
      const nearest = findNearestLocation(
        location.coordinates.lat,
        location.coordinates.lng
      );
      setNearestServiceLocation(nearest);
    }
  }

  // Refresh user location
  async function refreshLocation() {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentLocation = await getUserLocation();
      
      if (currentLocation) {
        console.log('Location refresh successful:', currentLocation);
        setUserLocation(currentLocation);
        saveUserLocation(currentLocation);
        
        if (currentLocation.coordinates) {
          const nearest = findNearestLocation(
            currentLocation.coordinates.lat,
            currentLocation.coordinates.lng
          );
          setNearestServiceLocation(nearest);
          console.log('Updated nearest service location to:', nearest.name);
        }
      } else {
        throw new Error('Unable to determine your location.');
      }
    } catch (err) {
      setError('Error refreshing location data.');
      console.error('Location refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Explicitly prompt the user for location permission
  async function promptForLocation(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // This will trigger the browser permission prompt if it hasn't been decided yet
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      // If we get here, permission was granted, update the location
      const { latitude, longitude } = position.coords;
      
      // Find the nearest service location
      const nearestLocation = findNearestLocation(latitude, longitude);
      
      // Create and save user location
      const newLocation: UserLocation = {
        city: nearestLocation.name,
        state: nearestLocation.state,
        stateCode: nearestLocation.stateCode,
        coordinates: { lat: latitude, lng: longitude }
      };
      
      setUserLocation(newLocation);
      saveUserLocation(newLocation);
      setNearestServiceLocation(nearestLocation);
      setPermissionStatus('granted');
      
      console.log('Location permission granted, updated to:', nearestLocation.name);
      return true;
    } catch (err) {
      console.error('Error prompting for location:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    userLocation,
    nearestServiceLocation,
    isLoading,
    error,
    permissionStatus,
    setManualLocation,
    refreshLocation,
    promptForLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to use the location context
export function useLocation() {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
}