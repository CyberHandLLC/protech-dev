'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatLocationId } from '../utils/locationUtils';

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
  
  // Generate location slug for URLs and get active category services - combined in one useMemo
  const { locationSlug, activeServices } = useMemo(() => {
    // Get services for active category
    const services = serviceCategories.find(cat => cat.id === activeCategory)?.services || [];
    
    // Create location slug
    let slug;
    try {
      slug = formatLocationId(location.split(',')[0].trim(), 'oh');
    } catch (e) {
      slug = location.toLowerCase().replace(/\s+/g, '-').replace(',', '-');
    }
    
    return { locationSlug: slug, activeServices: services };
  }, [location, activeCategory]);

  return (
    <section className="py-20 px-4 md:px-8 bg-navy text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-ivory/80 max-w-3xl mx-auto">
            Professional HVAC solutions for your home and business in {location}. 
            Our certified technicians provide expert service for all your heating and cooling needs.
          </p>
        </div>
        
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
        />
        
        {/* All Services Button */}
        <div className="text-center">
          <Link 
            href="/services" 
            className="inline-flex items-center px-6 py-3 bg-red text-white rounded-lg font-medium hover:bg-red-dark transition-colors"
            aria-label="View all our HVAC services"
          >
            View All Services
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
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
    <div className="mb-8">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" 
        role="tablist"
        aria-label="Service Categories"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-full transition-all text-sm md:text-base font-medium whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-red text-white shadow-md' 
                : 'text-ivory hover:text-white'
            }`}
            role="tab"
            aria-selected={activeCategory === category.id}
            aria-controls={`${category.id}-panel`}
            id={`${category.id}-tab`}
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
}

function ServiceGrid({ services, categoryId, locationSlug }: ServiceGridProps) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12"
      role="tabpanel" 
      id={`${categoryId}-panel`}
      aria-labelledby={`${categoryId}-tab`}
    >
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          service={service}
          href={`/services/${categoryId}/${service.id}/${locationSlug}`}
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