'use client';

import { useState, useEffect } from 'react';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import { ServiceLocation } from '@/utils/locationUtils';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import CTASection from '@/components/CTASection';
import PartnerLogos from '@/components/PartnerLogos';
import LocationPrompt from '@/components/LocationPrompt';

type HomeContentProps = { defaultLocation: ServiceLocation };

function HomeContent({ defaultLocation }: HomeContentProps) {
  const { nearestServiceLocation, isLoading, permissionStatus } = useLocation();
  const [locationState, setLocationState] = useState(nearestServiceLocation || defaultLocation);
  
  // Update locationState whenever nearestServiceLocation changes
  useEffect(() => {
    if (nearestServiceLocation) {
      console.log('HomeContent: Location updated to', nearestServiceLocation.name);
      setLocationState(nearestServiceLocation);
    }
  }, [nearestServiceLocation]);
  
  // Force refresh when explicit location update occurs
  const handleLocationUpdate = () => {
    console.log('HomeContent: Location manually updated');
    // This will cause a re-render with the latest location
    setLocationState(prevState => ({ ...prevState }));
  };

  return (
    <PageLayout>
      <HeroSection location={locationState.name} isLoading={isLoading} />
      <ServicesPreview location={locationState.name} />
      <TestimonialsSection location={locationState.id} />
      <WhyChooseUs />
      <PartnerLogos title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      <CTASection location={locationState.name} />
      
      {/* Only display location prompt if not already showing loading state elsewhere */}
      {!isLoading && permissionStatus !== 'granted' && (
        <LocationPrompt onLocationUpdated={handleLocationUpdate} />
      )}
    </PageLayout>
  );
}

export default function ClientHomeContent({ defaultLocation }: HomeContentProps) {
  return (
    <LocationProvider>
      <HomeContent defaultLocation={defaultLocation} />
    </LocationProvider>
  );
}