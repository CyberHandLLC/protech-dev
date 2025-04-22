import { headers } from 'next/headers';
import { ServiceLocation, getLocationById, defaultLocation } from './locationUtils';
import { convertToLocationSlug } from './location';

/**
 * Convert a detected city and region to a ServiceLocation object
 */
function createServiceLocation(city: string, region: string): ServiceLocation {
  // Special case for Lewis Center to ensure consistent detection
  if (city.toLowerCase().includes('lewis center') || city.toLowerCase() === 'lewis') {
    return {
      id: 'lewis-center-oh',
      name: 'Lewis Center',
      state: 'Ohio',
      stateCode: 'OH',
      zip: [],
      coordinates: { lat: 40.1887, lng: -83.0028 }, // Lewis Center coordinates
      serviceArea: true,
      primaryArea: false
    };
  }
  
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
  
  // Specific handling for Lewis Center to avoid any encoding issues
  if (cityLower.includes('lewis center')) {
    return {
      id: 'lewis-center-oh',
      name: 'Lewis Center',
      state: 'Ohio',
      stateCode: 'OH',
      zip: [],
      coordinates: { lat: 40.1887, lng: -83.0028 }, // Lewis Center coordinates
      serviceArea: true,
      primaryArea: false
    };
  }
  
  // Map other Columbus area cities
  if (cityLower.includes('columbus') || 
      cityLower.includes('dublin') || 
      cityLower.includes('westerville') || 
      cityLower.includes('delaware') || 
      cityLower.includes('powell')) {
    // Use the convertToLocationSlug function to ensure consistent URL formatting
    const citySlug = convertToLocationSlug(city);
    
    return {
      id: `${citySlug}-${regionLower}`,
      name: city,
      state: 'Ohio',
      stateCode: region,
      zip: [],
      coordinates: { lat: 40.1887, lng: -83.0028 }, // Columbus area coordinates
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
 * Uses Vercel's geolocation headers set by our middleware
 */
export function getUserLocationFromHeaders(): ServiceLocation {
  try {
    // DEVELOPMENT HARDCODING FOR TESTING - Always return Lewis Center in dev mode
    // This makes development testing more consistent
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 'lewis-center-oh',
        name: 'Lewis Center',
        state: 'Ohio',
        stateCode: 'OH',
        zip: [],
        coordinates: { lat: 40.1887, lng: -83.0028 },
        serviceArea: true,
        primaryArea: false
      };
    }
    
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
