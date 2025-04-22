import { headers } from 'next/headers';
import { ServiceLocation, getLocationById, defaultLocation } from './locationUtils';

/**
 * Convert a detected city and region to a ServiceLocation object
 */
function createServiceLocation(city: string, region: string): ServiceLocation {
  // Check if the city matches one of our known service areas
  const knownLocation = getKnownLocation(city, region);
  if (knownLocation) {
    return knownLocation;
  }
  
  // Create a URL-friendly location ID
  const citySlug = city.toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-');       // Replace multiple hyphens with a single one
    
  const regionSlug = region.toLowerCase()
    .replace(/\s+/g, '-')       
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
    
  // Create a custom ServiceLocation for unknown locations
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
    // Create URL-friendly location ID
    const citySlug = city.toLowerCase()
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-');       // Replace multiple hyphens with a single one
    
    // Return a Columbus area ServiceLocation
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
  
  // Try to find in known locations by ID
  const locationId = `${cityLower.replace(/\s+/g, '-')}-${regionLower}`;
  return getLocationById(locationId) || null;
}

/**
 * Get the user's location from request headers (server-side only)
 * Uses Vercel's geolocation headers set by our middleware
 */
export function getUserLocationFromHeaders(): ServiceLocation {
  try {
    // Using request.headers in middleware.ts guarantees these are available
    const headersList = headers();
    let userLocationHeader = '';
    let city = '';
    let region = '';
    
    try {
      // First try the custom header set by our middleware
      const headerObj = headersList as any;
      if (typeof headerObj.get === 'function') {
        userLocationHeader = headerObj.get('x-user-location') || '';
        city = headerObj.get('x-vercel-ip-city') || '';
        region = headerObj.get('x-vercel-ip-country-region') || '';
      }
    } catch (e) {
      console.log('Error accessing headers:', e);
    }
    
    // Use data from our middleware header
    if (userLocationHeader) {
      const parts = userLocationHeader.split(',');
      const headerCity = parts[0]?.trim() || '';
      const headerRegion = parts[1]?.trim() || '';
      
      if (headerCity && headerRegion) {
        return createServiceLocation(headerCity, headerRegion);
      }
    }
    
    // Use data from Vercel headers directly
    if (city && region) {
      return createServiceLocation(city, region);
    }
    
    // If we're here, try one more approach with request headers
    try {
      const reqHeaders = new Headers();
      const fromVercelCity = reqHeaders.get('x-vercel-ip-city');
      const fromVercelRegion = reqHeaders.get('x-vercel-ip-country-region');
      
      if (fromVercelCity && fromVercelRegion) {
        return createServiceLocation(fromVercelCity, fromVercelRegion);
      }
    } catch (e) {
      console.log('Error accessing request headers:', e);
    }
    
    // Fall back to default location
    return defaultLocation;
  } catch (error) {
    console.error('Error in getUserLocationFromHeaders:', error);
    return defaultLocation;
  }
}
