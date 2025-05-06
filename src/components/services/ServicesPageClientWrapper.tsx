'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import ServiceViewTracker from './ServiceViewTracker';

// Now it's safe to use dynamic imports with ssr: false in this client component
const FAQSchemaOnly = dynamic(() => import('@/components/schema/FAQSchemaOnly'), { ssr: false });
// We'll keep FAQSection available but only use it when specified
const FAQSection = dynamic(() => import('@/components/FAQSection'), { ssr: false });

interface ServicesPageClientWrapperProps {
  children: ReactNode;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
  subtitle?: string;
  mainEntity?: string;
  showVisibleFAQs?: boolean;
  serviceName?: string;
  serviceType?: string;
  category?: string;
  location?: string;
}

/**
 * Client wrapper component for the services page
 * Handles all client-side SEO components to prevent SSR issues
 */
export default function ServicesPageClientWrapper({
  children,
  faqs,
  title = "Frequently Asked Questions About HVAC Services",
  subtitle = "Get answers to common questions about our heating and cooling services.",
  mainEntity = "Service",
  showVisibleFAQs = false,
  serviceName,
  serviceType,
  category,
  location
}: ServicesPageClientWrapperProps) {
  return (
    <div>
      {/* Facebook tracking for services */}
      <ServiceViewTracker 
        serviceName={serviceName}
        serviceType={serviceType}
        category={category}
        location={location}
      />
      
      {/* Include the FAQ schema regardless of whether FAQs are visibly shown */}
      {faqs.length > 0 && (
        <FAQSchemaOnly faqs={faqs} mainEntity={mainEntity} />
      )}
      
      {/* The main content */}
      {children}
      
      {/* Optionally show the visible FAQ section */}
      {faqs.length > 0 && showVisibleFAQs && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection 
              faqs={faqs}
              title={title}
              subtitle={subtitle}
              mainEntity={mainEntity}
            />
          </div>
        </section>
      )}
    </div>
  );
}
