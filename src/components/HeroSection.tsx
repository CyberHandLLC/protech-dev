'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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

export default function HeroSection({ 
  location, 
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionProps) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    icon: '☀️',
    isLoading: true
  });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
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
  }, [location]);

  useEffect(() => {
    setWeather(prev => ({ ...prev, isLoading: true }));
    fetchWeatherData();
  }, [location, fetchWeatherData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-navy" aria-label="Hero Section">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className={`w-full h-full bg-[url('/hero-placeholder.jpg')] bg-cover bg-center transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          role="img"
          aria-label="HVAC service background image"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/90 to-navy/85"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-block bg-teal-500/20 backdrop-blur-sm text-ivory px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fadeIn">
            Trusted HVAC Services in {location}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn">
            Expert Heating & <span className="text-ivory">Cooling Solutions</span>
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl animate-fadeIn animate-delay-75">
            Professional HVAC services tailored to your comfort needs. From emergency repairs to routine maintenance, our certified technicians deliver reliable solutions.
          </p>
          
          <WeatherDisplay 
            location={location} 
            temperature={weather.temperature}
            icon={weather.icon} 
            isLoading={isLoading || weather.isLoading} 
          />
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn animate-delay-200">
            <Link href="/services" className="bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center">
              Explore Services
            </Link>
            <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center">
              Contact Us
            </Link>
            <a 
              href={`tel:${emergencyPhone}`}
              className="text-white hover:text-yellow-300 flex justify-center sm:justify-start items-center transition-colors"
              aria-label={`Call us at ${emergencyPhoneDisplay}`}
            >
              <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
            </a>
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

function WeatherDisplay({ location, temperature, icon, isLoading }: WeatherDisplayProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg inline-flex items-center mb-8 animate-fadeIn animate-delay-150"
         aria-live="polite">
      <span className="text-2xl mr-3" aria-hidden="true">{icon}</span>
      <div>
        <span className="text-white text-sm">Current Weather in {location}</span>
        {isLoading ? (
          <div className="h-6 w-20 bg-white/30 animate-pulse rounded mt-1" 
               aria-label="Loading weather data"></div>
        ) : (
          <p className="text-white font-bold text-lg">{temperature !== null ? `${temperature}°F` : 'Unavailable'}</p>
        )}
      </div>
    </div>
  );
}

function EmergencyBadge() {
  return (
    <div className="absolute bottom-8 right-8 z-20">
      <Link 
        href="/emergency-service"
        className="group flex items-center bg-red rounded-full px-5 py-3 shadow-lg hover:bg-red-dark transition-colors"
        aria-label="24/7 Emergency Service"
      >
        <span className="text-2xl mr-2 animate-pulse" aria-hidden="true">🚨</span>
        <div>
          <p className="text-white font-bold leading-tight">24/7 Emergency</p>
          <p className="text-sm text-white/80 group-hover:text-white transition-colors">Fast Response</p>
        </div>
      </Link>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
      <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
        <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  );
}