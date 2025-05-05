'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Now it's safe to use dynamic imports with ssr: false in this client component
const SEOServicePageWrapper = dynamic(() => import('@/components/SEOServicePageWrapper'), { ssr: false });
const FAQSchemaOnly = dynamic(() => import('@/components/schema/FAQSchemaOnly'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/FAQSection'), { ssr: false });

interface ServiceDetailClientWrapperProps {
  children: ReactNode;
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  serviceImageUrl: string;
  serviceArea: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  faqTitle?: string;
  faqSubtitle?: string;
  mainEntity?: string;
  showVisibleFAQs?: boolean;
}

/**
 * Client wrapper component for service detail pages
 * Handles all client-side SEO components to prevent SSR issues
 */
export default function ServiceDetailClientWrapper({
  children,
  serviceName,
  serviceDescription,
  serviceUrl,
  serviceImageUrl,
  serviceArea,
  faqs,
  faqTitle,
  faqSubtitle,
  mainEntity,
  showVisibleFAQs = true, // For service detail pages, default to showing FAQs since they're valuable there
}: ServiceDetailClientWrapperProps) {
  return (
    <>
      {/* If we don't want the SEOServicePageWrapper to handle the FAQs (to prevent visual FAQs),
          we need to add the schema separately */}
      {!showVisibleFAQs && faqs.length > 0 && (
        <FAQSchemaOnly 
          faqs={faqs} 
          mainEntity={mainEntity || serviceName}
        />
      )}
      
      {/* Wrap with SEO service wrapper for structured data */}
      <SEOServicePageWrapper
        serviceName={serviceName}
        serviceDescription={serviceDescription}
        serviceUrl={serviceUrl}
        serviceImageUrl={serviceImageUrl}
        serviceArea={serviceArea}
        faqs={showVisibleFAQs ? faqs : []} // Only pass FAQs to the wrapper if we want visible FAQs
      >
        {/* Render the original service page content */}
        {children}
        
        {/* Add FAQ section at the bottom of service pages only when requested */}
        {showVisibleFAQs && faqs.length > 0 && (
          <FAQSection 
            faqs={faqs}
            title={faqTitle || `Frequently Asked Questions About ${serviceName}`}
            subtitle={faqSubtitle || `Get answers to common questions about ${serviceName.toLowerCase()}.`}
            mainEntity={mainEntity || serviceName}
          />
        )}
      </SEOServicePageWrapper>
    </>
  );
}
