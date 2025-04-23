'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type HeroSectionProps = {
  location: string;
  isLoading?: boolean;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
};

// Memoize the HeroSection component to prevent unnecessary re-renders
export default memo(function HeroSection({ 
  location, 
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionProps) {
  // Ensure we have a valid location and decode any URL-encoded characters
  // Only log errors in development mode
  if (process.env.NODE_ENV !== 'production' && (!location || location === '')) {
    console.error('No location provided to HeroSection, using Northeast Ohio as fallback');
  }
  
  // Decode any URL-encoded characters in the location name
  let displayLocation;
  try {
    displayLocation = decodeURIComponent(location || 'Northeast Ohio');
  } catch (e) {
    // Only log errors in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error decoding location in HeroSection:', e);
    }
    displayLocation = location || 'Northeast Ohio'; // Use original or fallback if decoding fails
  }
  
  // Image loading optimization - use native loading="lazy" instead of JS timeout
  const [isImageVisible, setIsImageVisible] = useState(true);

  // Use intersection observer to defer image loading
  useEffect(() => {
    // Image is shown immediately if we're using the optimized approach
    setIsImageVisible(true);
  }, []);

  return (
    <section className="relative md:h-[85vh] max-h-[800px] min-h-[500px] flex items-center overflow-hidden bg-navy py-16 sm:py-0" aria-label="Hero Section">
      {/* Decorative diagonal SVG element */}
      <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block">
        <svg className="h-full w-full" viewBox="0 0 200 800" preserveAspectRatio="none" fill="none">
          <path d="M0 0L200 100V800H0V0Z" fill="#132035" opacity="0.6" />
        </svg>
      </div>
      
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className={`w-full h-full bg-[url('/hero-placeholder.jpg')] bg-cover bg-center transition-opacity duration-500 ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
          role="img"
          aria-label="HVAC service background image"
        >
          <div className="absolute inset-0 bg-navy opacity-95"></div>
        </div>
      </div>
      
      {/* Main content - using grid for better desktop layout */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left content area */}
          <div className="lg:col-span-7 xl:col-span-6 lg:pr-8">
            <span className="inline-block bg-teal-500/20 backdrop-blur-sm text-ivory px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-fadeIn">
              Trusted HVAC Services in {displayLocation}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 animate-fadeIn leading-tight">
              Expert Heating & <span className="text-ivory">Cooling Solutions</span>
            </h1>
            <p className="text-white/90 text-base mb-6 max-w-lg animate-fadeIn animate-delay-75">
              Professional HVAC services tailored to your comfort needs. From emergency repairs to routine maintenance, our certified technicians deliver reliable solutions.
            </p>
            
            <div className="flex flex-col gap-4 animate-fadeIn animate-delay-200 w-full sm:w-auto">
              {/* Mobile buttons - only visible on small screens */}
              <div className="sm:hidden flex flex-col gap-3 w-full">
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
              
              {/* Desktop layout - only visible on medium screens and up */}
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
          
          {/* Right visual element - only visible on large screens */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red/20 to-red/10 animate-pulse-slow"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-navy-light to-dark-blue-light flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="text-5xl mb-2">🌡️</div>
                  <div className="text-lg font-medium">Comfort Solutions</div>
                  <div className="text-sm text-white/70 mt-1">Year-Round</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
});



// Memoize scroll indicator component to prevent unnecessary re-renders

const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block" aria-hidden="true">
      <div className="w-6 sm:w-8 h-10 sm:h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
        <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  );
});