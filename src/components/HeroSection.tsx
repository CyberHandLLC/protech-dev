// Split into server and client components to reduce client-side JavaScript
// This pattern is key to Next.js App Router performance optimization

// The actual component implementation is in ClientHeroSection below
// This wrapper uses Server Components to reduce client bundle size
import Image from 'next/image';
import Link from 'next/link';
import { convertToLocationSlug } from '@/utils/location';

// Import client components for interactive elements only
import ClientHeroInteractive from './client/ClientHeroInteractive';

// Props type for the hero section
interface HeroSectionProps {
  location?: string;
};

/**
 * Hero section component for the homepage - TRUE SERVER COMPONENT
 * 
 * This follows the Next.js App Router pattern correctly by:
 * 1. Not adding 'use client' directive to this file (making it a server component)
 * 2. Only importing client components for interactive elements
 * 3. Rendering most content on the server to reduce client-side JavaScript
 * 4. Minimizing the client/server boundary to reduce TBT
 */
export default function HeroSection({ location = 'Northeast Ohio' }: HeroSectionProps) {
  // Convert location to URL-friendly slug - this runs on the server
  const locationSlug = convertToLocationSlug(location);
  
  return (
    <section className="relative bg-navy-dark pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 to-navy-dark z-10"></div>
      
      {/* Hero background image - preloaded in layout */}
      <Image
        src="/hero-placeholder.jpg"
        alt="HVAC services background"
        fill
        priority
        className="object-cover object-center z-0 opacity-40"
        sizes="100vw"
      />
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero content - static, rendered on server with no client JS */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Expert HVAC Solutions in {location}
            </h1>
            <p className="text-xl text-ivory/80 mb-8 max-w-xl">
              Professional heating, cooling, and air quality services for residential and commercial needs.
            </p>
            
            {/* Highlights - static content rendered on server */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-red p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">24/7 Emergency Service</h3>
                  <p className="text-sm text-ivory/70">Always available when you need us.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-red p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Licensed Technicians</h3>
                  <p className="text-sm text-ivory/70">Experienced professionals you can trust.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-red p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Upfront Pricing</h3>
                  <p className="text-sm text-ivory/70">No hidden fees or surprises.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-red p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Satisfaction Guaranteed</h3>
                  <p className="text-sm text-ivory/70">Your comfort is our priority.</p>
                </div>
              </div>
            </div>
            
            {/* Static buttons - no client JS needed */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/contact?location=${locationSlug}`}
                className="inline-flex items-center justify-center bg-red hover:bg-red-dark text-white px-5 py-3 rounded transition-colors font-medium shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Us
              </Link>
              <Link
                href={`/services?location=${locationSlug}`}
                className="inline-flex items-center justify-center border-2 border-white hover:bg-white/10 text-white px-5 py-3 rounded transition-colors font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Our Services
              </Link>
            </div>
          </div>
          
          {/* Client component for ONLY interactive elements - clear boundary */}
          <ClientHeroInteractive location={location} />
        </div>
      </div>
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
