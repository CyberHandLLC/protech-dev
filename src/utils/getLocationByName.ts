import { ServiceLocation, serviceLocations } from '@/utils/locationUtils';

/**
 * Get a service location by its name
 * 
 * @param locationName The name of the location to find (e.g., 'Cleveland, OH')
 * @returns The matching ServiceLocation or undefined if not found
 */
export function getLocationByName(locationName: string): ServiceLocation | undefined {
  if (!locationName) {
    return undefined;
  }
  
  // Try to match the full name (e.g., "Cleveland, OH")
  const exactMatch = serviceLocations.find(location => 
    location.name.toLowerCase() + ', ' + location.stateCode.toLowerCase() === locationName.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, try to match just the city part
  return serviceLocations.find(location => {
    const locationParts = locationName.split(',')[0].trim().toLowerCase();
    return location.name.toLowerCase() === locationParts;
  });
}
