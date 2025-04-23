/**
 * Location Utilities
 * 
 * This module provides types and functions to manage location-based features
 * including geolocation, distance calculation, and service area verification.
 */

// Types
// ---------------------------------------------------------------------------

/**
 * Coordinates representing a geographical position
 */
export type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * Represents a service location where the company operates
 */
export type ServiceLocation = {
  id: string;              // Unique identifier (e.g., 'akron-oh')
  name: string;            // City name
  displayName?: string;    // Display-friendly name (defaults to city name)
  state: string;           // Full state name
  stateCode: string;       // Two-letter state code
  zip: string[];           // Array of zip codes covered
  coordinates: Coordinates;
  serviceArea: boolean;    // Whether this is an active service area
  primaryArea: boolean;    // Whether this is a primary/main service area
};

/**
 * Represents a user's detected or selected location
 */
export type UserLocation = {
  city: string;
  state: string;
  stateCode: string;
  zip?: string;
  coordinates?: Coordinates;
};

// Data
// ---------------------------------------------------------------------------

/**
 * Service locations covered by the company
 */
export const serviceLocations: ServiceLocation[] = [
  {
    id: 'akron-oh',
    name: 'Akron',
    state: 'Ohio',
    stateCode: 'OH',
    zip: ['44301', '44302', '44303', '44304', '44305', '44306', '44307', '44308', '44309', '44310'],
    coordinates: { lat: 41.0814, lng: -81.5190 },
    serviceArea: true,
    primaryArea: true,
  },
  {
    id: 'cleveland-oh',
    name: 'Cleveland',
    state: 'Ohio',
    stateCode: 'OH',
    zip: ['44101', '44102', '44103', '44104', '44105', '44106', '44107', '44108', '44109', '44110'],
    coordinates: { lat: 41.4993, lng: -81.6944 },
    serviceArea: true,
    primaryArea: false,
  },
  {
    id: 'canton-oh',
    name: 'Canton',
    state: 'Ohio',
    stateCode: 'OH',
    zip: ['44701', '44702', '44703', '44704', '44705', '44706', '44707', '44708', '44709', '44710'],
    coordinates: { lat: 40.7989, lng: -81.3784 },
    serviceArea: true,
    primaryArea: false,
  },
];

/**
 * Default location to use if geolocation fails
 * Using Cleveland as our default location instead of Akron
 */
export const defaultLocation: ServiceLocation = serviceLocations.find(l => l.id === 'cleveland-oh') || serviceLocations[0];

// Location Detection
// ---------------------------------------------------------------------------

/**
 * Get the user's current location using the browser's geolocation API
 * 
 * @returns A Promise that resolves to a UserLocation object or null if geolocation fails
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  // Verify browser environment and geolocation support
  if (typeof window === 'undefined' || !navigator.geolocation) {
    console.warn('Geolocation is not supported in this environment');
    return null;
  }

  try {
    // Request the user's position with a 5-second timeout
    const position = await getGeolocationPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    const { latitude, longitude } = position.coords;

    // Find the nearest service location to the user's coordinates
    const nearestLocation = findNearestLocation(latitude, longitude);
    
    // Return a UserLocation object
    return {
      city: nearestLocation.name,
      state: nearestLocation.state,
      stateCode: nearestLocation.stateCode,
      coordinates: { lat: latitude, lng: longitude }
    };
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
}

/**
 * Promisified wrapper for the geolocation API
 */
function getGeolocationPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Distance Calculation
// ---------------------------------------------------------------------------

/**
 * Find the nearest service location to the provided coordinates
 * 
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns The closest ServiceLocation
 */
export function findNearestLocation(latitude: number, longitude: number): ServiceLocation {
  if (!serviceLocations.length) {
    throw new Error('No service locations defined');
  }

  // Calculate and add distance to each location
  const locationsWithDistance = serviceLocations.map(location => {
    const distance = calculateDistance(
      latitude, 
      longitude, 
      location.coordinates.lat, 
      location.coordinates.lng
    );
    return { ...location, distance };
  });

  // Sort by distance and return the closest
  locationsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  return locationsWithDistance[0];
}

/**
 * Calculate distance between two geographical points using the Haversine formula
 * 
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance in kilometers
  return EARTH_RADIUS_KM * c;
}

/**
 * Convert degrees to radians
 */
function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Location Utility Functions
// ---------------------------------------------------------------------------

/**
 * Get a service location by its ID
 * 
 * @param locationId The ID of the location to find (e.g., 'akron-oh')
 * @returns The matching ServiceLocation or undefined if not found
 */
export function getLocationById(locationId: string): ServiceLocation | undefined {
  if (!locationId) {
    return undefined;
  }
  return serviceLocations.find(location => location.id === locationId.toLowerCase());
}

/**
 * Get a service location by its name
 * 
 * @param locationName The name of the location to find (e.g., 'Akron' or 'Cleveland')
 * @returns The matching ServiceLocation or undefined if not found
 */
export function getLocationByName(locationName: string): ServiceLocation | undefined {
  if (!locationName) {
    return undefined;
  }
  // Try to find an exact match first
  let location = serviceLocations.find(
    location => location.name.toLowerCase() === locationName.toLowerCase()
  );
  
  // If no exact match, try to find a partial match
  if (!location) {
    location = serviceLocations.find(
      location => locationName.toLowerCase().includes(location.name.toLowerCase())
    );
  }
  
  // If still no match, return the default location
  return location || defaultLocation;
}

/**
 * Format a location name and state code into a URL-friendly ID
 * 
 * @example
 * formatLocationId('Akron', 'OH') // returns 'akron-oh'
 * 
 * @param city City name
 * @param stateCode Two-letter state code
 * @returns Formatted location ID
 */
export function formatLocationId(city: string, stateCode: string): string {
  if (!city || !stateCode) {
    throw new Error('Both city and stateCode are required to format a location ID');
  }
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${stateCode.toLowerCase()}`;
}

// Local Storage Functions
// ---------------------------------------------------------------------------

const USER_LOCATION_STORAGE_KEY = 'userLocation';

/**
 * Save user location preference to local storage
 * 
 * @param location The user location to save
 */
export function saveUserLocation(location: UserLocation): void {
  if (!location) {
    return;
  }
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save user location to localStorage:', error);
    }
  }
}

/**
 * Get saved user location from local storage
 * 
 * @returns The saved UserLocation or null if not found
 */
export function getSavedUserLocation(): UserLocation | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const savedLocation = localStorage.getItem(USER_LOCATION_STORAGE_KEY);
    return savedLocation ? JSON.parse(savedLocation) : null;
  } catch (error) {
    console.error('Failed to retrieve user location from localStorage:', error);
    return null;
  }
}

/**
 * Clear saved user location from local storage
 */
export function clearSavedUserLocation(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(USER_LOCATION_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear user location from localStorage:', error);
    }
  }
}

/**
 * Check if a location is within our service area
 * 
 * @param location The user location to check
 * @returns True if the location is in our service area
 */
export function isInServiceArea(location: UserLocation): boolean {
  if (!location) {
    return false;
  }
  
  // Check if the location's zip code is in our service areas
  if (location.zip) {
    return serviceLocations.some(serviceLocation => 
      serviceLocation.zip.includes(location.zip as string)
    );
  }
  
  // If no zip, check by city and state
  return serviceLocations.some(serviceLocation => 
    serviceLocation.name.toLowerCase() === location.city.toLowerCase() && 
    serviceLocation.stateCode.toLowerCase() === location.stateCode.toLowerCase()
  );
}