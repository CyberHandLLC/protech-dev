'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic imports to prevent any SSR issues with structured data components
const LocalBusinessSchema = dynamic(() => import('./schema/LocalBusinessSchema'));
const FAQSchemaOnly = dynamic(() => import('./schema/FAQSchemaOnly'));
const ReviewSchemaAggregated = dynamic(() => import('./schema/ReviewSchemaAggregated'));

// Common FAQ data across the site
const commonFAQs = [
  {
    question: "How often should I have my HVAC system serviced?",
    answer: "We recommend having your system professionally serviced twice a year: once before the cooling season and once before the heating season. Regular maintenance extends the life of your system and improves efficiency."
  },
  {
    question: "How long do HVAC systems typically last?",
    answer: "With proper maintenance, air conditioners and heat pumps typically last 10-15 years, while furnaces can last 15-20 years. Regular maintenance is key to maximizing your system's lifespan."
  },
  {
    question: "What size HVAC system do I need for my home?",
    answer: "The right size depends on several factors including your home's square footage, insulation, window efficiency, and local climate. Our professional technicians can perform a load calculation to determine the perfect size for your needs."
  },
  {
    question: "How can I improve my indoor air quality?",
    answer: "You can improve indoor air quality by regularly changing air filters, using air purifiers, installing UV lights in your HVAC system, maintaining proper humidity levels, and scheduling regular duct cleaning."
  },
  {
    question: "Do you offer emergency HVAC services?",
    answer: "Yes, we offer 24/7 emergency HVAC services throughout Northeast Ohio. Our technicians are always on call to help with urgent heating and cooling issues."
  }
];

interface GlobalSEOProps {
  children: ReactNode;
  pageFAQs?: Array<{
    question: string;
    answer: string;
  }>;
  includeFAQs?: boolean;
}

/**
 * GlobalSEO Component
 * 
 * Applies consistent SEO structured data across all pages
 * Can be customized with page-specific FAQs
 * Only adds structured data markup without visible UI elements
 */
export default function GlobalSEO({ 
  children, 
  pageFAQs = [], 
  includeFAQs = true 
}: GlobalSEOProps) {
  // Check if we're on a service detail page by looking at the URL
  const isServiceDetailPage = typeof window !== 'undefined' && 
    (window.location.pathname.match(/\/services\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/) ||
     window.location.pathname.match(/\/services2\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/));

  // Only include FAQs if we're NOT on a service detail page (those pages handle their own FAQs)
  const shouldIncludeFAQs = includeFAQs && !isServiceDetailPage;
  
  // Combine common FAQs with page-specific FAQs only if we should include FAQs
  const allFAQs = shouldIncludeFAQs 
    ? [...pageFAQs, ...commonFAQs] 
    : pageFAQs;

  return (
    <>
      {/* Business information schema - appears on all pages */}
      <LocalBusinessSchema />
      
      {/* FAQ schema - only include if we have FAQs AND we're not on a service detail page */}
      {allFAQs.length > 0 && shouldIncludeFAQs && (
        <FAQSchemaOnly faqs={allFAQs} />
      )}

      {/* Review schema with real Google reviews */}
      <ReviewSchemaAggregated businessName="ProTech HVAC" />
      
      {children}
    </>
  );
}
