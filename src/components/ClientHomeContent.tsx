'use client';

import { Suspense, useState, useEffect, memo, use } from 'react';
import useLocationDetection from '@/hooks/useLocationDetection';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';
import OptimizedClientWrapper from '@/components/OptimizedClientWrapper';
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';
import ImageGallery from '@/components/ImageGallery';

// Next.js 15 optimized dynamic imports with enhanced TBT reduction
// Use SSR with proper error boundaries and suspense boundaries
const HeroSection = dynamic(() => import('@/components/HeroSection'), { 
  ssr: true,
  loading: () => <div className="h-[600px] bg-navy/50 animate-pulse rounded-md" /> 
});

const ServicesPreview = dynamic(() => import('@/components/ServicesPreview'), { 
  ssr: true,
  loading: () => <div className="h-80 bg-navy/50 animate-pulse rounded-md" /> 
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), { 
  ssr: true,
  loading: () => <div className="h-60 bg-navy/50 animate-pulse rounded-md" /> 
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), { 
  ssr: true,
  loading: () => <div className="h-80 bg-navy/50 animate-pulse rounded-md" /> 
});

const CTASection = dynamic(() => import('@/components/CTASection'), { 
  ssr: true,
  loading: () => <div className="h-60 bg-navy/50 animate-pulse rounded-md" /> 
});

const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { 
  ssr: true,
  loading: () => <div className="h-40 bg-navy/50 animate-pulse rounded-md" /> 
});

type HomeContentProps = { 
  defaultLocation: ServiceLocation;
};

// Component implementation
function HomeContent({ defaultLocation }: HomeContentProps) {
  // Use the client-side location detection hook
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // Combine server-side and client-side location data with initial server state
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    id: string;
    isLoading: boolean;
  }>({ 
    name: defaultLocation.name, 
    id: defaultLocation.id,
    isLoading: false // Start with server data ready
  });
  
  // Update location when client-side location is detected - off the main thread
  useEffect(() => {
    // Don't block main thread with location processing
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        processLocation();
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(processLocation, 200);
    }
    
    function processLocation() {
      // If there's a client-side detected location, use it
      if (clientLocation) {
        // Avoid console logs in production
        if (process.env.NODE_ENV !== 'production') {
          console.log('Location detected:', clientLocation);
        }
        
        // Format location name and ID properly
        let locationName = clientLocation;
        try {
          locationName = decodeURIComponent(clientLocation);
        } catch (e) {
          // Only log errors in development
          if (process.env.NODE_ENV !== 'production') {
            console.error('Error decoding location:', e);
          }
        }
        
        // Create location ID for testimonials
        const locationId = convertToLocationSlug(clientLocation);
        
        setCombinedLocation({
          name: locationName,
          id: locationId,
          isLoading: false
        });
      } else if (!isLocating) {
        // Use the server default if not detecting or no client location
        setCombinedLocation({
          name: defaultLocation.name,
          id: defaultLocation.id,
          isLoading: false
        });
      }
    }
  }, [clientLocation, isLocating, defaultLocation]);

  // No weather data needed

  return (
    <PageLayout>
      {/* Hero section - critical for LCP, highest priority with minimal deferring */}
      <OptimizedClientWrapper priority="critical" defer={false} id="hero-section">
        <Suspense fallback={<div className="h-[600px] bg-navy/50 animate-pulse rounded-md" />}>
          <HeroSection 
            location={combinedLocation.name} 
            isLoading={combinedLocation.isLoading}
          />
        </Suspense>
      </OptimizedClientWrapper>
      
      {/* Services preview - high priority, deferred until almost in viewport */}
      <OptimizedClientWrapper priority="high" id="services-preview">
        <Suspense fallback={<div className="h-80 bg-navy/50 animate-pulse rounded-md" />}>
          <ServicesPreview location={combinedLocation.name} />
        </Suspense>
      </OptimizedClientWrapper>
      
      {/* Testimonials section - medium priority, deferred until in viewport */}
      <OptimizedClientWrapper priority="medium" id="testimonials-section">
        <Suspense fallback={<div className="h-60 bg-navy/50 animate-pulse rounded-md" />}>
          <TestimonialsSection location={combinedLocation.id} />
        </Suspense>
      </OptimizedClientWrapper>
      
      {/* Why Choose Us section - medium priority */}
      <OptimizedClientWrapper priority="medium" id="why-choose-us">
        <Suspense fallback={<div className="h-80 bg-navy/50 animate-pulse rounded-md" />}>
          <WhyChooseUs />
        </Suspense>
      </OptimizedClientWrapper>
      
      {/* Image Gallery - medium priority */}
      <OptimizedClientWrapper priority="medium" id="image-gallery">
        <ImageGallery />
      </OptimizedClientWrapper>

      {/* Partner logos - low priority, load last */}
      <OptimizedClientWrapper priority="low" id="partner-logos">
        <Suspense fallback={<div className="h-40 bg-navy/50 animate-pulse rounded-md" />}>
          <PartnerLogos 
            title="Brands We Work With" 
            subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" 
          />
        </Suspense>
      </OptimizedClientWrapper>
      
      {/* CTA section - medium priority */}
      <OptimizedClientWrapper priority="medium" id="cta-section">
        <Suspense fallback={<div className="h-60 bg-navy/50 animate-pulse rounded-md" />}>
          <CTASection location={combinedLocation.name} />
        </Suspense>
      </OptimizedClientWrapper>
    </PageLayout>
  );
}

// Use memo to optimize both components
const MemoizedHomeContent = memo(HomeContent);

// Simple wrapper that just passes props to the memoized component
export default function ClientHomeContent({ defaultLocation }: HomeContentProps) {
  return <MemoizedHomeContent defaultLocation={defaultLocation} />;
}