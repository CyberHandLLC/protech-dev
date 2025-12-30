'use client';

import Link from 'next/link';
import { serviceLocations } from '@/utils/locationUtils';
import { expandedServiceLocations } from '@/utils/expandedLocationUtils';

/**
 * CRITICAL SEO FIX: Location hub links for discovery
 * 
 * This component provides links to all location hub pages from the main services page.
 * Helps Google discover location pages which then link to service detail pages.
 */
export default function ServiceAreaLinks() {
  // Combine all Ohio locations
  const allLocations = [
    ...serviceLocations.filter(loc => loc.stateCode === 'OH'),
    ...expandedServiceLocations.filter(loc => loc.stateCode === 'OH')
  ].sort((a, b) => {
    // Sort by primary area first, then alphabetically
    if (a.primaryArea && !b.primaryArea) return -1;
    if (!a.primaryArea && b.primaryArea) return 1;
    return a.name.localeCompare(b.name);
  });

  // Group by county for better organization
  const locationsByCounty: Record<string, typeof allLocations> = {};
  allLocations.forEach(location => {
    const county = location.county || 'Other Areas';
    if (!locationsByCounty[county]) {
      locationsByCounty[county] = [];
    }
    locationsByCounty[county].push(location);
  });

  return (
    <div className="bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">
            Our Service Areas Throughout Northeast Ohio
          </h2>
          <p className="text-ivory text-lg">
            ProTech HVAC proudly serves {allLocations.length} cities and communities across Northeast Ohio. 
            Click any location to see available services and local information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(locationsByCounty).map(([county, locations]) => (
            <div key={county} className="bg-navy-darker rounded-lg p-6 border border-navy-light">
              <h3 className="text-xl font-semibold text-red mb-4">{county}</h3>
              <ul className="space-y-2">
                {locations.map(location => (
                  <li key={location.id}>
                    <Link
                      href={`/services/locations/${location.id}`}
                      className="text-ivory hover:text-white transition-colors flex items-center group"
                    >
                      <span className="text-red mr-2 group-hover:mr-3 transition-all">→</span>
                      {location.name}
                      {location.primaryArea && (
                        <span className="ml-2 text-xs text-red-light">(Primary)</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-ivory">
            Don't see your city listed? We serve the entire Northeast Ohio region. 
            <Link href="/contact" className="text-red hover:text-red-light ml-1 underline">
              Contact us
            </Link> to confirm service availability in your area.
          </p>
        </div>
      </div>
    </div>
  );
}
