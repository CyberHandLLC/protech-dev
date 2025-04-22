'use client';

import { useState } from 'react';
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
  
  // Prioritize server location, then client location, then default
  let locationToUse = serverLocation?.name || clientLocation || 'Northeast Ohio';
  
  // Make sure to decode any URL-encoded characters in the location name
  try {
    // Try to decode in case the location contains URL-encoded characters
    locationToUse = decodeURIComponent(locationToUse);
  } catch (e) {
    // If decoding fails, use the original
    console.error('Error decoding location:', e);
  }
  // Create a location slug for URLs
  const locationSlug = serverLocation?.id || 
    (clientLocation ? convertToLocationSlug(clientLocation) : 'northeast-ohio');
  
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
        {isLocating && !serverLocation ? (
          <p className="text-ivory/70 animate-pulse">Detecting your location...</p>
        ) : (
          <p className="text-ivory/80">
            Services available in <span className="text-red-light font-medium">{locationToUse}</span>
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
              {service.description || `Professional ${service.name.toLowerCase()} services tailored to your needs.`}
            </p>
            <a 
              href={`/services/${category.id}/${service.id}/${locationSlug}`}
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
