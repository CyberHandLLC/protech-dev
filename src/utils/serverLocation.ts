// Server-side utility to detect user location from request headers
import { headers } from 'next/headers';
import { defaultLocation, type ServiceLocation } from './locationUtils';

/**
 * Get user location from request headers set by middleware
 * This is used in Server Components to access the location without client-side detection
 */
export async function getUserLocationFromHeaders(): Promise<ServiceLocation> {
  const headersList = await headers();
  const locationHeader = headersList.get('x-user-location');
  const isDefaultHeader = headersList.get('x-location-is-default');
  
  if (locationHeader) {
    // Parse the location header which is in format: "id|name"
    const parts = locationHeader.split('|');
    if (parts.length === 2) {
      const locationId = parts[0];
      // Return a proper ServiceLocation - use defaultLocation as base and override
      return {
        ...defaultLocation,
        id: locationId,
        name: parts[1]
      };
    }
  }
  
  // Fallback to default location if no header is present
  return defaultLocation;
}