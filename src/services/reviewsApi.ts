/**
 * Reviews API service for fetching customer reviews
 */

import { Testimonial } from '@/types/reviews';

/**
 * Convert API review format to our app's Testimonial format
 */
export function mapApiReviewToTestimonial(apiReview: any): Testimonial {
  // Map the API response fields to our application's Testimonial format
  // Adjust this mapping based on your actual API response structure
  return {
    id: apiReview.id || Math.floor(Math.random() * 10000),
    name: apiReview.customerName || apiReview.name || 'Customer',
    location: apiReview.location || 'Local Area',
    rating: apiReview.rating || apiReview.stars || 5,
    text: apiReview.text || apiReview.content || apiReview.review || '',
    service: apiReview.service || apiReview.serviceType || 'HVAC Service',
    date: apiReview.date || apiReview.reviewDate || new Date().toISOString().split('T')[0],
    avatar: apiReview.avatar || apiReview.profileImage || undefined,
    // Add any additional fields you need
  };
}

/**
 * Fetch reviews from the API and transform them to the Testimonial format
 */
export async function fetchReviews(locationSlug?: string): Promise<{
  reviews: Testimonial[];
  locations: Record<string, Testimonial[]>;
}> {
  try {
    // Replace with your actual API endpoint
    const apiUrl = locationSlug 
      ? `${process.env.NEXT_PUBLIC_REVIEWS_API_URL}/reviews?location=${locationSlug}`
      : `${process.env.NEXT_PUBLIC_REVIEWS_API_URL}/reviews`;
    
    const response = await fetch(apiUrl, {
      headers: {
        // Add any required headers for your API
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REVIEWS_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API responses to our Testimonial format
    const transformedReviews = Array.isArray(data) 
      ? data.map(mapApiReviewToTestimonial)
      : Array.isArray(data.reviews) 
        ? data.reviews.map(mapApiReviewToTestimonial)
        : [];

    // Group reviews by location for location-based filtering
    const locationGroups: Record<string, Testimonial[]> = {};
    
    transformedReviews.forEach(review => {
      // Create a slug from the location or use a default
      const locationKey = review.location
        ? review.location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : 'uncategorized';
      
      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = [];
      }
      
      locationGroups[locationKey].push(review);
    });

    // Return both the full list and the grouped reviews
    return {
      reviews: transformedReviews,
      locations: locationGroups
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return empty arrays in case of error to prevent app crashes
    return { reviews: [], locations: {} };
  }
}

/**
 * Fetch reviews for a specific location
 */
export async function fetchReviewsByLocation(locationSlug: string): Promise<Testimonial[]> {
  const { locations } = await fetchReviews();
  
  // Return reviews for the requested location or an empty array
  return locations[locationSlug] || [];
}

/**
 * Get the top-rated reviews regardless of location
 */
export async function fetchTopReviews(limit = 5): Promise<Testimonial[]> {
  const { reviews } = await fetchReviews();
  
  // Sort by rating (highest first) and return limited number
  return reviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Get the most recent reviews regardless of location
 */
export async function fetchRecentReviews(limit = 5): Promise<Testimonial[]> {
  const { reviews } = await fetchReviews();
  
  // Sort by date (newest first) and return limited number
  return reviews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
