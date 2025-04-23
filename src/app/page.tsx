// Page is a Server Component by default in Next.js App Router
import ClientHomeContent from '@/components/ClientHomeContent';
import type { Metadata } from 'next';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';

/**
 * Metadata for the home page with optimized SEO
 */
export const metadata: Metadata = {
  title: 'ProTech HVAC | Professional Heating & Cooling Services',
  description: 'ProTech HVAC provides expert heating, cooling, and air quality services throughout Northeast Ohio. Schedule service, request a quote, or learn about our services.',
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Ohio', 'Northeast Ohio'],
};

/**
 * Home page - Server Component
 * Optimized for performance by moving data fetching to the server
 */
// Using Edge runtime for optimal performance with server-side location detection
export const runtime = 'edge';
// Force static rendering with selective hydration
export const dynamic = 'force-static';
export const revalidate = 60;
// Prefetch key routes for better navigation performance
export const prefetch = true;

/**
 * Server-side fetching of weather data
 * This replaces the client-side random weather simulation
 */
async function getWeatherData(location: string) {
  try {
    // For demo purposes we're simulating weather data
    // In production, this would be a real API call to a weather service
    const baseTemp = location.toLowerCase().includes('akron') ? 72 :
                    location.toLowerCase().includes('cleveland') ? 68 :
                    location.toLowerCase().includes('canton') ? 75 : 70;
    
    // Add some randomness to simulate real weather
    const temp = Math.floor(baseTemp + (Math.random() * 10 - 5));
    
    // Get appropriate weather icon
    const icon = temp > 85 ? '☀️' : 
                temp > 70 ? '⛅' : 
                temp > 50 ? '🌥️' : '❄️';
    
    return {
      temperature: temp,
      icon: icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default values if weather fetching fails
    return {
      temperature: 72,
      icon: '⛅'
    };
  }
}

export default async function HomePage() {
  // Get location from server headers (populated by middleware)
  const userLocation = getUserLocationFromHeaders();
  
  // Fetch weather data on the server
  const weatherData = await getWeatherData(userLocation.name);
  
  // Ensure we have a valid location
  if (!userLocation || !userLocation.name || !userLocation.id) {
    console.error('Invalid or missing user location in HomePage');
  }
  
  // Pass both location and weather data to the client component
  return (
    <ClientHomeContent 
      defaultLocation={userLocation} 
      weatherData={{
        temperature: weatherData.temperature,
        icon: weatherData.icon
      }} 
    />
  );
}