import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { serviceCategories } from '@/data/serviceDataNew';

/**
 * Generates a sitemap for the website with XSL styling
 * This helps search engines discover and crawl all your pages
 * Updated for 2025 SEO best practices with added stylesheet
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://protech-ohio.com'; // Correct domain name with no email or address
  const currentDate = new Date();
  
  // Core pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Service category pages
  const serviceCategoryPages = serviceCategories.map(category => ({
    url: `${baseUrl}/services?category=${category.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Service locations from ServiceArea-Location-ZipCodes-ProTech.txt
  // Use our comprehensive service area information
  const serviceLocations = [
    // Summit County
    { name: 'Akron', slug: 'akron-oh' },
    { name: 'Cuyahoga Falls', slug: 'cuyahoga-falls-oh' },
    { name: 'Stow', slug: 'stow-oh' },
    { name: 'Tallmadge', slug: 'tallmadge-oh' },
    { name: 'Hudson', slug: 'hudson-oh' },
    { name: 'Norton', slug: 'norton-oh' },
    // Medina County
    { name: 'Medina', slug: 'medina-oh' },
    { name: 'Wadsworth', slug: 'wadsworth-oh' },
    { name: 'Seville', slug: 'seville-oh' },
    { name: 'Brunswick', slug: 'brunswick-oh' },
    { name: 'Lodi', slug: 'lodi-oh' },
    { name: 'Rittman', slug: 'rittman-oh' },
    // Wayne County
    { name: 'Wooster', slug: 'wooster-oh' },
    { name: 'Orrville', slug: 'orrville-oh' },
    { name: 'Smithville', slug: 'smithville-oh' },
    { name: 'Fredericksburg', slug: 'fredericksburg-oh' },
    { name: 'Doylestown', slug: 'doylestown-oh' },
  ];
  
  // Location specific pages (higher priority for SEO)
  const locationPages = serviceLocations.map(location => ({
    url: `${baseUrl}/services/locations/${location.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Generate service detail pages - the most important for SEO and lead generation
  const serviceDetailPages: MetadataRoute.Sitemap = [];
  
  // Loop through all possible service combinations to create detailed pages
  serviceCategories.forEach(category => {
    category.systems.forEach(system => {
      system.serviceTypes.forEach(serviceType => {
        serviceType.items.forEach(item => {
          // Generate service detail pages for each location
          serviceLocations.forEach(location => {
            serviceDetailPages.push({
              url: `${baseUrl}/services/${category.id}/${system.id}/${serviceType.id}/${item.id}/${location.slug}`,
              lastModified: currentDate,
              changeFrequency: 'weekly' as const,
              priority: 0.9, // High priority for service detail pages
            });
          });
        });
      });
    });
  });

  // Combine all pages
  return [
    // Most important pages first (for crawler efficiency)
    ...serviceDetailPages,
    ...staticPages, 
    ...serviceCategoryPages,
    ...locationPages,
  ];
}
