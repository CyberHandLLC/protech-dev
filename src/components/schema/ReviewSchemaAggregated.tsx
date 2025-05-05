'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  service: string;
  date: string;
}

interface ReviewSchemaAggregatedProps {
  businessName?: string;
  showLoading?: boolean;
}

/**
 * ReviewSchemaAggregated Component
 * 
 * Adds structured data for Google reviews with aggregated rating
 * Fetches real reviews from the API rather than using mock data
 * This can enable star ratings to appear in search results
 * NOTE: Only includes the schema markup, not the visible UI
 */
export default function ReviewSchemaAggregated({
  businessName = 'ProTech HVAC',
  showLoading = false
}: ReviewSchemaAggregatedProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Check if we have an array of reviews
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          // Fall back to empty array if no valid reviews format
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Show nothing during loading if requested
  if (loading && !showLoading) {
    return null;
  }

  // Handle error state
  if (error) {
    console.error(`Error in ReviewSchemaAggregated: ${error}`);
    return null;
  }

  // If no reviews, don't render schema
  if (!reviews.length) {
    return null;
  }

  // Calculate the aggregate rating
  const aggregateRating = {
    ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  };

  // Format the schema data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "datePublished": review.date,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "reviewBody": review.text
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue.toFixed(1),
      "reviewCount": aggregateRating.reviewCount,
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
