/**
 * Weather utilities for ProTech HVAC
 * 
 * This module provides functions to fetch and process weather data
 * which helps make each location page unique for SEO.
 */

// Type for weather data response
export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  icon: string;
}

/**
 * Get weather data for a specific location
 * This creates unique content for each page load
 * 
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate 
 * @returns Weather data object
 */
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    // Currently using a fallback implementation to avoid API key requirements
    // In production, you would use a real weather API like OpenWeatherMap or Weather.gov
    return generateFallbackWeatherData(latitude, longitude);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Generate fallback weather data based on location and current date
 * This ensures we have dynamic, unique content for each location
 * even without calling an external API
 * 
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Simulated weather data
 */
function generateFallbackWeatherData(latitude: number, longitude: number): WeatherData {
  // Get current date for seed value
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  
  // Use location and date to create deterministic but varied weather
  const tempSeed = (latitude * 10 + longitude) % 10;
  const humiditySeed = (longitude * 10 + latitude) % 10;
  
  // Generate basic weather values
  let baseTemp = month <= 2 || month >= 11 ? 35 : month >= 5 && month <= 8 ? 80 : 60;
  baseTemp += tempSeed - 5; // -5 to +5 variation
  baseTemp += (day % 5) - 2; // Additional daily variation
  
  let baseHumidity = month >= 5 && month <= 8 ? 65 : 45;
  baseHumidity += humiditySeed - 5; // -5 to +5 variation
  
  // Generate weather condition based on humidity and temperature
  let description = 'clear sky';
  if (baseHumidity > 75) {
    description = 'rain';
  } else if (baseHumidity > 60) {
    description = 'cloudy';
  } else if (baseTemp < 32 && baseHumidity > 50) {
    description = 'snow';
  } else if (baseHumidity > 50) {
    description = 'partly cloudy';
  }
  
  // Calculate wind and feels-like temperature
  const windSpeed = 5 + (tempSeed % 10);
  const feelsLike = baseTemp - (windSpeed > 10 ? 5 : 0);
  
  return {
    temp: baseTemp,
    humidity: baseHumidity,
    description,
    windSpeed,
    feelsLike,
    pressure: 1010 + (day % 20),
    icon: getWeatherIcon(description)
  };
}

/**
 * Get appropriate weather icon based on description
 */
function getWeatherIcon(description: string): string {
  if (description.includes('rain')) {
    return '🌧️';
  } else if (description.includes('cloud')) {
    return '☁️';
  } else if (description.includes('snow')) {
    return '❄️';
  } else if (description.includes('clear')) {
    return '☀️';
  } else {
    return '🌤️';
  }
}
