/**
 * Expanded location utilities for ProTech HVAC
 * 
 * This module extends the core locationUtils.ts with more service locations
 * to support our expanded service area while ensuring unique content for SEO.
 */

import { ServiceLocation } from './locationUtils';
import { zipCodeToLocation } from './serviceAreaUtils';

// Helper to generate coordinates for cities without specific coordinates
// These are approximate and should be updated with actual coordinates if possible
const cityCoordinates: Record<string, { lat: number, lng: number }> = {
  'Akron': { lat: 41.0814, lng: -81.5190 },
  'Cleveland': { lat: 41.4993, lng: -81.6944 },
  'Canton': { lat: 40.7989, lng: -81.3784 },
  'Wooster': { lat: 40.8051, lng: -81.9351 },
  'Medina': { lat: 41.1434, lng: -81.8548 },
  'Wadsworth': { lat: 41.0258, lng: -81.7298 },
  'Barberton': { lat: 41.0134, lng: -81.6051 },
  'Cuyahoga Falls': { lat: 41.1339, lng: -81.4845 },
  'Stow': { lat: 41.1595, lng: -81.4401 },
  'Tallmadge': { lat: 41.1014, lng: -81.4415 },
  'Hudson': { lat: 41.2400, lng: -81.4404 },
  'Seville': { lat: 41.0128, lng: -81.8615 },
  'Brunswick': { lat: 41.2381, lng: -81.8348 },
  'Lodi': { lat: 41.0328, lng: -82.0070 },
  'Rittman': { lat: 40.9784, lng: -81.7804 },
  'Orrville': { lat: 40.8364, lng: -81.7648 },
  'Smithville': { lat: 40.8678, lng: -81.8576 },
  'Fredericksburg': { lat: 40.6792, lng: -81.8829 },
  'Doylestown': { lat: 40.9717, lng: -81.6954 },
  'Massillon': { lat: 40.7967, lng: -81.5215 },
  'Norton': { lat: 41.0292, lng: -81.6380 },
};

// Map to convert city names to location slugs
function cityToSlug(cityName: string): string {
  return cityName.toLowerCase().replace(/\s+/g, '-') + '-oh';
}

// Extract all unique cities from the zip code database
function extractUniqueCities(): string[] {
  const citiesSet = new Set<string>();
  
  Object.values(zipCodeToLocation).forEach(location => {
    if (location.city && location.city !== '') {
      // Skip generic county entries
      if (!location.city.includes('County')) {
        citiesSet.add(location.city);
      }
    }
  });
  
  return Array.from(citiesSet);
}

// Map county names to ensure consistency
const countyMap: Record<string, string> = {
  'Summit': 'Summit County',
  'Medina': 'Medina County',
  'Wayne': 'Wayne County',
  'Cuyahoga': 'Cuyahoga County',
  'Stark': 'Stark County',
  'Portage': 'Portage County',
  'Lorain': 'Lorain County',
  'Geauga': 'Geauga County',
  'Lake': 'Lake County',
  'Ashland': 'Ashland County',
  'Richland': 'Richland County',
};

// Generate expanded service locations based on the zip code database
export function generateExpandedServiceLocations(): ServiceLocation[] {
  // Start with our core locations that have detailed data
  const coreLocations: ServiceLocation[] = [
    {
      id: 'akron-oh',
      name: 'Akron',
      state: 'Ohio',
      stateCode: 'OH',
      zip: ['44301', '44302', '44303', '44304', '44305', '44306', '44307', '44308', '44309', '44310'],
      coordinates: { lat: 41.0814, lng: -81.5190 },
      serviceArea: true,
      primaryArea: true,
      county: 'Summit County'
    },
    {
      id: 'cleveland-oh',
      name: 'Cleveland',
      state: 'Ohio',
      stateCode: 'OH',
      zip: ['44101', '44102', '44103', '44104', '44105', '44106', '44107', '44108', '44109', '44110'],
      coordinates: { lat: 41.4993, lng: -81.6944 },
      serviceArea: true,
      primaryArea: false,
      county: 'Cuyahoga County'
    },
    {
      id: 'canton-oh',
      name: 'Canton',
      state: 'Ohio',
      stateCode: 'OH',
      zip: ['44701', '44702', '44703', '44704', '44705', '44706', '44707', '44708', '44709', '44710'],
      coordinates: { lat: 40.7989, lng: -81.3784 },
      serviceArea: true,
      primaryArea: false,
      county: 'Stark County'
    },
  ];
  
  // Get unique cities from the zip code database
  const uniqueCities = extractUniqueCities();
  
  // Create service locations for each city
  uniqueCities.forEach(city => {
    // Skip cities we already have detailed data for
    if (['Akron', 'Cleveland', 'Canton'].includes(city)) {
      return;
    }
    
    // Find the county for this city
    let county = '';
    // Find the first zip code entry that matches this city
    Object.entries(zipCodeToLocation).forEach(([zip, location]) => {
      if (location.city === city && !county) {
        county = countyMap[location.county] || location.county + ' County';
      }
    });
    
    // Create coordinates for this city
    const coordinates = cityCoordinates[city] || { lat: 41.0, lng: -81.5 }; // Default to Akron area if not found
    
    // Add the new location
    coreLocations.push({
      id: cityToSlug(city),
      name: city,
      state: 'Ohio',
      stateCode: 'OH',
      zip: [], // We could populate this with zip codes from the database
      coordinates: coordinates,
      serviceArea: true,
      primaryArea: false,
      county: county
    });
  });
  
  return coreLocations;
}

// Generate the expanded locations
export const expandedServiceLocations = generateExpandedServiceLocations();

// Helper to get location by ID from the expanded list
export function getExpandedLocationById(id: string): ServiceLocation | undefined {
  return expandedServiceLocations.find(location => location.id.toLowerCase() === id.toLowerCase());
}

// Helper to extract county information based on location ID/slug
export function getCountyFromSlug(slug: string): string {
  const location = getExpandedLocationById(slug);
  if (location && location.county) {
    return location.county;
  }
  
  // Try to parse the city name from the slug
  const cityName = slug.replace(/-oh$/, '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Look for this city in zipCodeToLocation
  for (const [, location] of Object.entries(zipCodeToLocation)) {
    if (location.city === cityName) {
      return countyMap[location.county] || location.county + ' County';
    }
  }
  
  return 'Northeast Ohio'; // Default
}

// Helper to format a location slug into a nice location name
export function formatSlugToName(slug: string): string {
  return slug
    .replace(/-oh$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ', OH';
}

// Export expanded location utilities
export default {
  getExpandedLocationById,
  getCountyFromSlug,
  formatSlugToName,
  expandedServiceLocations
};
