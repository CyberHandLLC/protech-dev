/**
 * Server Component version of HeroSection
 * Pre-renders the entire hero section with a compact design and integrated form
 */
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the contact form to avoid server/client mismatch
const HeroContactForm = dynamic(() => import('./HeroContactForm'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-navy/50 animate-pulse rounded-lg" />
});

type HeroSectionProps = {
  location: string;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
};

export default function HeroSectionServer({ 
  location,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '330-642-HVAC'
}: HeroSectionProps) {
  // We're guaranteed to have a valid location since it's coming from the server
  const displayLocation = location || 'Northeast Ohio';
  
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-navy" aria-label="Hero Section">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className="w-full h-full bg-[url('/hero-placeholder.jpg')] bg-cover bg-center"
          role="img"
          aria-label="HVAC service background image"
        >
          <div className="absolute inset-0 bg-navy opacity-95"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Content column - takes more space on desktop */}
          <div className="lg:col-span-7">
            <span className="inline-block bg-teal-500/20 backdrop-blur-sm text-ivory px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
              Trusted HVAC Services in {displayLocation}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Expert Heating & <span className="text-ivory">Cooling Solutions</span>
            </h1>
            <p className="text-white/90 text-base mb-6 max-w-2xl">
              Professional HVAC services tailored to your comfort needs. From emergency repairs to routine maintenance, our certified technicians deliver reliable solutions.
            </p>
            
            {/* Feature points */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red flex items-center justify-center mr-2" aria-hidden="true">✓</span>
                <span className="text-white text-sm">24/7 Emergency Service</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red flex items-center justify-center mr-2" aria-hidden="true">✓</span>
                <span className="text-white text-sm">Licensed & Insured</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red flex items-center justify-center mr-2" aria-hidden="true">✓</span>
                <span className="text-white text-sm">Same-Day Service</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red flex items-center justify-center mr-2" aria-hidden="true">✓</span>
                <span className="text-white text-sm">Satisfaction Guaranteed</span>
              </div>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden md:flex md:flex-row md:gap-4 md:items-center">
              <Link href="/services" className="bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Explore Services
              </Link>
              <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center">
                Contact Us
              </Link>
              <a 
                href={`tel:${emergencyPhone}`}
                className="text-white hover:text-yellow-300 flex justify-start items-center transition-colors py-3 ml-4"
                aria-label={`Call us at ${emergencyPhoneDisplay}`}
              >
                <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
              </a>
            </div>
            
            {/* Mobile buttons - only visible on mobile */}
            <div className="flex md:hidden flex-col gap-3 mt-4">
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
            </div>
          </div>
          
          {/* Form column - contact form with suspense fallback */}
          <div className="lg:col-span-5">
            <Suspense fallback={<div className="h-[350px] w-full bg-navy/50 animate-pulse rounded-lg" />}>
              <HeroContactForm className="w-full" />
            </Suspense>
          </div>
        </div>
      </div>
      


    </section>
  );
}
