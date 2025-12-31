'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';

interface ServiceViewTrackerProps {
  serviceName?: string;
  serviceType?: string;
  category?: string;
  location?: string;
}

/**
 * ServiceViewTracker Component
 * 
 * Tracks when users view HVAC service pages with detailed context:
 * - Service name (AC Repair, Furnace Installation, etc.)
 * - Service category (Residential, Commercial)
 * - Location (Cleveland, Akron, Wooster, etc.)
 * - Urgency (Emergency or Scheduled)
 */
export default function ServiceViewTracker({
  serviceName,
  serviceType = 'general',
  category = 'service',
  location
}: ServiceViewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackServiceViewed } = useFacebookEvents();
  
  useEffect(() => {
    const trackService = async () => {
      try {
        // Extract service details from URL path
        // Example: /services/commercial/cooling/maintenance/commercial-refrigeration/wooster-oh
        const pathParts = pathname.split('/').filter(Boolean);
        
        // Detect category from URL or query param
        const urlCategory = searchParams?.get('category') || pathParts[1] || category;
        
        // Extract service details from path
        const system = pathParts[2]; // cooling, heating
        const serviceType = pathParts[3]; // maintenance, repair, installation
        const item = pathParts[4]; // commercial-refrigeration, furnaces, etc.
        const locationSlug = pathParts[5] || location; // wooster-oh, cleveland, etc.
        
        // Format service name
        const formattedServiceName = serviceName || 
          (item ? item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Service');
        
        // Format location
        const formattedLocation = locationSlug 
          ? locationSlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : 'Northeast Ohio';
        
        // Detect urgency from URL or page context
        const isEmergency = pathname.includes('emergency') || searchParams?.get('urgency') === 'emergency';
        
        // Track with ServiceViewed event
        await trackServiceViewed({
          customData: {
            serviceName: formattedServiceName,
            serviceCategory: `${urlCategory} - ${system || 'general'}`,
            location: formattedLocation,
            urgency: isEmergency ? 'emergency' : 'scheduled',
            contentType: serviceType || 'service',
          }
        });
        
        console.log(`[ServiceViewed] ${formattedServiceName} (${urlCategory}) in ${formattedLocation} - ${isEmergency ? 'Emergency' : 'Scheduled'}`);
      } catch (error) {
        console.error('Error tracking service view:', error);
      }
    };
    
    trackService();
  }, [pathname, searchParams, serviceName, category, location, trackServiceViewed]);
  
  return null; // This component doesn't render anything
}
