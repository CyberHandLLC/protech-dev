import { notFound } from 'next/navigation';
import { serviceCategories } from '@/data/serviceDataNew';

// This page will handle any service path that doesn't match our exact route structure
export default async function CatchAllServiceRenderer({ params }: { params: Promise<{ catchall: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.catchall.join('/');
  
  // Check if this is a location-based URL
  if (resolvedParams.catchall[0] === 'locations' && resolvedParams.catchall.length === 2) {
    // Handle location pages like /services/locations/akron-oh
    const locationSlug = resolvedParams.catchall[1];
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">HVAC Services in {locationSlug.replace('-', ' ').replace(/oh$/i, 'OH')}</h1>
        <p>Viewing services for this location. This page is under construction.</p>
      </div>
    );
  }
  
  // Default: Show not found page for any unrecognized patterns
  notFound();
}