'use client';

import { useState, useEffect } from 'react';
import { ServiceCategory } from '@/data/serviceData';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';

interface ServicesListProps {
  category: ServiceCategory;
  userLocation?: any; // ServiceLocation object passed from server-side
}

export default function ServicesList({ category, userLocation: serverLocation }: ServicesListProps) {
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating, error } = useLocationDetection();
  
  // State to track which subcategories are expanded
  const [expandedServices, setExpandedServices] = useState<{[key: string]: boolean}>({});
  
  // State to store the final location after combining server and client data
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    slug: string;
    isDetecting: boolean;
  }>({
    name: serverLocation?.name || 'Northeast Ohio',
    slug: serverLocation?.id || 'northeast-ohio',
    isDetecting: true
  });
  
  // Toggle expansion state for a subcategory
  const toggleExpand = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };
  
  // Update location when client-side detection completes
  useEffect(() => {
    // Wait for location detection to complete
    if (!isLocating) {
      let locationName = '';
      let locationSlug = '';

      // Prioritize client location if available, otherwise use server location
      if (clientLocation) {
        try {
          locationName = decodeURIComponent(clientLocation);
        } catch (e) {
          locationName = clientLocation;
          console.error('Error decoding location:', e);
        }
        locationSlug = convertToLocationSlug(clientLocation);
      } else if (serverLocation?.name) {
        // Use server-provided location if client detection fails
        locationName = serverLocation.name;
        locationSlug = serverLocation.id;
      } else {
        // Fallback to default
        locationName = 'Northeast Ohio';
        locationSlug = 'northeast-ohio';
      }
      
      // Update the combined location state
      setCombinedLocation({
        name: locationName,
        slug: locationSlug,
        isDetecting: false
      });
    }
  }, [clientLocation, isLocating, serverLocation]);
  
  // Initialize all subcategories as expanded by default
  useEffect(() => {
    const initialExpanded: {[key: string]: boolean} = {};
    category.services.forEach(service => {
      initialExpanded[service.id] = true;
    });
    setExpandedServices(initialExpanded);
  }, [category.services]);
  
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
        {combinedLocation.isDetecting ? (
          <p className="text-ivory/70 animate-pulse">Detecting your location...</p>
        ) : (
          <p className="text-ivory/80">
            Services available in <span className="text-red-light font-medium">{combinedLocation.name}</span>
          </p>
        )}
      </div>
      
      {/* Subcategories with service types layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {category.services.map((service) => (
          <div 
            key={service.id}
            className="pl-4 border-l-4 border-red py-4"
          >
            {/* Subcategory header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(service.id)}
            >
              <h3 className="font-bold text-xl text-white flex items-center gap-3">
                <span className="text-red">{service.icon}</span>
                {service.name}
              </h3>
              <button 
                className="text-ivory hover:text-red transition-colors"
                aria-expanded={expandedServices[service.id] ? 'true' : 'false'}
                aria-controls={`${service.id}-services`}
              >
                <svg 
                  className={`h-5 w-5 transform transition-transform ${expandedServices[service.id] ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Subcategory description */}
            <p className="text-ivory/70 mt-2 mb-3">
              {service.description || `Professional ${service.name.toLowerCase()} services tailored to your needs.`}
            </p>
            
            {/* Service types list */}
            <div 
              id={`${service.id}-services`}
              className={`mt-3 transition-all duration-300 ${
                expandedServices[service.id] 
                  ? 'max-h-[1000px] opacity-100 visible'
                  : 'max-h-0 opacity-0 invisible overflow-hidden'
              }`}
            >
              {service.subServices && service.subServices.length > 0 ? (
                <ul className="space-y-2 pl-2 border-l-2 border-navy/30">
                  {service.subServices.map((subService) => (
                    <li key={subService.id} className="py-1">
                      <a 
                        href={`/services/${category.id}/${service.id}/${subService.id}/${combinedLocation.slug}`}
                        className="flex items-center text-ivory hover:text-red transition-colors"
                      >
                        <span className="text-red mr-2">{subService.icon}</span>
                        <span>{subService.name}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ivory/50 italic pl-6">No specific service types available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
