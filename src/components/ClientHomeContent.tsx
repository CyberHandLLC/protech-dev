'use client';

import { useState, useCallback, useMemo, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LocationProvider } from '@/contexts/LocationContext';
import { defaultLocation, ServiceLocation } from '@/utils/locationUtils';
import { getLocationByName } from '@/utils/getLocationByName';
import HeroSection from '@/components/HeroSection';
import PageLayout from '@/components/PageLayout';

// Import non-interactive components directly
import ServicesPreview from '@/components/ServicesPreview';

// Dynamic import for client-side interactive components
const ClientLocationManager = dynamic(() => import('./client/ClientLocationManager'), {
  ssr: false // Disable SSR for geolocation components to avoid hydration issues
});

// Aggressively code-split non-critical components to reduce mobile TBT
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), {
  loading: () => <SectionSkeleton />
});

const WhyChooseUs = dynamic(() => import('./WhyChooseUs'), {
  loading: () => <SectionSkeleton />
});

const PartnerLogos = dynamic(() => import('./PartnerLogos'), {
  loading: () => <SectionSkeleton />
});

const CTASection = dynamic(() => import('./CTASection'), {
  loading: () => <SectionSkeleton />
});

// Import Contact Section - verify this component exists in your codebase
const ContactSection = dynamic(() => import('./ContactSection'), {
  loading: () => <ContactSectionSkeleton />
});

// Ultra-lightweight skeleton components - pure HTML with no animations on mobile
const SectionSkeleton = () => (
  <div className="py-12 bg-navy-light">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-slate-200/20 rounded w-1/4 mx-auto mb-6"></div>
      <div className="h-4 bg-slate-200/20 rounded w-2/4 mx-auto mb-10"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-slate-200/10 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const ContactSectionSkeleton = () => (
  <section className="py-16 bg-navy-dark">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-navy-light/30 w-2/3 max-w-md rounded mb-8"></div>
      <div className="h-4 bg-navy-light/20 w-full max-w-lg rounded mb-4"></div>
      <div className="h-4 bg-navy-light/20 w-3/4 max-w-lg rounded mb-12"></div>
      <div className="h-12 bg-navy-light/30 w-32 rounded"></div>
    </div>
  </section>
);

type ClientHomeContentProps = {
  initialLocation?: string;
};

/**
 * Mobile-optimized home content component using Next.js App Router patterns
 * 
 * This component follows the latest Vercel best practices for reducing TBT on mobile devices:
 * 1. Uses the Server Components architecture for static content
 * 2. Isolates client-side JavaScript to small interactive islands
 * 3. Aggressively code-splits non-critical components
 * 4. Implements priority-based component loading
 */
function ClientHomeContentComponent({ initialLocation }: ClientHomeContentProps) {
  // Use the default location from server if no initial location is provided
  const [locationName, setLocationName] = useState(initialLocation || defaultLocation.name);
  
  // Memoize location object to avoid recalculations on each render
  const locationObject = useMemo(() => {
    const foundLocation = getLocationByName(locationName);
    
    if (foundLocation) return foundLocation;
    
    // If not found in our predefined locations, create a simple location object
    return {
      id: locationName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: locationName,
      displayName: locationName.split(',')[0] || 'Cleveland',
      state: 'Ohio',
      stateCode: 'OH',
      zip: [],
      coordinates: defaultLocation.coordinates,
      serviceArea: true,
      primaryArea: false
    } as ServiceLocation;
  }, [locationName]);
  
  // Extract location name string for components that expect string
  const locationName2 = locationObject.name;
  
  // Handle location updates from the client location manager
  const handleLocationUpdate = useCallback((newLocation: string) => {
    if (newLocation && newLocation !== locationName) {
      setLocationName(newLocation);
    }
  }, [locationName]);

  return (
    <LocationProvider>
      <PageLayout>
        {/* Critical path content - loads immediately */}
        <HeroSection location={locationName} />
        
        {/* Isolated client component for location detection */}
        <ClientLocationManager 
          defaultLocation={locationName} 
          onLocationUpdate={handleLocationUpdate} 
        />
        
        {/* Static services preview - critical content */}
        <ServicesPreview location={locationObject} />
        
        {/* Non-critical components loaded with Suspense boundaries */}
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection location={locationObject.id || ''} />
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
          <CTASection location={locationObject.name} />
        </Suspense>
        
        <Suspense fallback={<ContactSectionSkeleton />}>
          <ContactSection location={locationObject.displayName || locationObject.name} />
        </Suspense>
      </PageLayout>
    </LocationProvider>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default memo(ClientHomeContentComponent);