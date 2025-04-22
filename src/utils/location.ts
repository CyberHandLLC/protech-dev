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
 * Convert a full location name to its normalized form
 * Example: "Cleveland, OH" -> "cleveland-oh"
 */
export function convertToLocationSlug(locationName: string): string {
  return locationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
