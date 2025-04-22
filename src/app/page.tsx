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
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Ohio', 'Akron', 'Cleveland', 'Canton'],
};

/**
 * Home page - Server Component
 * This serves as a shell that can fetch data and pass it to client components
 */
export default function HomePage() {
  // Get location from server headers (populated by middleware)
  const userLocation = getUserLocationFromHeaders();
  
  return <ClientHomeContent defaultLocation={userLocation} />;
}