import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * API route for geolocation
 * Uses Vercel's geolocation headers to determine user location
 */
export async function GET(request: Request) {
  try {
    // For development environment, provide mock data
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        location: 'Akron, OH',
        rawLocation: {
          city: 'Akron',
          country: 'US',
          countryRegion: 'OH'
        },
        debug: {
          geoData: null,
          headers: null,
          vercelHeaders: null
        }
      });
    }
    
    // Get geolocation data from Vercel's headers
    const geoData = geolocation(request);
    
    // Get headers for debugging, but handle them carefully to avoid TypeScript errors
    const headersList = headers();
    const allHeaders: Record<string, string> = {};
    
    // We'll just include a few specific headers we're interested in
    
    // Extract geolocation information
    const { city, countryRegion, region } = geoData;
    
    // Default to Akron, OH if location can't be determined
    const userLocation = city || 'Akron';
    const userRegion = countryRegion || region || 'OH';
    
    // Format the location for display
    let formattedLocation = 'Northeast Ohio'; // Default
    
    if (userLocation && userRegion) {
      // If we have city and region, format as "City, Region"
      formattedLocation = `${userLocation}, ${userRegion}`;
    }
    
    // Map common cities to service areas
    const mappedLocation = mapToServiceArea(formattedLocation);
    
    // Return the location data with debug information
    return NextResponse.json({
      location: mappedLocation,
      rawLocation: {
        city,
        country: geoData.country,
        countryRegion
      },
      debug: {
        geoData,
        detectedFrom: 'vercel-edge',
        env: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        headers: {
          host: request.headers.get('host'),
          referer: request.headers.get('referer'),
          userAgent: request.headers.get('user-agent')
        }
      }
    });
  } catch (error) {
    console.error('Error in geolocation API:', error);
    
    // Return a default location if there's an error
    return NextResponse.json({
      location: 'Akron, OH',
      rawLocation: {
        city: 'Akron',
        country: 'US',
        countryRegion: 'OH'
      },
      success: false,
      error: 'Unable to determine location',
      errorDetails: error instanceof Error ? error.message : String(error)
    });
  }
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
  
  // Columbus area - Lewis Center is north of Columbus
  if (lowerLocation.includes('lewis center') || 
      lowerLocation.includes('columbus') || 
      lowerLocation.includes('dublin') || 
      lowerLocation.includes('westerville') || 
      lowerLocation.includes('delaware') || 
      lowerLocation.includes('powell')) {
    return location; // Preserve the actual detected location
  }
  
  // If we have a specific city detected, preserve it rather than using a generic area
  if (location.includes(',') && location !== 'Akron, OH' && location !== 'Cleveland, OH' && location !== 'Canton, OH') {
    return location; // Keep the original detected location when it's specific
  }
  
  // Default service area as fallback
  return 'Northeast Ohio';
}
