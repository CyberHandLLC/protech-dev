import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import ServicesListMobile from '@/components/services/ServicesListMobile';
import SectionHeading from '@/components/ui/SectionHeading';
import { serviceCategories } from '@/data/serviceDataNew';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import { generateCanonicalUrl } from '@/utils/canonical';
import ServicesPageClientWrapper from '../../components/services/ServicesPageClientWrapper';
import ServiceAreaLinks from '@/components/services/ServiceAreaLinks';

export const metadata: Metadata = {
  title: 'ProTech HVAC Services | Residential & Commercial HVAC Solutions',
  description: 'Explore our comprehensive HVAC services including AC repair, heating services, air quality solutions, and commercial HVAC services throughout Northeast Ohio.',
  keywords: ['HVAC services', 'AC repair', 'heating services', 'commercial HVAC', 'air quality'],
  alternates: {
    canonical: generateCanonicalUrl('/services'),
  },
  openGraph: {
    title: 'ProTech HVAC Services | Residential & Commercial HVAC Solutions',
    description: 'Explore our comprehensive HVAC services including AC repair, heating services, air quality solutions, and commercial HVAC services throughout Northeast Ohio.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ProTech Heating & Cooling | HVAC Services',
    images: [{
      url: '/images/services-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'ProTech HVAC Services',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProTech HVAC Services | Residential & Commercial HVAC Solutions',
    description: 'Explore our comprehensive HVAC services including AC repair, heating services, air quality solutions, and commercial HVAC services throughout Northeast Ohio.',
    images: ['/images/services-og-image.jpg'],
  },
};

interface ServicesPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  // Await searchParams in Next.js 15
  const resolvedSearchParams = await searchParams;
  const categoryFilter = resolvedSearchParams?.category || 'residential';
  
  // Filter categories once and reuse the result
  const currentCategory = serviceCategories.find(cat => cat.id === categoryFilter) || serviceCategories[0];
    
  // Get user's location from server headers for location-based service content
  const userLocation = await getUserLocationFromHeaders();
  
  // Common FAQs about HVAC services for the FAQ schema
  const serviceFAQs = [
    {
      question: "What types of HVAC services does ProTech offer?",
      answer: "ProTech HVAC offers a comprehensive range of services including air conditioning repair and installation, heating system maintenance, commercial HVAC solutions, indoor air quality improvements, and emergency HVAC services for both residential and commercial clients."
    },
    {
      question: "How often should I schedule HVAC maintenance?",
      answer: "We recommend scheduling professional HVAC maintenance twice a year—once in spring for your cooling system and once in fall for your heating system. Regular maintenance helps prevent breakdowns, extends system lifespan, and maintains energy efficiency."
    },
    {
      question: "Do you offer emergency HVAC services?",
      answer: "Yes, ProTech HVAC provides 24/7 emergency services throughout Northeast Ohio. Our technicians are available around the clock to handle urgent heating and cooling issues to ensure your comfort and safety."
    },
    {
      question: "How long does a typical HVAC installation take?",
      answer: "Most residential HVAC installations can be completed within 1-2 days, while commercial installations may take 2-5 days depending on the system size and complexity. We'll provide you with a specific timeline during your consultation."
    },
    {
      question: "What makes ProTech different from other HVAC companies?",
      answer: "ProTech HVAC stands out through our certified technicians, transparent pricing, comprehensive service offerings, and our satisfaction guarantee. We prioritize customer education and long-term system performance over quick fixes."
    }
  ];
  
  return (
    <PageLayout>
      <ServicesPageClientWrapper
        faqs={serviceFAQs}
        title="Frequently Asked Questions About HVAC Services"
        subtitle="Get answers to common questions about our heating and cooling services."
        mainEntity="HVAC Services"
        showVisibleFAQs={false} // Don't show visible FAQs on the main services page
      >
        <main>
          {/* Hero section with dark navy background */}
          <section className="bg-navy py-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <SectionHeading
                accentText="Professional HVAC"
                title={categoryFilter === 'residential' ? 'Residential HVAC Services' : 
                       categoryFilter === 'commercial' ? 'Commercial HVAC Services' : 
                       'Our Services'}
                subtitle={currentCategory?.description || 
                         'Comprehensive heating and cooling solutions tailored to your needs. Our experienced technicians provide expert service throughout Northeast Ohio.'}
                size="lg"
                centered
              />
            </div>
          </section>
          
          {/* Service category tabs */}
          <div className="bg-dark-blue border-t border-b border-dark-blue-light sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex overflow-x-auto py-3 scrollbar-hide">
                {serviceCategories.map(category => (
                  <a 
                    key={category.id}
                    href={`/services?category=${category.id}`}
                    className={`whitespace-nowrap px-4 py-2 mr-4 rounded-lg transition-colors ${categoryFilter === category.id ? 'bg-red text-white' : 'text-ivory hover:text-white'}`}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-navy-light py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<div className="py-20 text-center text-white">Loading services...</div>}>
                <ServicesListMobile
                  category={currentCategory}
                  userLocation={userLocation}
                />
              </Suspense>
            </div>
          </div>
          
          {/* CRITICAL SEO FIX: Location hub links for discovery */}
          <ServiceAreaLinks />
        </main>
        
        <CTASection location={userLocation.name} />
      </ServicesPageClientWrapper>
    </PageLayout>
  );
}