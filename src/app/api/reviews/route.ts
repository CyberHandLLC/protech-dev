import { NextResponse } from 'next/server';

// Google Places API constants
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

// Interface for Google Places API response
interface GooglePlacesResponse {
  result: {
    name: string;
    reviews?: Array<{
      author_name: string;
      profile_photo_url?: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }>;
    user_ratings_total: number;
    rating: number;
  };
  status: string;
}

// Interface for our structured review data
export interface ReviewData {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  service: string; // This will be set to "Google Review" since we don't have actual service data
  date: string;
  source: string;
}

export async function GET() {
  try {
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      return NextResponse.json(
        { error: 'API keys not configured' },
        { status: 500 }
      );
    }

    // Fetch details from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,review,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`,
      { next: { revalidate: 60 * 60 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Google Places API returned ${response.status}`);
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API returned status: ${data.status}`);
    }

    // Extract and transform reviews
    const reviews: ReviewData[] = data.result.reviews?.map((review, index) => {
      // Convert Unix timestamp to ISO string date
      const reviewDate = new Date(review.time * 1000).toISOString().split('T')[0];
      
      return {
        id: `google-${index}`,
        name: review.author_name,
        location: 'Google Review', // We don't have location data from Google
        rating: review.rating,
        text: review.text,
        avatar: review.profile_photo_url,
        service: 'Google Review', // We don't have service data from Google
        date: reviewDate,
        source: 'google'
      };
    }) || [];

    return NextResponse.json({ 
      reviews,
      businessName: data.result.name,
      averageRating: data.result.rating,
      totalReviews: data.result.user_ratings_total
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
