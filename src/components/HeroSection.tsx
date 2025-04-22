'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type WeatherData = {
  temperature: number | null;
  icon: string;
  isLoading: boolean;
};

type HeroSectionProps = {
  location: string;
  isLoading?: boolean;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
};

const getWeatherIcon = (temp: number): string => {
  if (temp > 85) return '☀️';
  if (temp > 70) return '⛅';
  if (temp > 50) return '🌥️';
  return '❄️';
};

function HeroSection({ 
  location, 
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionProps) {
  // Ensure we have a valid location and decode any URL-encoded characters
  if (!location || location === '') {
    console.error('No location provided to HeroSection, using Northeast Ohio as fallback');
  }
  
  // Decode any URL-encoded characters in the location name
  let displayLocation;
  try {
    displayLocation = decodeURIComponent(location || 'Northeast Ohio');
  } catch (e) {
    console.error('Error decoding location in HeroSection:', e);
    displayLocation = location || 'Northeast Ohio'; // Use original or fallback if decoding fails
  }
  
  // Log the location being used for debugging
  console.log('HeroSection using location:', { originalLocation: location, displayLocation });
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    icon: '☀️',
    isLoading: true
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Optimized to avoid unnecessary dependencies and reduce execution time
  const fetchWeatherData = useCallback(async () => {
    try {
      // Reduced arbitrary timeout to improve perceived performance
      await new Promise(resolve => setTimeout(resolve, 500));
      const temp = Math.floor(Math.random() * (95 - 65) + 65);
      
      setWeather({
        temperature: temp,
        icon: getWeatherIcon(temp),
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather({
        temperature: null,
        icon: '🌡️',
        isLoading: false
      });
    }
  }, []); // Removed location dependency as it's not directly used

  // Fetch weather data when component mounts or location changes - optimized for reduced TBT
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // Defer weather data fetching to avoid blocking interactivity during initial render
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          // Use requestIdleCallback to schedule this work during browser idle periods
          // This is critical for reducing TBT as it moves work off the main thread
          window.requestIdleCallback(() => {
            if (isMounted) {
              setWeather(prev => ({ ...prev, isLoading: true }));
              fetchWeatherData();
            }
          });
        } else {
          // Fallback - delay by a small amount to prioritize other critical rendering
          setTimeout(() => {
            if (isMounted) {
              setWeather(prev => ({ ...prev, isLoading: true }));
              fetchWeatherData();
            }
          }, 300);
        }
      }
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [location, fetchWeatherData]);

  // Optimize image loading for better LCP and reduce TBT
  useEffect(() => {
    // Use requestIdleCallback to move non-critical work off the main thread
    // This significantly reduces TBT by executing when the browser is idle
    const scheduleImageLoad = () => {
      if (typeof window !== 'undefined') {
        // Immediately show a placeholder
        setIsImageLoaded(true);
        
        if ('requestIdleCallback' in window) {
          // Schedule preloading during idle time to avoid blocking the main thread
          window.requestIdleCallback(() => {
            const imagePreloader = new window.Image();
            imagePreloader.src = '/hero-placeholder.jpg';
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            const imagePreloader = new window.Image();
            imagePreloader.src = '/hero-placeholder.jpg';
          }, 200); // Short delay to avoid blocking initial paint
        }
      }
    };
    
    scheduleImageLoad();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy py-20 sm:py-0" aria-label="Hero Section">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className={`w-full h-full transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          role="img"
          aria-label="HVAC service background image"
        >
          {/* Using Next.js Image for optimized loading - contributes to better LCP */}
          <div className="relative w-full h-full">
            {/* Use next/image with optimized attributes and reduced JavaScript overhead */}
            <Image 
              src="/hero-placeholder.jpg" 
              alt="HVAC services background" 
              fill 
              sizes="100vw" /* Simplified sizes attribute to reduce parsing */
              priority={true} /* Mark as LCP candidate */
              quality={70} /* Further reduced quality for faster load */
              className="object-cover"
              loading="eager" /* Force eager loading for LCP */
              fetchPriority="high" /* Use modern fetch priority */
              placeholder="blur" /* Show a blur placeholder while loading */
              blurDataURL="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAEAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAABAwMEAwAAAAAAAAAAAAABAAIDBAUGIQcSE0Fhkf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGREAAgMBAAAAAAAAAAAAAAAAAAECAxOR/9oADAMBAAIRAxEAPwCpo9pKOip2tqqKHnlYCI45HZwMnPJPQCIiDSxrHaR//9k=" /* Optimized smaller blur placeholder */
            />
            {/* Use more efficient gradient that requires less computation */}
            <div className="absolute inset-0 bg-navy/90"></div>
          </div>
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
          
          <div className="mb-8">
            <WeatherDisplay 
              location={displayLocation} 
              temperature={weather.temperature}
              icon={weather.icon} 
              isLoading={isLoading || weather.isLoading} 
            />
          </div>
          
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
            
            {/* Switch to horizontal layout on larger screens */}
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
      
      <EmergencyBadge />
      <ScrollIndicator />
    </section>
  );
}

type WeatherDisplayProps = {
  location: string;
  temperature: number | null;
  icon: string;
  isLoading: boolean;
};

// Memoize WeatherDisplay to prevent unnecessary re-renders
const WeatherDisplay = memo(function WeatherDisplay({ location, temperature, icon, isLoading }: WeatherDisplayProps) {
  // Decode any URL-encoded characters in the location name
  let displayLocation;
  try {
    displayLocation = decodeURIComponent(location);
  } catch (e) {
    console.error('Error decoding location in WeatherDisplay:', e);
    displayLocation = location; // Use original if decoding fails
  }
  return (
    <div className="bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 rounded-lg inline-flex items-center justify-center animate-fadeIn animate-delay-150 text-center sm:text-left w-full sm:w-auto"
         aria-live="polite">
      <span className="text-xl sm:text-2xl mr-2 sm:mr-3" aria-hidden="true">{icon}</span>
      <div>
        <span className="text-white text-xs sm:text-sm">Current Weather in {displayLocation}</span>
        {isLoading ? (
          <div className="h-5 sm:h-6 w-16 sm:w-20 bg-white/30 animate-pulse rounded mt-1" 
               aria-label="Loading weather data"></div>
        ) : (
          <p className="text-white font-bold text-xl">{temperature !== null ? `${temperature}°F` : 'Unavailable'}</p>
        )}
      </div>
    </div>
  );
});

// Memoized component to prevent unnecessary re-renders
const EmergencyBadge = memo(function EmergencyBadge() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 right-0 left-0 sm:left-auto sm:right-8 z-20 flex justify-center sm:block">
      <Link 
        href="/emergency-service"
        className="group flex items-center bg-red rounded-full px-4 sm:px-5 py-2 sm:py-3 shadow-lg hover:bg-red-dark transition-colors"
        aria-label="24/7 Emergency Service"
      >
        <span className="text-xl sm:text-2xl mr-2 animate-pulse" aria-hidden="true">🚨</span>
        <div>
          <p className="text-white font-bold leading-tight text-sm sm:text-base">24/7 Emergency</p>
          <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">Fast Response</p>
        </div>
      </Link>
    </div>
  );
});

// Memoized ScrollIndicator component to prevent unnecessary re-renders
const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block" aria-hidden="true">
      <div className="w-6 sm:w-8 h-10 sm:h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
        <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  );
});

// Export memoized HeroSection component
export default memo(HeroSection);
