'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { ServiceLocation } from '@/utils/locationUtils';
import useLocationDetection from '@/hooks/useLocationDetection';
// Import types from the server component
import { Service, ServiceCategory, serviceCategories as allServiceCategories } from '../ServicesPreview';

interface ServicesPreviewClientProps {
  serviceCategories: ServiceCategory[];
  initialCategory: string;
  initialServices: Service[];
  locationSlug: string;
  displayLocation: string;
  locationProp?: string | ServiceLocation;
}

/**
 * Client component that handles all interactive elements of the ServicesPreview
 * This separation follows Next.js best practices for reducing TBT
 * By moving all interactive elements to this client component, we reduce JS sent to mobile
 */
export default function ServicesPreviewClient({
  serviceCategories,
  initialCategory,
  initialServices,
  locationSlug: initialLocationSlug,
  displayLocation: initialDisplayLocation,
  locationProp
}: ServicesPreviewClientProps) {
  // Client-side state - isolated from server rendering
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeServices, setActiveServices] = useState(initialServices);
  const [locationSlug] = useState(initialLocationSlug);
  
  // Use location detection hook only on the client side
  const { userLocation: detectedLocation, isLocating } = useLocationDetection();
  
  // Update services when category changes - only runs on the client
  useEffect(() => {
    const category = serviceCategories.find(cat => cat.id === activeCategory);
    if (category) {
      setActiveServices(category.services);
    }
  }, [activeCategory, serviceCategories]);

  // Handle category change - only exists on the client side
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
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
    </>
  );
}

interface CategoryTabsProps {
  categories: ServiceCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Memoized component to reduce TBT through unnecessary rerenders
const CategoryTabs = memo(function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
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

// Memoized component to reduce TBT through unnecessary rerenders
const ServiceGrid = memo(function ServiceGrid({ 
  services, 
  categoryId, 
  locationSlug, 
  isLoading 
}: ServiceGridProps) {
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
  
  // Display the service grid with service cards
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8" 
      id={`${categoryId}-panel`}
      role="tabpanel"
      aria-labelledby={`${categoryId}-tab`}
    >
      {services.map(service => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          categoryId={categoryId} 
          locationSlug={locationSlug} 
        />
      ))}
    </div>
  );
});

interface ServiceCardProps {
  service: Service;
  categoryId: string;
  locationSlug: string;
}

// Memoized component to reduce TBT through unnecessary rerenders
const ServiceCard = memo(function ServiceCard({ 
  service, 
  categoryId, 
  locationSlug 
}: ServiceCardProps) {
  // This URL generation is now only done on the client side
  const serviceUrl = `/services/${categoryId}/${service.id}/${locationSlug}`;
  
  return (
    <div className="bg-navy rounded-xl p-6 flex flex-col h-full group transition-all hover:shadow-lg">
      <div className="text-red-light text-3xl mb-3">{service.icon}</div>
      <h3 className="text-white text-xl font-bold mb-2">{service.name}</h3>
      <p className="text-ivory/80 text-sm mb-4 flex-grow">{service.description}</p>
      
      <ul className="space-y-1.5 mb-5">
        {service.features.slice(0, 2).map((feature, index) => (
          <li key={index} className="text-ivory/70 text-sm flex items-start">
            <span className="text-red mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <Link 
        href={serviceUrl}
        className="mt-auto text-white bg-navy-light hover:bg-red transition-colors duration-300 rounded-lg px-4 py-2 text-center text-sm"
      >
        Learn More
      </Link>
    </div>
  );
});
