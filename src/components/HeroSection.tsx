'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';

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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy py-20 sm:py-0" aria-label="Hero Section">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className={`w-full h-full bg-[url('/images/gallary/470570328_122181166526171081_1320970727297119947_n.jpg')] bg-cover bg-center transition-opacity duration-500 ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
          role="img"
          aria-label="HVAC service background image"
        >
          <div className="absolute inset-0 bg-navy opacity-80"></div>
        </div>
      </div>
      
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
          
          <div className="mb-8"></div>
          
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