// Server Component (no 'use client' directive)
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import { convertToLocationSlug } from '@/utils/location';
import { ServiceLocation } from '@/utils/locationUtils';
import ServicesPreviewClient from './client/ServicesPreviewClient';

// Service types that are shared with the client component
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

// Service data - defined as a const to be shared with the client component
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential',
    description: 'HVAC solutions for homes and residential properties',
    services: [
      {
        id: 'heating',
        name: 'Heating',
        description: 'Keep your home warm and comfortable all winter',
        icon: '🔥',
        features: ['Furnace Repair', 'Heating Installation', 'Heat Pumps', 'Radiant Heating']
      },
      {
        id: 'cooling',
        name: 'Cooling',
        description: 'AC solutions to keep your home comfortable all summer long',
        icon: '❄️',
        features: ['AC Repair', 'New Installation', 'Ductless Mini-Splits', 'Seasonal Tune-ups']
      },
      {
        id: 'air-quality',
        name: 'Indoor Air Quality',
        description: 'Solutions for healthier, cleaner air in your living spaces',
        icon: '💨',
        features: ['Air Purifiers', 'Humidifiers', 'Air Duct Cleaning', 'Ventilation Systems']
      },
      {
        id: 'maintenance',
        name: 'Maintenance Plans',
        description: 'Preventative care to extend the life of your HVAC systems',
        icon: '🔧',
        features: ['Seasonal Tune-ups', 'Filter Replacements', 'Priority Service', 'Discounted Repairs']
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'HVAC solutions for businesses and commercial properties',
    services: [
      {
        id: 'commercial-hvac',
        name: 'Commercial HVAC',
        description: 'Complete heating and cooling solutions for offices and businesses',
        icon: '🏢',
        features: ['Rooftop Units', 'Commercial Repairs', 'System Design', 'Equipment Replacement']
      },
      {
        id: 'refrigeration',
        name: 'Refrigeration',
        description: 'Commercial refrigeration solutions for restaurants and retail',
        icon: '❄️',
        features: ['Freezer Repair', 'Walk-in Coolers', 'Display Cases', 'Emergency Service']
      },
      {
        id: 'industrial',
        name: 'Industrial Systems',
        description: 'Heavy-duty solutions for manufacturing and industrial environments',
        icon: '🏭',
        features: ['Boilers', 'Chillers', 'Exhaust Systems', 'Process Cooling']
      },
      {
        id: 'service-contracts',
        name: 'Service Contracts',
        description: 'Ongoing maintenance plans for commercial properties',
        icon: '📋',
        features: ['Scheduled Maintenance', 'Equipment Monitoring', '24/7 Support', 'Guaranteed Response']
      }
    ]
  }
];

// Props type that accepts both string and ServiceLocation object
interface ServicesPreviewProps {
  location?: string | ServiceLocation;
}

/**
 * ServicesPreview Component - Server Component
 * Following Next.js App Router pattern to optimize mobile TBT
 * All static and data preparation is done on the server
 * All interactive elements are isolated in the client component
 * 
 * @param location - Optional location string or object to override detected location
 */
export default function ServicesPreview({ location }: ServicesPreviewProps) {
  // Prepare initial server-side data
  let initialLocationName = 'Northeast Ohio'; // Default fallback
  
  // Process location prop on the server - handle both string and object types
  if (location) {
    if (typeof location === 'string' && location.trim() !== '') {
      initialLocationName = location;
    } else if (typeof location === 'object' && location.name) {
      initialLocationName = location.name;
    }
  }
  
  // Format display location on the server - handle URL encoding
  let displayLocation;
  try {
    displayLocation = decodeURIComponent(initialLocationName);
  } catch (e) {
    displayLocation = initialLocationName;
  }
  
  // Create location slug for URLs on the server
  const locationSlug = convertToLocationSlug(initialLocationName);
  
  // Initial category and services - processed on server
  const initialCategory = serviceCategories[0].id;
  const initialServices = serviceCategories[0].services;

  // Return server-rendered static content with client component for interactivity
  // This pattern keeps the JavaScript bundle for the client minimal
  return (
    <Section backgroundColor="navy" paddingY="lg">
      <Container>
        {/* Heading is rendered on the server */}
        <SectionHeading
          title="Our Services"
          subtitle={`Expert HVAC solutions in ${displayLocation}`}
          centered={true}
          className="text-white"
        />
        
        {/* Client component handles all interactive elements */}
        <ServicesPreviewClient
          serviceCategories={serviceCategories}
          initialCategory={initialCategory} 
          initialServices={initialServices}
          locationSlug={locationSlug}
          displayLocation={displayLocation}
          locationProp={location}
        />
      </Container>
    </Section>
  );
}
