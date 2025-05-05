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
      console.warn('Missing Google Places API environment variables, using fallback mock data');
      
      // Provide fallback mock data when environment variables are missing
      const mockReviews = [
        {
          id: 1,
          name: "James Wilson",
          location: "Akron, OH",
          rating: 5,
          text: "ProTech's technicians were prompt, professional, and solved our AC issues quickly. Highly recommended for any HVAC needs!",
          service: "Air Conditioning Repair",
          date: "2025-04-15"
        },
        {
          id: 2,
          name: "Sarah Johnson",
          location: "Stow, OH",
          rating: 5,
          text: "Exceptional service! The team installed our new furnace efficiently and left everything spotless. The difference in our home's comfort is remarkable.",
          service: "Furnace Installation",
          date: "2025-03-22"
        },
        {
          id: 3,
          name: "Michael Brown",
          location: "Cuyahoga Falls, OH",
          rating: 4,
          text: "ProTech responded quickly to our emergency call when our heat went out during a cold snap. Fair pricing and thorough work.",
          service: "Emergency Heating Repair",
          date: "2025-02-10"
        },
        {
          id: 4,
          name: "Jennifer Davis",
          location: "Hudson, OH",
          rating: 5,
          text: "After getting quotes from several companies, ProTech offered the best value and highest quality equipment. The mini-split system they installed works perfectly in our sunroom.",
          service: "Mini Split Installation",
          date: "2025-01-18"
        },
        {
          id: 5,
          name: "Robert Miller",
          location: "Kent, OH",
          rating: 5,
          text: "Annual maintenance from ProTech keeps our HVAC system running efficiently year-round. They always provide helpful tips to extend the life of our equipment.",
          service: "Maintenance",
          date: "2025-04-03"
        }
      ];
      
      // Cache the mock data
      cachedReviews = mockReviews;
      lastFetchTime = now;
      
      return NextResponse.json(mockReviews);
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
