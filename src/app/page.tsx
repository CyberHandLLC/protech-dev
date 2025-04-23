// Page is a Server Component by default in Next.js App Router
import ClientHomeContent from '@/components/ClientHomeContent';
import type { Metadata } from 'next';
import { ServiceLocation } from '@/utils/locationUtils';

// Mark this route as dynamic to handle header usage
export const dynamic = 'force-dynamic';


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
  // Simplified to only pass the location name as a string for better mobile performance
  // This follows React Server Components pattern - server processes data, client renders UI
  const defaultLocationName = 'Northeast Ohio';
  
  return <ClientHomeContent initialLocation={defaultLocationName} />;
}