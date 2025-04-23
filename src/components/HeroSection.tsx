// Split into server and client components to reduce client-side JavaScript
// This pattern is key to Next.js App Router performance optimization

// The actual component implementation is in ClientHeroSection below
// This wrapper uses Server Components to reduce client bundle size
import Image from 'next/image';
import Link from 'next/link';
import { getLocationByName } from '@/utils/locationUtils';
// Import client component for interactive elements
import HeroSectionClient from './client/HeroSectionClient';

// Define props type for the Server Component
type HeroSectionProps = {
  location: string;
  isLoading?: boolean;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
};

// Server Component version
/**
 * HeroSection component - Server Component
 * Provides static content and passes necessary data to client components
 */
export default function HeroSection({ 
  location, 
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionProps) {
  // Default location information - prepared on server
  const defaultLocation = location || 'Northeast Ohio';
  const locationDetails = getLocationByName(defaultLocation);

  return (
    <div className="relative bg-navy-dark min-h-[600px] md:min-h-[700px] overflow-hidden flex items-center">
      {/* Background image with overlay - rendered on server */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-background.jpg"
          alt="HVAC technician working"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy-dark/70"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text content area - server-rendered */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Professional HVAC Solutions
              {locationDetails && (
                <span className="block text-red mt-2">
                  in {locationDetails.name}
                </span>
              )}
            </h1>
            
            <p className="text-xl text-ivory/90 mb-8 max-w-lg">
              Heating, cooling, and air quality services from a team you can trust
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-red hover:bg-red-dark text-white font-medium rounded-lg text-lg px-8 py-3 transition-colors inline-flex items-center"
              >
                <span>Schedule Service</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                href="/services"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-medium rounded-lg text-lg px-8 py-3 transition-colors"
              >
                Our Services
              </Link>
            </div>
            
            {/* Client components for all interactive features - rendered only on client */}
            <HeroSectionClient defaultLocation={locationDetails} isLoading={isLoading} emergencyPhone={emergencyPhone} emergencyPhoneDisplay={emergencyPhoneDisplay} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton component for weather display (server rendered)
function WeatherSkeleton({ location }: { location: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 rounded-lg inline-flex items-center justify-center animate-fadeIn animate-delay-150 text-center sm:text-left w-full sm:w-auto"
         aria-live="polite">
      <span className="text-xl sm:text-2xl mr-2 sm:mr-3" aria-hidden="true">☀️</span>
      <div>
        <span className="text-white text-xs sm:text-sm">Current Weather in {location}</span>
        <div className="h-5 sm:h-6 w-16 sm:w-20 bg-white/30 animate-pulse rounded mt-1" 
             aria-label="Loading weather data"></div>
      </div>
    </div>
  );
}

// Create these files next:
// 1. src/components/client/ClientHeroSection.tsx
// 2. src/components/client/ClientWeatherDisplay.tsx
