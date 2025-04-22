/**
 * Location detection utility functions
 */

/**
 * Normalize location string for URLs and comparisons
 */
export function normalizeLocation(location: string): string {
  return location.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Get the display name for a location from its normalized form
 */
export function getLocationDisplayName(normalizedLocation: string): string {
  if (!normalizedLocation || normalizedLocation === 'northeast-ohio') {
    return 'Northeast Ohio';
  }
  
  // Convert from slug format to readable format
  // Example: cleveland-oh -> Cleveland, OH
  return normalizedLocation
    .split('-')
    .map((part, index, arr) => {
      // Keep state abbreviations uppercase
      if (index === arr.length - 1 && part.length === 2) {
        return part.toUpperCase();
      }
      // Capitalize first letter of each word
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(', ');
}

/**
 * Get default location when user location isn't available
 */
export function getDefaultLocation(): string {
  return 'Northeast Ohio';
}

/**
 * Convert a string like "Akron, OH" into a URL-friendly slug like "akron-oh"
 */
export function convertToLocationSlug(locationString: string): string {
  if (!locationString) return 'northeast-ohio';
  
  // Split by comma and get city and state portions
  const parts = locationString.split(',');
  const city = parts[0]?.trim() || 'Northeast';
  const state = parts[1]?.trim() || 'Ohio';
  
  // Create URL-friendly slug by replacing spaces and special characters
  const citySlug = city.toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-');       // Replace multiple hyphens with a single one
    
  const stateSlug = state.toLowerCase()
    .replace(/\s+/g, '-')       
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  
  return `${citySlug}-${stateSlug}`;
}

/**
 * Detect if current location is in the service area
 * This is a simplified mock implementation - in a real app, this would check against API data
 */
export function isInServiceArea(location: string): boolean {
  const serviceAreas = ['akron', 'cleveland', 'canton', 'medina', 'stow', 'hudson'];
  
  return serviceAreas.some(area => 
    normalizeLocation(location).includes(normalizeLocation(area))
  );
}
