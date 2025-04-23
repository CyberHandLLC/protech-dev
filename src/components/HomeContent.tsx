'use client';

/**
 * Optimized home page content component
 * Uses server components for most content with selective client hydration
 */
import { ServiceLocation } from '@/utils/locationUtils';
import PageLayout from './PageLayout';

// Dynamic imports with server components for code splitting
import dynamic from 'next/dynamic';

// Import server components using dynamic imports
// This ensures proper client/server boundary management
const HeroSectionServer = dynamic(() => import('./HeroSectionServer'));
const ServicesPreviewServer = dynamic(() => import('./ServicesPreviewServer'));
const TestimonialsSectionServer = dynamic(() => import('./TestimonialsSectionServer'));
const WhyChooseUsServer = dynamic(() => import('./WhyChooseUsServer'));
const PartnerLogosServer = dynamic(() => import('./PartnerLogosServer'));
const CTASectionServer = dynamic(() => import('./CTASectionServer'));

// Define props for the component
interface HomeContentProps {
  /** Location data from server-side detection */
  location: ServiceLocation;
  /** Weather data from server-side fetch (optional) */
  weatherData?: {
    temperature: number;
    icon: string;
  };
}

/**
 * Main home content component
 * Renders the full homepage using optimized server components
 */
export default function HomeContent({ 
  location,
  weatherData = { temperature: 75, icon: '⛅' }
}: HomeContentProps) {
  // Location is already processed on the server, so it's ready to use
  return (
    <PageLayout>
      {/* All content is server-rendered with no client-side JS */}
      <HeroSectionServer 
        location={location.name} 
        temperature={weatherData.temperature}
        weatherIcon={weatherData.icon}
      />
      <ServicesPreviewServer location={location.name} />
      <TestimonialsSectionServer location={location.id} />
      <WhyChooseUsServer />
      <PartnerLogosServer title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      <CTASectionServer location={location.name} />
    </PageLayout>
  );
}
