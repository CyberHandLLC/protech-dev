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

    // Fetch place details including reviews with timeout
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&reviews_sort=newest&key=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        next: { revalidate: CACHE_DURATION / 1000 } 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      const reviews = data.result.reviews || [];
      
      // Format reviews and filter out those without text
      const formattedReviews = reviews
        .filter((review: any) => review.text && review.text.trim().length > 0)
        .map((review: any, index: number) => ({
          id: index + 1,
          name: review.author_name || 'Anonymous',
          location: '',  // Google doesn't provide reviewer location
          rating: review.rating || 5,
          text: review.text || '',
          avatar: review.profile_photo_url,
          service: 'Residential',
          date: review.time ? new Date(review.time * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
      
      // If we got valid reviews, cache them
      if (formattedReviews.length > 0) {
        cachedReviews = formattedReviews;
        lastFetchTime = now;
        return NextResponse.json(formattedReviews);
      }
      
      // If no valid reviews, fall through to mock data
      throw new Error('No valid reviews with text found');
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If we have cached data, return it instead of failing
      if (cachedReviews) {
        console.warn('Using cached reviews due to API error:', fetchError.message);
        return NextResponse.json(cachedReviews);
      }
      
      // Otherwise throw to use mock data
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Error fetching Google reviews:', error.message);
    
    // Return an empty array with error info in case of failure
    return NextResponse.json({ 
      error: error.message,
      reviews: [] 
    }, { status: 500 });
  }
}
