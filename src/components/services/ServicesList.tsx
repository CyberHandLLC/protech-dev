'use client';

import { useState, useEffect } from 'react';
import { ServiceCategory } from '@/data/serviceData';
import IconFeature from '@/components/ui/IconFeature';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';

interface ServicesListProps {
  category: ServiceCategory;
  userLocation?: any; // ServiceLocation object passed from server-side
}

export default function ServicesList({ category, userLocation: serverLocation }: ServicesListProps) {
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating, error } = useLocationDetection();
  
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
      
      {/* Non-card based layout with clean list format and left border accents as mentioned in memories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {category.services.map((service) => (
          <div 
            key={service.id}
            className="pl-4 border-l-4 border-red py-4 transition-all hover:pl-6"
          >
            <h3 className="font-bold text-xl text-white flex items-center gap-3 mb-2">
              <span className="text-red">{service.icon}</span>
              {service.name}
            </h3>
            <p className="text-ivory/70 mb-3">
              {`Professional ${service.name.toLowerCase()} services tailored to your needs.`}
            </p>
            <a 
              href={`/services/${category.id}/${service.id}/${combinedLocation.slug}`}
              className="inline-flex items-center text-red-light font-medium hover:text-red transition-colors"
            >
              <span className="mr-2">View Details</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
