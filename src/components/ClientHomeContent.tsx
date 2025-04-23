'use client';

import { useState, useEffect } from 'react';
import useLocationDetection from '@/hooks/useLocationDetection';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';
import LazyHydrate from '@/components/LazyHydrate';
// Enable SSR but defer hydration for better TBT
// The below-the-fold components use ssr:true for server rendering with client hydration only when visible
const HeroSection = dynamic(() => import('@/components/HeroSection'), { 
  // Hero section is critical above-the-fold content
  ssr: true,
  loading: () => <div className="h-[600px] bg-gray-200 animate-pulse" /> 
});

// Below-the-fold components with SSR enabled for better performance
const ServicesPreview = dynamic(() => import('@/components/ServicesPreview'), { 
  ssr: true, 
  loading: () => <div className="h-80 bg-gray-200 animate-pulse" /> 
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { 
  ssr: true, 
  loading: () => <div className="h-60 bg-gray-200 animate-pulse" /> 
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), { 
  ssr: true, 
  loading: () => <div className="h-80 bg-gray-200 animate-pulse" /> 
});

const CTASection = dynamic(() => import('@/components/CTASection'), { 
  ssr: true, 
  loading: () => <div className="h-60 bg-gray-200 animate-pulse" /> 
});

const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { 
  ssr: true, 
  loading: () => <div className="h-40 bg-gray-200 animate-pulse" /> 
});
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
      {/* Hero section loads immediately - it's above the fold */}
      <HeroSection 
        location={combinedLocation.name} 
        isLoading={combinedLocation.isLoading} 
        // Pass the server-provided weather data to avoid client-side fetch
        serverWeather={serverWeather}
      />
      
      {/* Services preview - first section below the fold, high priority */}
      <LazyHydrate 
        whenToHydrate="visible" 
        rootMargin="-100px" 
        priority={1}
        id="services-section"
      >
        <ServicesPreview location={combinedLocation.name} />
      </LazyHydrate>
      
      {/* Testimonials - medium priority */}
      <LazyHydrate 
        whenToHydrate="visible" 
        rootMargin="-150px" 
        priority={2}
        id="testimonials-section"
      >
        <TestimonialsSection location={combinedLocation.id} />
      </LazyHydrate>
      
      {/* Why Choose Us - medium priority */}
      <LazyHydrate 
        whenToHydrate="visible" 
        rootMargin="-150px" 
        priority={3}
        id="why-choose-us-section"
      >
        <WhyChooseUs />
      </LazyHydrate>
      
      {/* Partner logos - low priority, mostly static content */}
      <LazyHydrate 
        whenToHydrate="visible" 
        rootMargin="-200px" 
        priority={4}
        id="partner-logos-section"
      >
        <PartnerLogos title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      </LazyHydrate>
      
      {/* CTA section - slightly higher priority than partners since it has interactive elements */}
      <LazyHydrate 
        whenToHydrate="visible" 
        rootMargin="-200px" 
        priority={3}
        id="cta-section"
      >
        <CTASection location={combinedLocation.name} />
      </LazyHydrate>
    </PageLayout>
  );
}

export default function ClientHomeContent({ defaultLocation, weatherData }: HomeContentProps) {
  return <HomeContent defaultLocation={defaultLocation} weatherData={weatherData} />;
}