'use client';

import { useState, useEffect } from 'react';
import useLocationDetection from '@/hooks/useLocationDetection';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';
import LazyHydrate from '@/components/LazyHydrate';
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false, loading: () => <div className="h-[600px] bg-gray-200 animate-pulse" /> });
const ServicesPreview = dynamic(() => import('@/components/ServicesPreview'), { ssr: false, loading: () => <div className="h-80 bg-gray-200 animate-pulse" /> });
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { ssr: false, loading: () => <div className="h-60 bg-gray-200 animate-pulse" /> });
const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), { ssr: false, loading: () => <div className="h-80 bg-gray-200 animate-pulse" /> });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false, loading: () => <div className="h-60 bg-gray-200 animate-pulse" /> });
const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { ssr: false, loading: () => <div className="h-40 bg-gray-200 animate-pulse" /> });
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';

type WeatherData = {
  temperature: number;
  icon: string;
};

type HomeContentProps = { 
  defaultLocation: ServiceLocation;
  weatherData?: WeatherData;
};

function HomeContent({ defaultLocation, weatherData }: HomeContentProps) {
  // Use the client-side location detection hook directly like ServicesList does
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // Combine server-side and client-side location data
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    id: string;
    isLoading: boolean;
  }>({ 
    name: defaultLocation.name, 
    id: defaultLocation.id,
    isLoading: true
  });
  
  // Update location when client-side location is detected
  useEffect(() => {
    // If there's a client-side detected location, use it
    if (clientLocation) {
      console.log('HomeContent: Client location detected:', clientLocation);
      
      // Format location name and ID properly
      let locationName = clientLocation;
      try {
        locationName = decodeURIComponent(clientLocation);
      } catch (e) {
        console.error('Error decoding location:', e);
      }
      
      // Create location ID for testimonials
      const locationId = convertToLocationSlug(clientLocation);
      
      setCombinedLocation({
        name: locationName,
        id: locationId,
        isLoading: false
      });
    } else if (!isLocating) {
      // If not detecting location and no client location, use the server default
      console.log('HomeContent: Using server default location:', defaultLocation.name);
      setCombinedLocation({
        name: defaultLocation.name,
        id: defaultLocation.id,
        isLoading: false
      });
    }
  }, [clientLocation, isLocating, defaultLocation]);

  // Use the server-provided weather data if available
  const serverWeather = weatherData ? {
    temperature: weatherData.temperature,
    icon: weatherData.icon,
    isLoading: false
  } : undefined;

  return (
    <PageLayout>
      <HeroSection 
        location={combinedLocation.name} 
        isLoading={combinedLocation.isLoading} 
        // Pass the server-provided weather data to avoid client-side fetch
        serverWeather={serverWeather}
      />
      <LazyHydrate rootMargin="-200px">
        <ServicesPreview location={combinedLocation.name} />
      </LazyHydrate>
      <LazyHydrate rootMargin="-200px">
        <TestimonialsSection location={combinedLocation.id} />
      </LazyHydrate>
      <LazyHydrate rootMargin="-200px">
        <WhyChooseUs />
      </LazyHydrate>
      <LazyHydrate rootMargin="-200px">
        <PartnerLogos title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      </LazyHydrate>
      <LazyHydrate rootMargin="-200px">
        <CTASection location={combinedLocation.name} />
      </LazyHydrate>
    </PageLayout>
  );
}

export default function ClientHomeContent({ defaultLocation, weatherData }: HomeContentProps) {
  return <HomeContent defaultLocation={defaultLocation} weatherData={weatherData} />;
}