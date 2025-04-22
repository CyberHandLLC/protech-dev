// Page is a Server Component by default in Next.js App Router
import ClientHomeContent from '@/components/ClientHomeContent';
import { serviceLocations } from '@/utils/locationUtils';

/**
 * Home page - Server Component
 * This serves as a shell that can fetch data and pass it to client components
 */
export default function Home() {
  // Default location for SEO and initial render
  const defaultLocation = serviceLocations[0];
  
  return <ClientHomeContent defaultLocation={defaultLocation} />;
}