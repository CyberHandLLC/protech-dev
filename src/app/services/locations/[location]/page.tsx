import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocationById } from '@/utils/locationUtils';
import { generateLocationMetadata } from '@/utils/metadata';
import { generateCanonicalUrl } from '@/utils/canonical';
import { serviceCategories } from '@/data/serviceDataNew';

// Import the client wrapper component for SEO
import ServicesPageClientWrapper from '../../../../components/services/ServicesPageClientWrapper';

interface LocationPageProps {
  params: {
    location: string;
  };
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location } = params;
  
  // Format location name from slug
  const locationName = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
  
  // Generate canonical URL for this location
  const canonicalPath = `/services/locations/${location}`;
  
  // Generate location-specific metadata
  return generateLocationMetadata(location, locationName, {
    canonical: generateCanonicalUrl(canonicalPath)
  });
}

export default function LocationServicesPage({ params }: LocationPageProps) {
  const { location } = params;
  
  // Verify that the location exists in our service areas
  const locationInfo = getLocationById(location);
  if (!locationInfo) return notFound();
  
  // Format location name from slug
  const locationName = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
  
  // Location-specific FAQs for Schema.org markup
  const locationFAQs = [
    {
      question: `What HVAC services does ProTech offer in ${locationName}?`,
      answer: `ProTech HVAC offers a full range of heating, cooling, and air quality services in ${locationName}, including AC repair, furnace maintenance, system installations, and emergency HVAC services. Our certified technicians serve both residential and commercial customers throughout ${locationName} and surrounding areas.`
    },
    {
      question: `How quickly can ProTech respond to emergency HVAC calls in ${locationName}?`,
      answer: `We provide 24/7 emergency HVAC service in ${locationName} with typical response times of 1-2 hours. Our technicians live throughout Northeast Ohio, ensuring we can reach ${locationName} customers quickly when heating or cooling emergencies occur.`
    },
    {
      question: `Does ProTech provide seasonal maintenance plans for ${locationName} customers?`,
      answer: `Yes, we offer comprehensive seasonal maintenance plans specifically for ${locationName} residents. Our maintenance plans include bi-annual system inspections, priority service, and discounted repairs to keep your HVAC system running efficiently year-round.`
    }
  ];
  
  // Format county name if available
  const countyName = locationInfo.county ? `${locationInfo.county} County` : 'Northeast Ohio';

  return (
    <PageLayout>
      <ServicesPageClientWrapper
        faqs={locationFAQs}
        title={`HVAC Services in ${locationName}`}
        subtitle={`ProTech HVAC provides professional heating and cooling services throughout ${locationName}`}
        mainEntity={`HVAC Services in ${locationName}`}
      >
        <div className="bg-navy">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              accentText="ProTech HVAC"
              title={`Professional HVAC Services in ${locationName}`}
              subtitle={`Trusted heating and cooling solutions for ${locationName} residents and businesses`}
              size="lg"
              centered
            />
          </div>
        </div>
        
        {/* Location-specific content */}
        <div className="bg-navy-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-navy rounded-xl p-8 shadow-lg border border-navy-light">
              <h2 className="text-2xl font-bold text-white mb-4">
                Serving {locationName} and All of {countyName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-red mb-4">
                    Residential HVAC Services
                  </h3>
                  
                  <ul className="space-y-3 text-ivory">
                    {serviceCategories
                      .find(cat => cat.id === 'residential')?.systems
                      .slice(0, 5)
                      .map(system => (
                        <li key={system.id} className="flex items-center">
                          <span className="text-red mr-2">✓</span>
                          <span>{system.name}</span>
                        </li>
                      ))}
                    <li className="flex items-center">
                      <span className="text-red mr-2">✓</span>
                      <span>24/7 Emergency Services</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-red mb-4">
                    Commercial HVAC Solutions
                  </h3>
                  
                  <ul className="space-y-3 text-ivory">
                    {serviceCategories
                      .find(cat => cat.id === 'commercial')?.systems
                      .slice(0, 5)
                      .map(system => (
                        <li key={system.id} className="flex items-center">
                          <span className="text-red mr-2">✓</span>
                          <span>{system.name}</span>
                        </li>
                      ))}
                    <li className="flex items-center">
                      <span className="text-red mr-2">✓</span>
                      <span>Preventative Maintenance Plans</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="text-ivory">
                  ProTech HVAC has been proudly serving {locationName} since 2018, providing reliable heating, cooling, and air quality solutions to local homeowners and businesses. Our team of certified technicians is familiar with the unique HVAC challenges faced by {locationName} residents throughout Northeast Ohio's changing seasons.
                </p>
                
                <div className="mt-8 flex justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red hover:bg-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red transition-colors"
                  >
                    Schedule Service in {locationName}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CTASection location={locationName} />
      </ServicesPageClientWrapper>
    </PageLayout>
  );
}
