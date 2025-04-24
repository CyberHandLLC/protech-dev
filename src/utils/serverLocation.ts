// Server-side utility to detect user location from request headers
import { headers } from 'next/headers';

// Get the user's location from request headers (IP-based)
export function getUserLocationFromHeaders() {
  const headersList = headers();
  
  // In a production environment, this would use proper geolocation services
  // For now, we'll just parse a custom header or return a default
  const geoHeader = headersList.get('x-user-location') || '';
  
  // Default location if none is detected
  const defaultLocation = {
    id: 'northeast-ohio',
    name: 'Northeast Ohio',
    isDefault: true
  };
  
  try {
    // Check if we have a location header
    if (geoHeader) {
      // Parse the location from the header - in production this would be more sophisticated
      const [city, state] = geoHeader.split(',').map(part => part.trim());
      
      if (city && state) {
        return {
          id: `${city.toLowerCase()}-${state.toLowerCase()}`,
          name: `${city} ${state}`,
          isDefault: false
        };
      }
    }
    
    // Additionally check for query param location
    // In a real implementation, this might check cookies as well
    
    // Return default if no location is detected
    return defaultLocation;
    
  } catch (error) {
    console.error('Error parsing location from headers:', error);
    return defaultLocation;
  }
}