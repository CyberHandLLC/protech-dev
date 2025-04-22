'use client';

import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import { ServiceLocation } from '@/utils/locationUtils';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import CTASection from '@/components/CTASection';
import PartnerLogos from '@/components/PartnerLogos';

type HomeContentProps = { defaultLocation: ServiceLocation };

function HomeContent({ defaultLocation }: HomeContentProps) {
  const { nearestServiceLocation, isLoading } = useLocation();
  const location = nearestServiceLocation || defaultLocation;

  return (
    <PageLayout>
      <HeroSection location={location.name} isLoading={isLoading} />
      <ServicesPreview location={location.name} />
      <TestimonialsSection location={location.id} />
      <WhyChooseUs />
      <PartnerLogos title="Brands We Work With" subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" />
      <CTASection location={location.name} />
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