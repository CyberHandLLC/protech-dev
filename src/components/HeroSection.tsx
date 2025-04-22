// Split into server and client components to reduce client-side JavaScript
// This pattern is key to Next.js App Router performance optimization

// The actual component implementation is in ClientHeroSection below
// This wrapper uses Server Components to reduce client bundle size
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ClientHeroSection from './client/ClientHeroSection';
import ClientWeatherDisplay from './client/ClientWeatherDisplay';

// Define props type for the Server Component
type HeroSectionProps = {
  location: string;
  isLoading?: boolean;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
};

// Server Component version of HeroSection - runs on the server
// This significantly reduces mobile TBT by moving work off the client
export default function HeroSection({ 
  location, 
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionProps) {
  // Server-side processing of location - zero client-side JavaScript
  const displayLocation = !location || location === '' 
    ? 'Northeast Ohio' 
    : (() => {
        try {
          return decodeURIComponent(location);
        } catch {
          return location;
        }
      })();
  // Hero section with separated client components to reduce TBT
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy py-20 sm:py-0" aria-label="Hero Section">
      {/* Static background - server rendered */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="w-full h-full opacity-100" role="img" aria-label="HVAC service background image">
          <div className="relative w-full h-full">
            <Image 
              src="/hero-placeholder.jpg" 
              alt="HVAC services background" 
              fill 
              sizes="100vw" 
              priority={true}
              quality={70} 
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAEAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAABAwMEAwAAAAAAAAAAAAABAAIDBAUGIQcSE0Fhkf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGREAAgMBAAAAAAAAAAAAAAAAAAECAxOR/9oADAMBAAIRAxEAPwCpo9pKOip2tqqKHnlYCI45HZwMnPJPQCIiDSxrHaR//9k="
            />
            <div className="absolute inset-0 bg-navy/90"></div>
          </div>
        </div>
      </div>
      
      {/* Main content area - server rendered with isolated client components */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-0">
        <div className="max-w-3xl mx-auto md:mx-0">
          <span className="inline-block bg-teal-500/20 backdrop-blur-sm text-ivory px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-fadeIn">
            Trusted HVAC Services in {displayLocation}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fadeIn">
            Expert Heating & <span className="text-ivory">Cooling Solutions</span>
          </h1>
          
          <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl animate-fadeIn animate-delay-75">
            Professional HVAC services tailored to your comfort needs. From emergency repairs to routine maintenance, our certified technicians deliver reliable solutions.
          </p>
          
          {/* Client weather component - isolated for minimal JS */}
          <div className="mb-8">
            <Suspense fallback={<WeatherSkeleton location={displayLocation} />}>
              <ClientWeatherDisplay location={displayLocation} isLoading={isLoading} />
            </Suspense>
          </div>

          {/* Call-to-action buttons - server rendered HTML */}
          <div className="flex flex-col gap-4 animate-fadeIn animate-delay-200 w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/services" className="bg-white text-navy hover:bg-ivory px-4 py-3 rounded-lg font-medium transition-colors text-center text-sm">
                Explore Services
              </Link>
              <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-4 py-3 rounded-lg font-medium transition-all text-center text-sm">
                Contact Us
              </Link>
            </div>
            
            <a 
              href={`tel:${emergencyPhone}`}
              className="text-white hover:text-yellow-300 flex justify-center items-center transition-colors text-sm py-2 border border-white/20 rounded-lg"
              aria-label={`Call us at ${emergencyPhoneDisplay}`}
            >
              <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
            </a>
            
            {/* Desktop layout with larger buttons */}
            <div className="hidden sm:flex sm:flex-row sm:gap-4 sm:w-auto">
              <Link href="/services" className="bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Explore Services
              </Link>
              <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center">
                Contact Us
              </Link>
              <a 
                href={`tel:${emergencyPhone}`}
                className="text-white hover:text-yellow-300 flex justify-start items-center transition-colors py-3"
                aria-label={`Call us at ${emergencyPhoneDisplay}`}
              >
                <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Use client components for interactive elements */}
      <Suspense fallback={null}>
        <ClientHeroSection />
      </Suspense>
    </section>
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
