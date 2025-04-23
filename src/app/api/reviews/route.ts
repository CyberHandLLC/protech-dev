import { NextResponse } from 'next/server';

// Environment variables for the Google Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyDQM0JzTTB_Nh5BlJmL9866-6Jt9InByRw';
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJXwWa3Gg3N4gR18IWw-UDM_M';

export async function GET() {
  try {
    // Fetch reviews from Google Places API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(detailsUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API error:', data);
      throw new Error('Failed to fetch reviews from Google Places API');
    }

    // Extract and format the reviews
    const reviews = data.result?.reviews || [];
    const formattedReviews = reviews.map((review: any, index: number) => ({
      id: index + 1,
      name: review.author_name,
      location: 'Google Review', // Since Google doesn't provide location in reviews
      rating: review.rating,
      text: review.text,
      service: 'HVAC Service', // Default service type
      date: new Date(review.time * 1000).toISOString().split('T')[0], // Convert Unix timestamp to YYYY-MM-DD
      avatar: review.profile_photo_url,
    }));

    return NextResponse.json({ 
      success: true, 
      reviews: formattedReviews,
      placeRating: data.result?.rating || 0
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
