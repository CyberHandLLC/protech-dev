'use client';

import { useState } from 'react';
import { ServiceCategory } from '@/data/serviceData';
import IconFeature from '@/components/ui/IconFeature';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';

interface ServicesListProps {
  category: ServiceCategory;
}

export default function ServicesList({ category }: ServicesListProps) {
  // Use our custom hook for location detection
  const { userLocation, isLocating, error } = useLocationDetection();
  
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">{category.name}</h2>
        {isLocating ? (
          <p className="text-ivory/70 animate-pulse">Detecting your location...</p>
        ) : (
          <p className="text-ivory/80">
            Services available in <span className="text-red-light font-medium">{userLocation || 'Northeast Ohio'}</span>
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {category.services.map((service) => (
          <IconFeature
            key={service.id}
            icon={<span className="text-xl">{service.icon}</span>}
            title={service.name}
            description={service.description || `Professional ${service.name.toLowerCase()} services tailored to your needs.`}
            href={`/services/${category.id}/${service.id}/${userLocation ? convertToLocationSlug(userLocation) : 'northeast-ohio'}`}
            interactive
          />
        ))}
      </div>
    </section>
  );
}
