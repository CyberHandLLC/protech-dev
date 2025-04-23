/**
 * Server Component version of ServicesPreview
 * This eliminates all client-side JS and renders entirely on the server
 */
import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import IconFeature from './ui/IconFeature';
import { convertToLocationSlug } from '@/utils/location';

/**
 * Service data interface
 */
interface Service {
  /** Unique identifier for the service */
  id: string;
  /** Display name of the service */
  name: string;
  /** Emoji icon representing the service */
  icon: string;
  /** Brief description of the service */
  description: string;
}

/**
 * Service category interface
 */
interface ServiceCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** List of services in this category */
  services: Service[];
}

/**
 * Props for the ServicesPreview component
 */
interface ServicesPreviewProps {
  /** Location name to display in services */
  location: string;
  /** Initial category to display (defaults to residential) */
  initialCategory?: string;
}

/**
 * Service categories with their respective services
 */
const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential HVAC',
    services: [
      { id: 'ac-installation', name: 'New Installations', icon: '🏡', description: 'Complete home comfort systems' },
      { id: 'heating', name: 'Heating Systems', icon: '🔥', description: 'Furnaces, boilers & heat pumps' },
      { id: 'air-conditioning', name: 'Air Conditioning', icon: '❄️', description: 'Central AC & mini-split systems' },
      { id: 'air-quality', name: 'Indoor Air Quality', icon: '🌬️', description: 'Purifiers & humidity control' },
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial HVAC',
    services: [
      { id: 'commercial-installation', name: 'Commercial Systems', icon: '🏢', description: 'Custom solutions for any business' },
      { id: 'emergency', name: 'Emergency Service', icon: '🚨', description: '24/7 response to critical failures' },
      { id: 'refrigeration', name: 'Refrigeration', icon: '🧊', description: 'Restaurant & retail cooling systems' },
      { id: 'maintenance-plan', name: 'Maintenance Plans', icon: '📆', description: 'Scheduled service & priority care' },
    ]
  }
];

/**
 * Server Component that displays a preview of services categorized by type
 * Pre-renders both tabs of content with initial category visible
 */
export default function ServicesPreviewServer({ location, initialCategory = 'residential' }: ServicesPreviewProps) {
  // Convert the location to a slug for URLs
  const locationSlug = convertToLocationSlug(location);
  const displayLocation = location;
  
  return (
    <Section className="py-16 sm:py-20 bg-gradient-to-b from-dark-blue/20 to-navy/5">
      <Container>
        <SectionHeading
          title={`HVAC Services in ${displayLocation}`}
          subtitle="Professional heating, cooling, and air quality solutions"
          className="mb-12 sm:mb-16"
        />
        
        <div className="relative">
          {/* Server-rendered tabs (no client interaction) */}
          <div className="flex flex-wrap border-b border-dark-blue-light/30 mb-8">
            {serviceCategories.map(category => (
              <Link
                key={category.id}
                href={`/services?category=${category.id}&location=${locationSlug}`}
                className={`
                  px-5 py-3 font-semibold text-sm sm:text-base relative 
                  ${category.id === initialCategory ? 
                    'text-red border-b-2 border-red -mb-px' : 
                    'text-ivory/70 hover:text-white'
                  }
                `}
                aria-selected={category.id === initialCategory}
                id={`${category.id}-tab`}
                aria-controls={`${category.id}-panel`}
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          {/* Pre-render all service panels (only the active one will be visible) */}
          {serviceCategories.map(category => (
            <div
              key={category.id}
              className={`
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 px-4 sm:px-0
                ${category.id === initialCategory ? 'block' : 'hidden'}
              `}
              id={`${category.id}-panel`}
              aria-labelledby={`${category.id}-tab`}
            >
              {category.services.map((service) => (
                <IconFeature
                  key={service.id}
                  icon={<span className="text-2xl">{service.icon}</span>}
                  title={service.name}
                  description={service.description}
                  href={`/services/${category.id}/${service.id}/${locationSlug}`}
                  interactive
                />
              ))}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href={`/services?location=${locationSlug}`}
            className="inline-flex items-center text-red hover:text-red-light font-semibold"
          >
            <span>View all services</span>
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
