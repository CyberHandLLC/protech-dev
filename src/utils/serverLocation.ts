import { headers } from 'next/headers';
import { ServiceLocation, getLocationById, defaultLocation } from './locationUtils';
import { convertToLocationSlug } from './location';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

/**
 * Convert a detected city and region to a ServiceLocation object
 */
function createServiceLocation(city: string, region: string): ServiceLocation {
  // Check if the city matches one of our known service areas
  const knownLocation = getKnownLocation(city, region);
  if (knownLocation) {
    return knownLocation;
  }
  
  // Create a custom ServiceLocation for unknown locations
  // Use the convertToLocationSlug function to ensure consistent URL formatting
  const citySlug = convertToLocationSlug(city);
  const regionSlug = region.toLowerCase();
  
  return {
    id: `${citySlug}-${regionSlug}`,
    name: city,
    state: 'Ohio',  // Assuming all are in Ohio for now
    stateCode: region,
    zip: [],
    coordinates: { lat: 0, lng: 0 },
    serviceArea: false,
    primaryArea: false
  };
}

/**
 * Check if a city matches one of our known service locations
 */
function getKnownLocation(city: string, region: string): ServiceLocation | null {
  const cityLower = city.toLowerCase();
  const regionLower = region.toLowerCase();
  
  // Map Lewis Center and other Columbus area cities
  if (cityLower.includes('lewis center') || 
      cityLower.includes('columbus') || 
      cityLower.includes('dublin') || 
      cityLower.includes('westerville') || 
      cityLower.includes('delaware') || 
      cityLower.includes('powell')) {
    // Return a Columbus area ServiceLocation
    // Use the convertToLocationSlug function to ensure consistent URL formatting
    const citySlug = convertToLocationSlug(city);
    
    return {
      id: `${citySlug}-${regionLower}`,
      name: city,
      state: 'Ohio',
      stateCode: region,
      zip: [],
      coordinates: { lat: 40.1887, lng: -83.0028 }, // Lewis Center coordinates
      serviceArea: true,
      primaryArea: false
    };
  }
  
  // Try to find in known locations by ID using the consistent slug converter
  const locationId = `${convertToLocationSlug(city)}-${regionLower}`;
  return getLocationById(locationId) || null;
}

/**
 * Get the user's location from request headers (server-side only)
 * Uses location data set by our enhanced middleware
 */
export function getUserLocationFromHeaders(): ServiceLocation {
  try {
    // Get headers using Next.js headers() function
    const headersList = headers();
    
    // Safe header access function
    const getHeaderSafe = (name: string): string => {
      try {
        // Cast the headers to ReadonlyHeaders to access get method
        const h = headersList as unknown as ReadonlyHeaders;
        return h?.get?.(name) || '';
      } catch (e) {
        console.error(`Error getting header ${name}:`, e);
        return '';
      }
    };
    
    // Get location data from headers
    const userLocationHeader = getHeaderSafe('x-user-location');
    const userLocationId = getHeaderSafe('x-user-location-id');
    
    // If we have both the location name and ID from middleware, create a ServiceLocation
    if (userLocationHeader && userLocationId) {
      const parts = userLocationHeader.split(',');
      const headerCity = parts[0]?.trim() || '';
      const headerRegion = parts[1]?.trim() || '';
      
      // Create a ServiceLocation using the data from middleware
      return {
        id: userLocationId,
        name: headerCity,
        state: 'Ohio',  // Assuming all are in Ohio for now
        stateCode: headerRegion || 'OH',
        zip: [],
        coordinates: { lat: 0, lng: 0 }, // We could enhance this with actual coordinates if needed
        serviceArea: true, // Assuming it's in our service area since middleware mapped it
        primaryArea: false
      };
    }
    
    // Fallback to using Vercel's headers if our middleware headers are missing
    const city = getHeaderSafe('x-vercel-ip-city');
    const region = getHeaderSafe('x-vercel-ip-country-region');
    
    if (city && region) {
      return createServiceLocation(city, region);
    }
    
    // Fall back to default location
    return defaultLocation;
  } catch (error) {
    console.error('Error in getUserLocationFromHeaders:', error);
    return defaultLocation;
  }
}
