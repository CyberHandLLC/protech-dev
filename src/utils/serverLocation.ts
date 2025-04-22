import { headers } from 'next/headers';
import { ServiceLocation, getLocationById, defaultLocation } from './locationUtils';

/**
 * Convert a location name like "Akron, OH" to a location ID like "akron-oh"
 */
function convertLocationToId(locationString: string): string {
  const locationParts = locationString.split(',');
  const city = locationParts[0]?.trim() || 'Akron';
  const state = locationParts[1]?.trim() || 'OH';
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
}

/**
 * Get a ServiceLocation object for a specific location ID
 */
function getServiceLocationById(locationId: string): ServiceLocation {
  return getLocationById(locationId) || defaultLocation;
}

/**
 * Get the user's location from request headers (server-side only)
 * Uses Vercel's geolocation headers set by our middleware
 */
export function getUserLocationFromHeaders(): ServiceLocation {
  try {
    // Try to get the location header
    const headerList = headers();
    let locationString = 'Akron, OH'; // Default

    // Use type assertion to work around TypeScript issues with headers()
    const headersObject = headerList as unknown as { get(name: string): string | null };
    
    if (typeof headersObject.get === 'function') {
      const headerValue = headersObject.get('x-user-location');
      if (headerValue) {
        locationString = headerValue;
      }
    }
    
    // Convert location string to ID and get the corresponding service location
    const locationId = convertLocationToId(locationString);
    return getServiceLocationById(locationId);
  } catch (error) {
    console.error('Error accessing location headers:', error);
    return defaultLocation;
  }
}
