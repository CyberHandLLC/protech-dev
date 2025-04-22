'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Service category types
interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

// Service categories data
const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential',
    services: [
      {
        id: 'ac-installation',
        name: 'AC Installation',
        description: 'Professional installation of energy-efficient air conditioning systems.',
        category: 'residential',
        icon: 'snow'
      },
      {
        id: 'furnace-repair',
        name: 'Furnace Repair',
        description: 'Fast, reliable repairs for all furnace brands and models.',
        category: 'residential',
        icon: 'fire'
      },
      {
        id: 'air-quality',
        name: 'Air Quality Services',
        description: 'Solutions for improving indoor air quality in your home.',
        category: 'residential',
        icon: 'wind'
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial',
    services: [
      {
        id: 'commercial-hvac',
        name: 'Commercial HVAC',
        description: 'Comprehensive HVAC solutions for businesses and commercial properties.',
        category: 'commercial',
        icon: 'building'
      },
      {
        id: 'refrigeration',
        name: 'Commercial Refrigeration',
        description: 'Installation and maintenance of commercial refrigeration systems.',
        category: 'commercial',
        icon: 'cube'
      },
      {
        id: 'industrial-cooling',
        name: 'Industrial Cooling',
        description: 'Specialized cooling solutions for industrial facilities and processes.',
        category: 'commercial',
        icon: 'industry'
      }
    ]
  }
];

// Props type
interface ClientServicesNavProps {
  locationSlug: string;
}

/**
 * Client component for services navigation
 * This isolates the interactive parts of the services section
 * to minimize JavaScript for mobile optimization
 */
export default function ClientServicesNav({ locationSlug }: ClientServicesNavProps) {
  const [activeCategory, setActiveCategory] = useState('residential');
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  
  // Update services when category changes
  useEffect(() => {
    const category = serviceCategories.find(cat => cat.id === activeCategory);
    setActiveServices(category?.services || []);
  }, [activeCategory]);
  
  return (
    <>
      {/* Category tabs - interactive part */}
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <div 
          className="flex justify-center rounded-full bg-navy p-1 sm:p-1.5 w-full max-w-xs sm:max-w-md mx-auto"
          role="tablist"
          aria-label="Service Categories"
        >
          {serviceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-red text-white shadow-md' 
                  : 'text-ivory hover:text-white'
              }`}
              role="tab"
              aria-selected={activeCategory === category.id}
              aria-controls={`${category.id}-panel`}
              id={`${category.id}-tab`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Service cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeServices.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.category}/${service.id}/${locationSlug}`}
            className="block bg-navy-light hover:bg-navy-light-200 rounded-lg overflow-hidden transition-colors group"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-red/10 flex items-center justify-center mb-4">
                <span className="text-red text-xl">
                  {service.icon === 'snow' && '❄️'}
                  {service.icon === 'fire' && '🔥'}
                  {service.icon === 'wind' && '💨'}
                  {service.icon === 'building' && '🏢'}
                  {service.icon === 'cube' && '🧊'}
                  {service.icon === 'industry' && '🏭'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2 group-hover:text-red transition-colors">
                {service.name}
              </h3>
              <p className="text-ivory/80 text-sm">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View all link */}
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
