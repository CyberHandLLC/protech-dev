'use client';

import { useState, useEffect } from 'react';
import useLocationDetection from '@/hooks/useLocationDetection';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import CTASection from '@/components/CTASection';
import PartnerLogos from '@/components/PartnerLogos';
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';

type HomeContentProps = { defaultLocation: ServiceLocation };

function HomeContent({ defaultLocation }: HomeContentProps) {
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

  return (
    <PageLayout>
      <HeroSection location={combinedLocation.name} isLoading={combinedLocation.isLoading} />
      <ServicesPreview location={combinedLocation.name} />
      <TestimonialsSection location={combinedLocation.id} />
      <WhyChooseUs />
      <PartnerLogos title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      <CTASection location={combinedLocation.name} />
    </PageLayout>
  );
}

export default function ClientHomeContent({ defaultLocation }: HomeContentProps) {
  return <HomeContent defaultLocation={defaultLocation} />;
}