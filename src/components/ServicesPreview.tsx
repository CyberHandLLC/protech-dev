'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import IconFeature from './ui/IconFeature';
import { convertToLocationSlug } from '@/utils/location';
import useLocationDetection from '@/hooks/useLocationDetection';

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
  /** Location name to display and use in service URLs */
  location: string;
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
 * Component that displays a preview of services categorized by type
 * Allows users to filter by category and view details for each service
 */
export default function ServicesPreview({ location }: ServicesPreviewProps) {
  const [activeCategory, setActiveCategory] = useState('residential');
  
  // Use our client-side location detection as a backup/supplement to the server-provided location
  const { userLocation: detectedLocation, isLocating } = useLocationDetection();
  
  // Generate location slug for URLs and get active category services - combined in one useMemo
  const { locationSlug, activeServices, displayLocation } = useMemo(() => {
    // Get services for active category
    const services = serviceCategories.find(cat => cat.id === activeCategory)?.services || [];
    
    // Create location slug from either provided location or detected location
    let locationToUse = location || detectedLocation || 'Northeast Ohio';
    
    // Make sure to decode any URL-encoded characters for display
    let decodedLocation;
    try {
      decodedLocation = decodeURIComponent(locationToUse);
    } catch (e) {
      decodedLocation = locationToUse;
    }
    
    // Create location slug for URLs
    const slug = convertToLocationSlug(locationToUse);
    
    return { 
      locationSlug: slug, 
      activeServices: services,
      displayLocation: decodedLocation
    };
  }, [location, detectedLocation, activeCategory]);

  return (
    <Section className="bg-navy text-white">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle={`Professional HVAC solutions for your home and business in ${displayLocation}.`}
          centered
        />
        
        {/* Service Category Tabs */}
        <CategoryTabs 
          categories={serviceCategories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        {/* Services Grid */}
        <ServiceGrid 
          services={activeServices} 
          categoryId={activeCategory} 
          locationSlug={locationSlug} 
          isLoading={isLocating}
        />
        
        {/* All Services Button */}
        <div className="text-center">
          <Link 
            href="/services" 
            className="inline-block px-8 py-3 mt-8 bg-red text-white rounded-lg hover:bg-red-dark transition-colors shadow-lg">
            View All Services
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Category tabs component for filtering services
 */
interface CategoryTabsProps {
  categories: ServiceCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="flex justify-center border-b-2 border-dark-blue-light/50 mb-6 md:mb-8 overflow-x-auto pb-1 hide-scrollbar" role="tablist">
        {categories.map((category) => (
          <button
            key={category.id}
            id={`${category.id}-tab`}
            role="tab"
            aria-controls={`${category.id}-panel`}
            aria-selected={activeCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 sm:px-6 py-2 md:py-3 text-base md:text-lg font-medium transition-colors focus:outline-none whitespace-nowrap
              ${activeCategory === category.id ? 'text-white border-b-2 border-red -mb-0.5' : 'text-white/60 hover:text-white/80'}`}
            type="button"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Service grid component displaying service cards
 */
interface ServiceGridProps {
  services: Service[];
  categoryId: string;
  locationSlug: string;
  isLoading?: boolean;
}

function ServiceGrid({ services, categoryId, locationSlug, isLoading }: ServiceGridProps) {
  // Loading state when location is being detected
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12"
        role="tabpanel" 
        id={`${categoryId}-panel`}
        aria-labelledby={`${categoryId}-tab`}
      >
        {/* Show loading skeleton when detecting location */}
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-dark-blue h-64 rounded-xl animate-pulse border border-dark-blue-light/30"></div>
        ))}
      </div>
    );
  }
  
  // Use our reusable IconFeature component for consistent design
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12"
      role="tabpanel" 
      id={`${categoryId}-panel`}
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
}

/**
 * Individual service card component
 */
interface ServiceCardProps {
  service: Service;
  href: string;
}

function ServiceCard({ service, href }: ServiceCardProps) {
  return (
    <Link 
      href={href}
      className="group block h-full"
      aria-labelledby={`service-${service.id}`}
    >
      <div className="bg-gradient-to-br from-dark-blue to-navy h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl group-hover:transform group-hover:-translate-y-2 border border-dark-blue-light/30 relative">
        {/* Diagonal accent ribbon */}
        <div className="absolute -right-12 top-6 bg-red shadow-lg transform rotate-45 w-40 h-5 z-10"></div>
        
        <div className="p-7 flex flex-col h-full">
          {/* Icon in a styled circle with shadow */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-light to-dark-blue-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-red/20">
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">{service.icon}</span>
          </div>
          
          <h3 
            id={`service-${service.id}`}
            className="font-bold text-xl mb-3 text-white group-hover:text-red transition-colors duration-300"
          >
            {service.name}
          </h3>
          
          <p className="text-ivory/70 mb-auto min-h-[3.5em] text-sm md:text-base">{service.description}</p>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-blue-light/50">
            <span className="inline-flex items-center text-red-light font-medium text-sm md:text-base group-hover:font-semibold transition-all">
              <span className="mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
              View Details
            </span>
            
            <svg 
              className="w-4 h-4 text-red transform group-hover:translate-x-1 transition-transform duration-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}