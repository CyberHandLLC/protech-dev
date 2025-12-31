'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

/**
 * LocationViewedTracker Component
 * 
 * Tracks when users view service area/location pages
 * Also tracks when location redirects occur (e.g., Las Vegas → Northeast Ohio)
 */
export default function LocationViewedTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackLocationViewed } = useFacebookEvents();

  useEffect(() => {
    const trackLocation = async () => {
      try {
        // Check if this is a location page: /services/locations/[location]
        if (pathname.startsWith('/services/locations/')) {
          const pathParts = pathname.split('/').filter(Boolean);
          const locationSlug = pathParts[2]; // cleveland, akron, wooster-oh, etc.
          
          if (locationSlug) {
            // Format location name
            const formattedLocation = locationSlug
              .replace(/-/g, ' ')
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            
            // Check if this was a redirect (query param would indicate)
            const wasRedirected = searchParams?.get('redirected') === 'true';
            const originalLocation = searchParams?.get('from');
            
            await trackLocationViewed({
              customData: {
                location: formattedLocation,
                source: wasRedirected ? `Redirected from ${originalLocation}` : 'Direct visit',
                contentType: 'location_page',
                contentName: `Service Area: ${formattedLocation}`,
              }
            });
            
            console.log(`[LocationViewed] ${formattedLocation}${wasRedirected ? ` (redirected from ${originalLocation})` : ''}`);
          }
        }
      } catch (error) {
        console.error('Error tracking location view:', error);
      }
    };

    trackLocation();
  }, [pathname, searchParams, trackLocationViewed]);

  return null;
}
