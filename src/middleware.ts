import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions';

export function middleware(request: NextRequest) {
  // For development environment, use mock data
  if (process.env.NODE_ENV === 'development') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-location', 'Akron, OH');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Get location data from Vercel's headers for production
  const { city, countryRegion } = geolocation(request);
  
  // Format the location string
  let formattedLocation = 'Northeast Ohio'; // Default
  
  if (city && countryRegion) {
    formattedLocation = `${city}, ${countryRegion}`;
  }
  
  // Map to service area
  const mappedLocation = mapToServiceArea(formattedLocation);
  
  // Add location to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-location', mappedLocation);
  
  // Return the response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Helper function to map detected locations to service areas
function mapToServiceArea(location: string): string {
  const lowerLocation = location.toLowerCase();
  
  // Check for Ohio cities and map to service areas
  if (lowerLocation.includes('akron') || 
      lowerLocation.includes('medina') || 
      lowerLocation.includes('stow')) {
    return 'Akron, OH';
  }
  
  if (lowerLocation.includes('cleveland') || 
      lowerLocation.includes('strongsville')) {
    return 'Cleveland, OH';
  }
  
  if (lowerLocation.includes('canton')) {
    return 'Canton, OH';
  }
  
  // Default service area
  return 'Northeast Ohio';
}

// Apply middleware to all routes except static assets and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
