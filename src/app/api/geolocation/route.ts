import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // For development environment, provide mock data
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ 
      location: 'Akron, OH',
      rawLocation: {
        city: 'Akron',
        country: 'US',
        countryRegion: 'OH'
      }
    });
  }
  
  // Get location data from Vercel's headers for production
  const { city, country, countryRegion } = geolocation(request);
  
  // Format the location string (e.g., "Akron, OH")
  let formattedLocation = 'Northeast Ohio'; // Default
  
  if (city && countryRegion) {
    // If we have city and region, format as "City, Region"
    formattedLocation = `${city}, ${countryRegion}`;
  }
  
  // Map common cities to service areas
  const mappedLocation = mapToServiceArea(formattedLocation);
  
  return NextResponse.json({ 
    location: mappedLocation,
    rawLocation: {
      city,
      country,
      countryRegion
    }
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
