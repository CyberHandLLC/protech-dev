import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import ServicesList from '@/components/services/ServicesList';
import SectionHeading from '@/components/ui/SectionHeading';
import { serviceCategories } from '@/data/serviceData';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';

export const metadata: Metadata = {
  title: 'ProTech HVAC Services | Residential & Commercial HVAC Solutions',
  description: 'Explore our comprehensive HVAC services including AC repair, heating services, air quality solutions, and commercial HVAC services throughout Northeast Ohio.',
  keywords: ['HVAC services', 'AC repair', 'heating services', 'commercial HVAC', 'air quality'],
};

interface ServicesPageProps {
  searchParams?: {
    category?: string;
  };
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  // Using URLSearchParams is the recommended Next.js approach for query params
  const categoryFilter = searchParams?.category || 'residential';
  
  // Filter categories once and reuse the result
  const currentCategory = serviceCategories.find(cat => cat.id === categoryFilter) || serviceCategories[0];
  const filteredCategories = categoryFilter === 'all' 
    ? serviceCategories 
    : [currentCategory];
    
  // Get user's location from server headers for location-based service content
  const userLocation = getUserLocationFromHeaders();
  
  return (
    <PageLayout>
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
            <Suspense fallback={<div className="py-20 text-center text-ivory/70">Loading services...</div>}>
              {filteredCategories.map((category) => (
                <ServicesList
                  key={category.id}
                  category={category}
                  userLocation={userLocation}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </main>
      
      <CTASection location={userLocation.name} />
    </PageLayout>
  );
}