'use client';

import { useState, useEffect, useCallback, memo, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LocationProvider } from '@/contexts/LocationContext';
import useLocationDetection from '@/hooks/useLocationDetection';
import PageLayout from '@/components/PageLayout';

// Only import critical above-the-fold components directly
import HeroSection from '@/components/HeroSection';
import LocationPrompt from '@/components/LocationPrompt';

// Import types
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';

// Create lightweight fallback components to reduce TBT
const SectionSkeleton = memo(() => (
  <div className="py-12 animate-pulse bg-navy-light">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-slate-200/20 rounded w-1/4 mx-auto mb-6"></div>
      <div className="h-4 bg-slate-200/20 rounded w-2/4 mx-auto mb-10"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-40 bg-slate-200/10 rounded"></div>
        ))}
      </div>
    </div>
  </div>
));

// Dynamically import with aggressive optimization strategies 
// Reduce JavaScript parsing overhead with granular code splitting
const ServicesPreview = dynamic(() => import('@/components/ServicesPreview'), { 
  ssr: true,
  loading: () => <SectionSkeleton />
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { 
  ssr: false, // Defer this non-critical section to reduce TBT
  loading: () => <SectionSkeleton />
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), { 
  ssr: false, // Defer to reduce initial JavaScript execution
  loading: () => <SectionSkeleton />
});

const CTASection = dynamic(() => import('@/components/CTASection'), { 
  ssr: true,
  loading: () => <SectionSkeleton />
});

const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { 
  ssr: false, // Non-critical component, can be loaded later
  loading: () => <SectionSkeleton />
});

type HomeContentProps = { defaultLocation: ServiceLocation };

// Main home content component - optimized for performance
const HomeContent = memo(function HomeContent({ defaultLocation }: HomeContentProps) {
  // Use the client-side location detection hook directly like ServicesList does
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
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
  
  // Memoized callback for location updates
  const handleLocationUpdated = useCallback(() => {
    // This will be triggered when the user updates their location
    // The LocationContext will handle the actual location update
  }, []);

  return (
    <PageLayout>
      {/* Critical above-the-fold content - loads immediately */}
      <HeroSection location={combinedLocation.name} isLoading={combinedLocation.isLoading} />
      <LocationPrompt onLocationUpdated={handleLocationUpdated} />
      
      {/* Use Suspense boundaries to prevent JavaScript execution from blocking the main thread */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesPreview location={combinedLocation.name} />
      </Suspense>

      {/* Break remaining sections into separate code-split chunks to reduce TBT */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection location={combinedLocation.id} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PartnerLogos 
          title="Brands We Work With" 
          subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" 
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CTASection location={combinedLocation.name} />
      </Suspense>
    </PageLayout>
  );
});

// Export the ClientHomeContent component wrapped in memo to prevent unnecessary re-renders
export default memo(function ClientHomeContent({ defaultLocation }: HomeContentProps) {
  return (
    <LocationProvider>
      <HomeContent defaultLocation={defaultLocation} />
    </LocationProvider>
  );
});