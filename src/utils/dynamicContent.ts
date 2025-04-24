// This utility generates dynamic, location-specific content for service pages
import { getLocationData, getLocationFaqs } from '@/data/locationData';
import { getWeatherData, getHvacAdviceForWeather, type WeatherData } from '@/utils/weatherApi';

/**
 * Generate a location-specific introduction paragraph
 */
export function generateLocationIntro(locationId: string, serviceId: string, serviceName: string): string {
  const locationData = getLocationData(locationId);
  
  // Create service-specific intros for each location
  const serviceTypeSpecific = serviceId.includes('air-conditioning') 
    ? `In ${locationData.name}, where summer temperatures average ${locationData.weatherInfo.avgSummerTemp}°F with ${locationData.weatherInfo.humidity.toLowerCase()} humidity, reliable air conditioning is essential for comfort.`
    : serviceId.includes('heating') 
    ? `${locationData.name} winters, with average temperatures dropping to ${locationData.weatherInfo.avgWinterTemp}°F, demand heating systems that are both efficient and dependable.`
    : serviceId.includes('indoor-air-quality')
    ? `The ${locationData.weatherInfo.humidity.toLowerCase()} humidity and seasonal changes in ${locationData.name} create unique indoor air quality challenges for homeowners.`
    : `${locationData.name} homes face unique HVAC requirements due to our region's temperature extremes and variable weather patterns.`;

  // Create a dynamically generated introduction
  return `${locationData.introTemplate} ${serviceTypeSpecific} Our ${serviceName} in ${locationData.name} are tailored to address the specific challenges common in ${locationData.county}, ensuring your comfort throughout the year.`;
}

/**
 * Generate location-specific FAQs by combining standard FAQs with location-specific ones
 */
export function generateLocalizedFaqs(
  locationId: string, 
  serviceId: string, 
  standardFaqs: Array<{question: string, answer: string}>
): Array<{question: string, answer: string}> {
  // Get location-specific FAQs
  const locationFaqs = getLocationFaqs(locationId, serviceId);
  
  // Combine standard and location-specific FAQs
  // If we have more than 3 standard FAQs, keep first and last, and add location-specific ones in between
  if (standardFaqs.length > 3 && locationFaqs.length > 0) {
    return [
      standardFaqs[0],
      ...locationFaqs,
      standardFaqs[standardFaqs.length - 1]
    ];
  }
  
  // Otherwise add location FAQs to the end
  return [...standardFaqs, ...locationFaqs];
}

/**
 * Generate Schema.org structured data for service-location page
 */
export function generateLocalBusinessSchema(
  serviceType: string,
  serviceName: string,
  locationName: string,
  locationCoords: {latitude: number, longitude: number},
  serviceUrl: string
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ProTech Heating & Cooling",
    "description": `Professional ${serviceName} in ${locationName}`,
    "url": serviceUrl,
    "telephone": "+1-330-555-1234",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Wadsworth",
      "addressRegion": "OH",
      "postalCode": "44281",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.15744,
      "longitude": -81.66589
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": locationCoords.latitude,
        "longitude": locationCoords.longitude
      },
      "geoRadius": "45000" // 45km radius
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 41.15744,
        "longitude": -81.66589
      },
      "geoRadius": "72000" // 45 miles in meters
    },
    "sameAs": [
      "https://www.facebook.com/protechhvac",
      "https://twitter.com/protechhvac",
      "https://www.instagram.com/protechhvac"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "servesCuisine": "HVAC Services"
  };
  
  return JSON.stringify(schema);
}

/**
 * Generate different service details based on location
 */
export function generateLocationSpecificDetails(locationId: string, serviceId: string, standardDetails: string[]): string[] {
  const locationData = getLocationData(locationId);
  
  // Get any location-specific challenges for this service type
  const challenges = locationData.commonServiceIssues[serviceId] || [];
  
  // If we have specific challenges for this location and service, add them to details
  if (challenges.length > 0) {
    return [
      ...standardDetails,
      `Solutions for common ${locationData.name} issues: ${challenges[0]}`,
      challenges.length > 1 ? `Specialized expertise for ${challenges[1]}` : ``
    ].filter(item => item !== ''); // Remove empty strings
  }
  
  return standardDetails;
}

/**
 * Generate weather-specific HVAC recommendations
 */
export async function getWeatherRecommendation(locationId: string, serviceId: string): Promise<{
  weatherData: WeatherData;
  recommendation: string;
}> {
  const locationData = getLocationData(locationId);
  
  // Get real-time weather data
  const weatherData = await getWeatherData(
    locationData.coordinates.latitude, 
    locationData.coordinates.longitude
  );
  
  // Generate HVAC recommendation based on weather and service type
  const recommendation = getHvacAdviceForWeather(weatherData, serviceId);
  
  return {
    weatherData,
    recommendation
  };
}

/**
 * Generate custom meta description based on location and service
 */
export function generateMetaDescription(
  locationId: string, 
  serviceId: string, 
  serviceName: string
): string {
  const locationData = getLocationData(locationId);
  
  // Base descriptions for each service type
  const serviceDescriptions: {[key: string]: string} = {
    'air-conditioning': `Professional air conditioning services tailored for ${locationData.name}'s ${locationData.weatherInfo.humidity.toLowerCase()} summers. Our expert technicians provide reliable cooling solutions for homes throughout ${locationData.county}.`,
    
    'heating-systems': `Dependable heating services designed for ${locationData.name}'s cold winters where temperatures average ${locationData.weatherInfo.avgWinterTemp}°F. Keep your home warm with our expert solutions.`,
    
    'indoor-air-quality': `Improve your home's air quality in ${locationData.name} with our specialized filtration and purification services. Combat allergens, humidity issues, and pollutants common in ${locationData.county}.`,
    
    'installations': `Professional HVAC installation services in ${locationData.name}, expertly designed for local climate conditions. Our certified technicians ensure proper sizing and efficiency for ${locationData.county} homes.`,
    
    'maintenance': `Regular HVAC maintenance services in ${locationData.name} to protect your system from local weather challenges. Preventative care tailored to ${locationData.county}'s unique climate conditions.`,
    
    'repairs': `Fast, reliable HVAC repair services throughout ${locationData.name}. Our technicians are familiar with common issues in ${locationData.county} homes and provide prompt, lasting solutions.`,
    
    'tune-ups': `Optimize your HVAC system performance with professional tune-ups designed for ${locationData.name}'s seasonal challenges. Improve efficiency and extend equipment life with our expert service.`
  };
  
  // Get base description or use a generic one
  const baseDescription = serviceDescriptions[serviceId] || 
    `Professional ${serviceName} in ${locationData.name}, tailored to the unique climate challenges of ${locationData.county}. Trust our certified technicians for all your HVAC needs.`;
  
  // Add location-specific weather challenge if available
  const weatherChallenge = locationData.weatherInfo.weatherChallenges[0] || '';
  
  if (weatherChallenge) {
    return `${baseDescription} We understand how ${weatherChallenge.toLowerCase()} affects your home comfort needs.`;
  }
  
  return baseDescription;
}
