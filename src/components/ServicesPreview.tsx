'use client';

import React, { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import IconFeature from './ui/IconFeature';
import { convertToLocationSlug } from '@/utils/location';
import useLocationDetection from '@/hooks/useLocationDetection';
import { ServiceLocation } from '@/utils/locationUtils';

// Service types and data
interface Service {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon: string;
  features?: string[];
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

// Sample service data that would typically come from a CMS or API
const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential',
    description: 'HVAC solutions for homes and residential properties',
    services: [
      {
        id: 'heating',
        name: 'Heating Services',
        description: 'Furnace installation, repair, and maintenance for your home comfort',
        icon: '🔥',
        features: ['Furnace Repair', 'Heating Installation', 'Heat Pump Services', 'Maintenance Plans']
      },
      {
        id: 'cooling',
        name: 'Cooling Services',
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
 * Component that displays a preview of services categorized by type
 * Allows users to filter by category and view details for each service
 */
function ServicesPreview({ location }: ServicesPreviewProps) {
  const [activeCategory, setActiveCategory] = useState('residential');
  
  // Use our client-side location detection as a backup/supplement to the server-provided location
  const { userLocation: detectedLocation, isLocating } = useLocationDetection();
  
  // Generate location slug for URLs and get active category services - combined in one useMemo
  // Optimize by computing multiple values in a single useMemo to reduce TBT
  const { displayLocation, locationSlug, activeServices } = useMemo(() => {
    // Determine which location to use - prefer prop-passed location over client-side detection
    let effectiveLocation = '';
    
    if (location) {
      // Handle both string and object types for location
      if (typeof location === 'string' && location.trim() !== '') {
        effectiveLocation = location;
      } else if (typeof location === 'object' && location.name) {
        effectiveLocation = location.name;
      }
    } else if (detectedLocation && detectedLocation.trim() !== '') {
      effectiveLocation = detectedLocation;
    } else {
      effectiveLocation = 'Northeast Ohio'; // Default fallback
    }
    
    // Create location slug for URLs
    const slug = convertToLocationSlug(effectiveLocation);
    
    // Get services for active category
    const currentCategory = serviceCategories.find(cat => cat.id === activeCategory);
    const services = currentCategory?.services || [];
    
    // Format display location - handle URL encoding
    let displayName;
    try {
      displayName = decodeURIComponent(effectiveLocation);
    } catch (e) {
      displayName = effectiveLocation;
    }
    
    return {
      displayLocation: displayName,
      locationSlug: slug,
      activeServices: services
    };
  }, [location, detectedLocation, activeCategory]);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <Section className="py-12 sm:py-16 md:py-24 bg-navy-light">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle={`Expert HVAC solutions in ${displayLocation}`}
          centered={true}
          className="text-white"
        />
        
        <CategoryTabs
          categories={serviceCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <ServiceGrid
          services={activeServices}
          categoryId={activeCategory}
          locationSlug={locationSlug}
          isLoading={isLocating}
        />
        
        <div className="mt-8 text-center">
          <Link
            href={`/services?type=${activeCategory}&location=${locationSlug}`}
            className="inline-block bg-red hover:bg-red-dark text-white font-medium rounded-lg px-6 py-3 transition-colors"
          >
            View All {activeCategory === 'residential' ? 'Home' : 'Business'} Services
          </Link>
        </div>
      </Container>
    </Section>
  );
}

interface CategoryTabsProps {
  categories: ServiceCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Memoize the CategoryTabs component to prevent unnecessary re-renders
const CategoryTabs = memo(function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="mb-6 sm:mb-8 px-4 sm:px-0">
      <div 
        className="flex justify-center rounded-full bg-navy p-1 sm:p-1.5 w-full max-w-xs sm:max-w-md mx-auto"
        role="tablist"
        aria-label="Service Categories"
      >
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-red text-white shadow-md' 
                : 'text-ivory hover:text-white'
            }`}
            role="tab"
            aria-selected={activeCategory === category.id}
            aria-controls={`${category.id}-panel`}
            id={`${category.id}-tab`}>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
});

interface ServiceGridProps {
  services: Service[];
  categoryId: string;
  locationSlug: string;
  isLoading?: boolean;
}

// Memoize the ServiceGrid component for better performance
const ServiceGrid = memo(function ServiceGrid({ services, categoryId, locationSlug, isLoading }: ServiceGridProps) {
  // Loading state when location is being detected
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-navy rounded-xl p-6 animate-pulse h-52 flex flex-col">
            <div className="w-10 h-10 rounded-full bg-white/30 mb-3"></div>
            <div className="h-4 w-24 bg-white/30 rounded mb-3"></div>
            <div className="h-3 w-full bg-white/20 rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Display the service grid with IconFeature components
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8" 
      id={`${categoryId}-panel`}
      role="tabpanel"
      aria-labelledby={`${categoryId}-tab`}
    >
      {services.map((service) => (
        <IconFeature
          key={service.id}
          icon={<span className="text-2xl">{service.icon}</span>}
          title={service.name}
          description={service.description}
          href={`/services/${categoryId}/${service.id}/${locationSlug}`}
          interactive
        />
      ))}
    </div>
  );
});

// Export the component wrapped in memo to prevent unnecessary re-renders
export default memo(ServicesPreview);
