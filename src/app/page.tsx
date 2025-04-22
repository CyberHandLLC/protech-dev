// Page is a Server Component by default in Next.js App Router
import ClientHomeContent from '@/components/ClientHomeContent';
import type { Metadata } from 'next';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';

/**
 * Metadata for the home page
 */
export const metadata: Metadata = {
  title: 'ProTech HVAC | Professional Heating & Cooling Services',
  description: 'ProTech HVAC provides expert heating, cooling, and air quality services throughout Northeast Ohio. Schedule service, request a quote, or learn about our services.',
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Ohio', 'Northeast Ohio'], // Dynamic keywords based on location
};

/**
 * Home page - Server Component
 * This serves as a shell that can fetch data and pass it to client components
 */
export default function HomePage() {
  // Get location from server headers (populated by middleware)
  const userLocation = getUserLocationFromHeaders();
  
  // Ensure we have a valid location to pass to client components
  if (!userLocation || !userLocation.name || !userLocation.id) {
    console.error('Invalid or missing user location in HomePage');
  }
  
  return <ClientHomeContent defaultLocation={userLocation} />;
}