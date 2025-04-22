'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import useLocationDetection from '@/hooks/useLocationDetection';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/HeroSection';
import LocationPrompt from '@/components/LocationPrompt';
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';

// Dynamically import less critical components to improve TBT and LCP
// These components will load after the initial page render
const ServicesPreview = dynamic(() => import('@/components/ServicesPreview'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { ssr: true });
const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), { ssr: true });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: true });
const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { ssr: true });

type HomeContentProps = { defaultLocation: ServiceLocation };

// Main home content component - optimized for performance
const HomeContent = memo(function HomeContent({ defaultLocation }: HomeContentProps) {
  // Use the client-side location detection hook directly like ServicesList does
  const { userLocation: clientLocation, isLocating, refreshLocation } = useLocationDetection();
  
  // Memoize the location processing to reduce recalculations
  const processedClientLocation = useMemo(() => {
    if (!clientLocation) return null;
    
    try {
      return {
        name: decodeURIComponent(clientLocation),
        id: convertToLocationSlug(clientLocation)
      };
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error processing client location:', e);
      }
      return {
        name: clientLocation,
        id: convertToLocationSlug(clientLocation)
      };
    }
  }, [clientLocation]);
  
  // Combine server-side and client-side location data with optimized state updates
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    id: string;
    isLoading: boolean;
  }>({ 
    name: defaultLocation.name, 
    id: defaultLocation.id,
    isLoading: true
  });
  
  // Update location when client-side location is detected - optimized for fewer renders
  useEffect(() => {
    // Only debug in development to reduce bundle size
    if (process.env.NODE_ENV === 'development') {
      if (processedClientLocation) {
        console.log('HomeContent: Client location detected:', processedClientLocation.name);
      } else if (!isLocating) {
        console.log('HomeContent: Using server default location:', defaultLocation.name);
      }
    }
    
    if (processedClientLocation) {
      setCombinedLocation({
        name: processedClientLocation.name,
        id: processedClientLocation.id,
        isLoading: false
      });
    } else if (!isLocating) {
      setCombinedLocation({
        name: defaultLocation.name,
        id: defaultLocation.id,
        isLoading: false
      });
    }
  }, [processedClientLocation, isLocating, defaultLocation]);
  
  // Memoized callback for location permission changes
  const handleLocationPermission = useCallback(() => {
    refreshLocation();
  }, [refreshLocation]);

  return (
    <PageLayout>
      {/* High-priority components load first for better LCP */}
      <HeroSection location={combinedLocation.name} isLoading={combinedLocation.isLoading} />
      <LocationPrompt onPermissionChange={handleLocationPermission} />
      
      {/* Lower-priority components load after for better TBT */}
      <ServicesPreview location={combinedLocation.name} />
      <TestimonialsSection location={combinedLocation.id} />
      <WhyChooseUs />
      <PartnerLogos 
        title="Brands We Work With" 
        subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" 
      />
      <CTASection location={combinedLocation.name} />
    </PageLayout>
  );
});

// Export the ClientHomeContent component wrapped in memo to prevent unnecessary re-renders
export default memo(function ClientHomeContent({ defaultLocation }: HomeContentProps) {
  return <HomeContent defaultLocation={defaultLocation} />;
});