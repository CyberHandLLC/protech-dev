import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserLocation, 
  ServiceLocation,
  defaultLocation,
  getUserLocation,
  getSavedUserLocation,
  saveUserLocation,
  findNearestLocation
} from '@/utils/locationUtils';

interface LocationContextType {
  userLocation: UserLocation | null;
  nearestServiceLocation: ServiceLocation;
  isLoading: boolean;
  error: string | null;
  setManualLocation: (location: UserLocation) => void;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestServiceLocation, setNearestServiceLocation] = useState<ServiceLocation>(defaultLocation);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize location on component mount
  useEffect(() => {
    initializeLocation();
  }, []);

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
        setUserLocation(currentLocation);
        saveUserLocation(currentLocation);
        
        if (currentLocation.coordinates) {
          const nearest = findNearestLocation(
            currentLocation.coordinates.lat,
            currentLocation.coordinates.lng
          );
          setNearestServiceLocation(nearest);
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

  const value = {
    userLocation,
    nearestServiceLocation,
    isLoading,
    error,
    setManualLocation,
    refreshLocation
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