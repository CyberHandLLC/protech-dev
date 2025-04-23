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
// Set revalidation interval
export const revalidate = 60;
// Prefetch key routes for better navigation performance
export const prefetch = true;



export default async function HomePage() {
  // Get location from server headers (populated by middleware)
  const userLocation = getUserLocationFromHeaders();
  
  // Ensure we have a valid location
  if (!userLocation || !userLocation.name || !userLocation.id) {
    console.error('Invalid or missing user location in HomePage');
  }
  
  // Pass location data to the client component
  return (
    <ClientHomeContent 
      defaultLocation={userLocation}
    />
  );
}