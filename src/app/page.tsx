// Page is a Server Component by default in Next.js App Router
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import { defaultLocation } from '@/utils/locationUtils';

// Import client components (only used for interactive parts)
import ClientLocationWrapper from '@/components/client/ClientLocationWrapper';
import ClientTestimonials from '@/components/client/ClientTestimonials';
import ClientCTASection from '@/components/client/ClientCTASection';

// Import static sections that don't need client interactivity
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import PartnerLogosSection from '@/components/PartnerLogosSection';
import ContactSection from '@/components/ContactSection';

// Mark as dynamic to handle location changes
export const dynamic = 'force-dynamic';

/**
 * Metadata for the home page
 */
export const metadata: Metadata = {
  title: 'ProTech HVAC | Professional Heating & Cooling Services',
  description: 'ProTech HVAC provides expert heating, cooling, and air quality services throughout Northeast Ohio. Schedule service, request a quote, or learn about our services.',
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Ohio', 'Northeast Ohio'],
};

/**
 * Home page - Server Component
 * Follows the React Server Components pattern for optimal TBT performance on mobile
 * 
 * This component renders most content on the server to reduce client-side JavaScript
 * Only wraps interactive elements in client components
 */
export default function HomePage() {
  // Server-side processing with minimal client JS
  const defaultLocationName = 'Northeast Ohio';
  
  return (
    <PageLayout>
      {/* Server Component - rendered on the server with no client JS */}
      <HeroSection location={defaultLocationName} />
      
      {/* Client Component Wrapper - only for location detection */}
      <ClientLocationWrapper defaultLocation={defaultLocationName} />
      
      {/* Server Component - static content, no client JS */}
      <ServicesPreview location={defaultLocationName} />
      
      {/* Server Component - static content */}
      <WhyChooseUsSection />
      
      {/* Client Component - for testimonial interactivity */}
      <ClientTestimonials location={defaultLocationName} />
      
      {/* Server Component - static content */}
      <PartnerLogosSection 
        title="Brands We Work With" 
        subtitle="We partner with industry-leading HVAC manufacturers to provide the best solutions" 
      />
      
      {/* Client Component - for call-to-action interactivity */}
      <ClientCTASection location={defaultLocationName} />
      
      {/* Server Component - static content */}
      <ContactSection location={defaultLocationName} />
    </PageLayout>
  );
}