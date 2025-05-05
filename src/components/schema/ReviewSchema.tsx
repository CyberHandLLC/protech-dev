'use client';

interface Review {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished?: string;
}

interface ReviewSchemaProps {
  serviceName: string;
  reviews: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * ReviewSchema Component
 * 
 * Adds structured data for service reviews
 * This can enable star ratings to appear in search results
 * Extremely valuable for HVAC businesses as it builds trust with potential customers
 */
export default function ReviewSchema({
  serviceName,
  reviews,
  aggregateRating
}: ReviewSchemaProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate aggregate rating if not provided
  const calculatedAggregateRating = aggregateRating || {
    ratingValue: reviews.reduce((sum, review) => sum + review.reviewRating, 0) / reviews.length,
    reviewCount: reviews.length
  };

  // Format the schema data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished || new Date().toISOString().split('T')[0],
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating,
        "bestRating": "5"
      },
      "reviewBody": review.reviewBody
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": calculatedAggregateRating.ratingValue.toFixed(1),
      "reviewCount": calculatedAggregateRating.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
