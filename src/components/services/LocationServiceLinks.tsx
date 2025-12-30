'use client';

import Link from 'next/link';
import { serviceCategories } from '@/data/serviceDataNew';

interface LocationServiceLinksProps {
  locationSlug: string;
  locationName: string;
}

/**
 * CRITICAL SEO FIX: Internal linking for service discovery
 * 
 * This component generates links from location hub pages to all service detail pages.
 * Without these links, Google cannot discover service pages even if they're in the sitemap.
 * 
 * Problem: "Crawled - currently not indexed" with "No referring sitemaps detected"
 * Solution: Create internal link structure so Google can crawl and discover pages
 */
export default function LocationServiceLinks({ locationSlug, locationName }: LocationServiceLinksProps) {
  // Generate all service combinations for this location
  const serviceLinks: Array<{
    url: string;
    title: string;
    category: string;
    system: string;
  }> = [];

  serviceCategories.forEach(category => {
    category.systems.forEach(system => {
      system.serviceTypes.forEach(serviceType => {
        serviceType.items.forEach(item => {
          serviceLinks.push({
            url: `/services/${category.id}/${system.id}/${serviceType.id}/${item.id}/${locationSlug}`,
            title: `${item.name} ${serviceType.name}`,
            category: category.name,
            system: system.name
          });
        });
      });
    });
  });

  // Group by category for better organization
  const residential = serviceLinks.filter(link => link.category === 'Residential Services');
  const commercial = serviceLinks.filter(link => link.category === 'Commercial Services');

  return (
    <div className="mt-8 border-t border-navy-darker pt-6">
      <h3 className="text-xl font-semibold text-red mb-4">
        All Available Services in {locationName}
      </h3>
      <p className="text-ivory mb-6">
        ProTech HVAC provides comprehensive HVAC services throughout {locationName}. 
        Click any service below to learn more and schedule service.
      </p>

      {/* Residential Services */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-red-light mb-3">
          Residential Services in {locationName}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {residential.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="block p-3 bg-navy-darker rounded-lg border border-navy hover:border-red transition-colors text-ivory hover:text-white"
            >
              <span className="text-sm">
                {link.system} → {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Commercial Services */}
      <div>
        <h4 className="text-lg font-semibold text-red-light mb-3">
          Commercial Services in {locationName}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commercial.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="block p-3 bg-navy-darker rounded-lg border border-navy hover:border-red transition-colors text-ivory hover:text-white"
            >
              <span className="text-sm">
                {link.system} → {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-navy-darker rounded-lg border border-navy">
        <p className="text-sm text-ivory">
          <strong className="text-red-light">Note:</strong> All services are available throughout {locationName} and surrounding areas. 
          Our certified technicians provide fast, reliable service with transparent pricing and a satisfaction guarantee.
        </p>
      </div>
    </div>
  );
}
