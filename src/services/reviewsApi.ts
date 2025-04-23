/**
 * Reviews API service for fetching customer reviews from Google Places
 */

import { Testimonial } from '@/types/reviews';

/**
 * Convert Google Places review format to our app's Testimonial format
 */
export function mapGoogleReviewToTestimonial(googleReview: any, index: number): Testimonial {
  return {
    id: index, // Google doesn't provide unique IDs for reviews, so we use the array index
    name: googleReview.author_name || 'Google Reviewer',
    location: googleReview.author_location || 'Google Maps', // Google doesn't always provide reviewer location
    rating: googleReview.rating || 5,
    text: googleReview.text || '',
    service: 'HVAC Service', // Google reviews don't specify which service was used
    date: googleReview.time ? new Date(googleReview.time * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    avatar: googleReview.profile_photo_url,
    source: 'Google',
  };
}

/**
 * Fetch Google Places reviews through our secure server-side API route
 */
export async function fetchGoogleReviews(): Promise<{
  reviews: Testimonial[];
  placeDetails: {
    name: string;
    rating: number;
    address: string;
  }
}> {
  try {
    // Use our secure API route which keeps the API key private
    const response = await fetch('/api/reviews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    const result = data.result || {};
    const googleReviews = result.reviews || [];
    
    // Transform Google reviews to our Testimonial format
    const transformedReviews = googleReviews.map(mapGoogleReviewToTestimonial);

    return {
      reviews: transformedReviews,
      placeDetails: {
        name: result.name || 'ProTech HVAC',
        rating: result.rating || 5,
        address: result.formatted_address || 'Local Area'
      }
    };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    // Return empty arrays in case of error to prevent app crashes
    return { 
      reviews: [], 
      placeDetails: {
        name: 'ProTech HVAC',
        rating: 5,
        address: 'Local Area'
      }
    };
  }
}

/**
 * Get all Google reviews
 */
export async function getAllReviews(): Promise<Testimonial[]> {
  const { reviews } = await fetchGoogleReviews();
  return reviews;
}

/**
 * Get the top-rated Google reviews
 */
export async function getTopReviews(limit = 5): Promise<Testimonial[]> {
  const { reviews } = await fetchGoogleReviews();
  
  // Sort by rating (highest first) and return limited number
  return reviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Get the most recent Google reviews
 */
export async function getRecentReviews(limit = 5): Promise<Testimonial[]> {
  const { reviews } = await fetchGoogleReviews();
  
  // Sort by date (newest first) and return limited number
  return reviews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get place details from Google
 */
export async function getPlaceDetails(): Promise<{
  name: string;
  rating: number;
  address: string;
}> {
  const { placeDetails } = await fetchGoogleReviews();
  return placeDetails;
}
