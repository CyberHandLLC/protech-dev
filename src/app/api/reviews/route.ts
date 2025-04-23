import { NextResponse } from 'next/server';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let cachedReviews: any = null;
let lastFetchTime: number = 0;

/**
 * GET handler for /api/reviews
 * Fetches Google Places reviews with daily caching
 */
export async function GET() {
  // Check if we have cached reviews that are still valid
  const now = Date.now();
  if (cachedReviews && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json(cachedReviews);
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      throw new Error('Missing required environment variables');
    }

    // Fetch place details including reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&reviews_sort=newest&key=${apiKey}`;
    
    const response = await fetch(url, { next: { revalidate: CACHE_DURATION / 1000 } });
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const reviews = data.result.reviews || [];
    
    // Format reviews to match our Testimonial interface
    const formattedReviews = reviews.map((review: any, index: number) => ({
      id: index + 1,
      name: review.author_name,
      location: '',  // Google doesn't provide reviewer location
      rating: review.rating,
      text: review.text,
      avatar: review.profile_photo_url,
      service: 'Residential', // Default as per requirements
      date: new Date(review.time * 1000).toISOString().split('T')[0]
    }));

    // Cache the results
    cachedReviews = formattedReviews;
    lastFetchTime = now;

    return NextResponse.json(formattedReviews);
  } catch (error: any) {
    console.error('Error fetching Google reviews:', error.message);
    
    // Return an empty array with error info in case of failure
    return NextResponse.json({ 
      error: error.message,
      reviews: [] 
    }, { status: 500 });
  }
}
