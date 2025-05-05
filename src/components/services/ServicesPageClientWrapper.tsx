'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

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
  mainEntity = "HVAC Services",
  showVisibleFAQs = false // Default to hidden visible FAQs but still add schema
}: ServicesPageClientWrapperProps) {
  return (
    <>
      {/* Include invisible FAQSchema for SEO benefits regardless of visible UI */}
      {faqs.length > 0 && !showVisibleFAQs && (
        <FAQSchemaOnly faqs={faqs} mainEntity={mainEntity} />
      )}
      
      {children}
      
      {/* Only show visible FAQ section when explicitly requested */}
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
    </>
  );
}
