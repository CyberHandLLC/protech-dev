// Utility functions for location handling

// Get default location when no location is detected
export function getDefaultLocation() {
  return {
    id: 'northeast-ohio',
    name: 'Northeast Ohio',
    isDefault: true
  };
}

// Convert a location name to a URL-friendly slug
export function convertToLocationSlug(locationName: string): string {
  if (!locationName) return 'northeast-ohio';
  
  // Remove special characters, replace spaces with hyphens, and convert to lowercase
  return locationName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();                   // Trim leading/trailing spaces
}

// Format a location slug for display (e.g., "akron-oh" to "Akron OH")
export function formatLocationName(locationSlug: string): string {
  if (!locationSlug) return 'Northeast Ohio';
  
  return locationSlug
    .split('-')
    .map(word => {
      if (word.toLowerCase() === 'oh') return 'OH';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Mock function to get location from coordinates
// In a real app, this would use a geolocation API service
export async function getLocationFromCoordinates(latitude: number, longitude: number): Promise<string> {
  // This is a simplified mock implementation
  console.log(`Getting location from coordinates: ${latitude}, ${longitude}`);
  
  // Mock locations based on general US regions
  // In a real app, this would be a call to a geolocation API
  const mockLocations = [
    { lat: 41.0, lng: -81.5, name: 'Akron OH' },
    { lat: 41.5, lng: -81.7, name: 'Cleveland OH' },
    { lat: 40.8, lng: -81.4, name: 'Canton OH' },
    { lat: 40.0, lng: -82.0, name: 'Columbus OH' },
  ];
  
  // Find the closest match in our mock data
  // This is simplified - a real implementation would use proper distance calculations
  const closestLocation = mockLocations.reduce((closest, location) => {
    const currentDist = Math.abs(location.lat - latitude) + Math.abs(location.lng - longitude);
    const closestDist = Math.abs(closest.lat - latitude) + Math.abs(closest.lng - longitude);
    
    return currentDist < closestDist ? location : closest;
  }, mockLocations[0]);
  
  return closestLocation.name;
}