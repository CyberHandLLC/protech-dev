import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions';
import { convertToLocationSlug } from './utils/location';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Redirect www to non-www (apex domain)
  if (hostname.startsWith('www.')) {
    url.host = hostname.replace('www.', '');
    url.protocol = 'https:';
    return NextResponse.redirect(url, { status: 301 }); // 301 permanent redirect
  }
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto');
    if (protocol === 'http') {
      url.protocol = 'https:';
      return NextResponse.redirect(url, { status: 308 });
    }
  }

  // For development environment, simulate location detection
  if (process.env.NODE_ENV === 'development') {
    const requestHeaders = new Headers(request.headers);
    
    // Get location from query param if provided (for testing different locations)
    const url = new URL(request.url);
    const queryLocation = url.searchParams.get('location');
    
    // Use a cookie if set (persists the location choice across pages)
    const savedLocation = request.cookies.get('x-user-location')?.value;
    
    // Use query param, cookie, or default to Cleveland
    const locationToUse = queryLocation || savedLocation || 'Cleveland, OH';
    
    // Create location slug/ID from the location name
    const locationId = convertToLocationSlug(locationToUse);

    // Set the headers for location data
    requestHeaders.set('x-user-location', locationToUse);
    requestHeaders.set('x-user-location-id', locationId);
    
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
  
  // Create location slug/ID from the location name
  const locationId = convertToLocationSlug(mappedLocation);

  // Add location data to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-location', mappedLocation);
  requestHeaders.set('x-user-location-id', locationId);
  
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
      lowerLocation.includes('strongsville') ||
      lowerLocation.includes('parma')) {
    return 'Cleveland, OH';
  }
  
  if (lowerLocation.includes('canton') ||
      lowerLocation.includes('massillon')) {
    return 'Canton, OH';
  }
  
  // Allow explicit pass-through for testing
  if (process.env.NODE_ENV === 'development' && 
      (location === 'Cleveland, OH' || location === 'Akron, OH' || location === 'Canton, OH')) {
    return location;
  }
  
  // Default service area
  return 'Northeast Ohio';
}

// Apply middleware to all routes except static assets and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
