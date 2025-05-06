'use client';

import { ReactNode } from 'react';
import ServicePageTracker from './ServicePageTracker';

/**
 * ServicePageTrackerWrapper Component
 * 
 * Client component that wraps service pages with the ServicePageTracker
 * This allows server components to use the ServicePageTracker functionality
 */
interface ServicePageTrackerWrapperProps {
  children: ReactNode;
  serviceName: string;
  serviceCategory?: string;
  serviceDescription?: string;
  estimatedValue?: number;
}

export default function ServicePageTrackerWrapper({
  children,
  serviceName,
  serviceCategory = 'HVAC Service',
  serviceDescription = '',
  estimatedValue = 0
}: ServicePageTrackerWrapperProps) {
  return (
    <>
      <ServicePageTracker
        serviceName={serviceName}
        serviceCategory={serviceCategory}
        serviceDescription={serviceDescription}
        estimatedValue={estimatedValue}
      />
      {children}
    </>
  );
}
