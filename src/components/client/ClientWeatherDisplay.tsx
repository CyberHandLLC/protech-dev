'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { ServiceLocation } from '@/utils/locationUtils';

type WeatherData = {
  temperature: number | null;
  icon: string;
  isLoading: boolean;
};

type ClientWeatherDisplayProps = {
  location?: ServiceLocation | string;
  isLoading?: boolean;
};

/**
 * Client-side weather component that only loads when needed
 * This isolates expensive JavaScript logic to improve mobile TBT
 */
function ClientWeatherDisplay({ 
  location, 
  isLoading = false 
}: ClientWeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    icon: '☀️',
    isLoading: true
  });

  // Helper function to determine weather icon based on temperature
  const getWeatherIcon = (temp: number): string => {
    if (temp > 85) return '☀️';
    if (temp > 70) return '⛅';
    if (temp > 50) return '🌥️';
    return '❄️';
  };

  // Optimized to avoid unnecessary dependencies and reduce execution time
  const fetchWeatherData = useCallback(async () => {
    try {
      // Simulated API call with shorter timeout for mobile
      await new Promise(resolve => setTimeout(resolve, 300));
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
  }, []); // No dependencies needed for this simple mock

  useEffect(() => {
    // Use the browser's idle callback API to schedule non-critical work
    // This is crucial for mobile TBT reduction
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = (window as any).requestIdleCallback(() => {
        setWeather(prev => ({ ...prev, isLoading: true }));
        fetchWeatherData();
      }, { timeout: 2000 });
      
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(idleCallback);
        }
      };
    } else {
      // Fallback with higher delay on mobile to prioritize critical rendering
      const timeoutId = setTimeout(() => {
        setWeather(prev => ({ ...prev, isLoading: true }));
        fetchWeatherData();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [fetchWeatherData]);

  // Helper to safely get location name
  const displayLocation = (() => {
    if (!location) return 'Northeast Ohio'; // Default fallback
    
    if (typeof location === 'string') {
      try {
        return decodeURIComponent(location);
      } catch {
        return location;
      }
    } else {
      // It's a ServiceLocation object
      return location.displayName || location.name;
    }
  })();

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 rounded-lg inline-flex items-center justify-center animate-fadeIn animate-delay-150 text-center sm:text-left w-full sm:w-auto"
      aria-live="polite"
    >
      <span className="text-xl sm:text-2xl mr-2 sm:mr-3" aria-hidden="true">{weather.icon}</span>
      <div>
        <span className="text-white text-xs sm:text-sm">Current Weather in {displayLocation}</span>
        {isLoading || weather.isLoading ? (
          <div 
            className="h-5 sm:h-6 w-16 sm:w-20 bg-white/30 animate-pulse rounded mt-1" 
            aria-label="Loading weather data"
          ></div>
        ) : (
          <p className="text-white font-bold text-xl">
            {weather.temperature !== null ? `${weather.temperature}°F` : 'Unavailable'}
          </p>
        )}
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ClientWeatherDisplay);
