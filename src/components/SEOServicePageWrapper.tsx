'use client';

import { ReactNode } from 'react';
import ServiceSchema from './schema/ServiceSchema';
import ReviewSchema from './schema/ReviewSchema';
import FAQSchema from './schema/FAQSchema';

interface SEOServicePageWrapperProps {
  children: ReactNode;
  serviceName: string;
  serviceDescription: string;
  serviceUrl?: string;
  serviceImageUrl?: string;
  serviceArea?: string;
  
  // Review data for rich results
  reviews?: Array<{
    author: string;
    reviewRating: number;
    reviewBody: string;
    datePublished?: string;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  
  // FAQ data for rich results
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  pageName?: string;
}

/**
 * SEO Service Page Wrapper
 * 
 * A comprehensive wrapper component that applies all necessary
 * structured data and SEO optimizations to service pages
 */
export default function SEOServicePageWrapper({
  children,
  serviceName,
  serviceDescription,
  serviceUrl,
  serviceImageUrl,
  serviceArea = 'Northeast Ohio',
  reviews = [],
  aggregateRating,
  faqs = [],
  pageName
}: SEOServicePageWrapperProps) {
  return (
    <>
      {/* Service Schema */}
      <ServiceSchema
        name={serviceName}
        description={serviceDescription}
        serviceArea={serviceArea}
        imageUrl={serviceImageUrl}
        url={serviceUrl}
      />
      
      {/* Review Schema (if reviews provided) */}
      {reviews.length > 0 && (
        <ReviewSchema
          serviceName={serviceName}
          reviews={reviews}
          aggregateRating={aggregateRating}
        />
      )}
      
      {/* FAQ Schema (if FAQs provided) */}
      {faqs.length > 0 && (
        <FAQSchema faqs={faqs} mainEntity={serviceName} pageName={pageName} />
      )}
      
      {/* Render the children */}
      {children}
    </>
  );
}
