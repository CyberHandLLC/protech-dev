'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Now it's safe to use dynamic imports with ssr: false in this client component
const SEOServicePageWrapper = dynamic(() => import('@/components/SEOServicePageWrapper'));
const FAQSchemaOnly = dynamic(() => import('@/components/schema/FAQSchemaOnly'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));

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
      {/* For service detail pages, we want the FAQs in the schema but not necessarily visible */}
      
      {/* If FAQs shouldn't be visible but should be in schema, add FAQSchemaOnly first */}
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
        // Never pass FAQs to SEOServicePageWrapper to prevent duplicate FAQPage schema
        // FAQs are handled by FAQSchemaOnly component above
        faqs={[]} 
      >
        {/* Render the original service page content */}
        {children}
        
        {/* Add FAQ section VISUALLY at the bottom of service pages only when requested */}
        {showVisibleFAQs && faqs.length > 0 && (
          <div className="py-12">
            <div className="container mx-auto px-4">
              {/* Section heading */}
              <div className="text-center mb-10">
                <div className="inline-block mb-4">
                  <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {faqTitle || `Frequently Asked Questions About ${serviceName}`}
                </h2>
                {faqSubtitle && <p className="text-gray-600">{faqSubtitle}</p>}
              </div>
              
              {/* FAQ accordion - We're not using FAQSection to avoid duplicate schema */}
              <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SEOServicePageWrapper>
    </>
  );
}
