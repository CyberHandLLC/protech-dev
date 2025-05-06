import { serviceCategories } from '@/data/serviceDataNew';

// Define types for sitemap entries
export type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  isCanonical?: boolean;
};

/**
 * Generate validated sitemap URLs for the site
 * This ensures we only generate URLs for valid service combinations
 * @param baseUrl Base URL of the site (e.g., https://protech-ohio.com)
 * @param currentDate ISO date string for lastModified field
 * @returns Object containing different groups of sitemap entries
 */
export function generateValidatedSitemapUrls(baseUrl: string, currentDate: string) {
  // Core pages - these are canonical by definition
  const staticPages: SitemapEntry[] = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      isCanonical: true,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      isCanonical: true,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      isCanonical: true,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      isCanonical: true,
    },
  ];

  // Service category pages - using clean URLs instead of query parameters
  const serviceCategoryPages: SitemapEntry[] = serviceCategories.map(category => ({
    url: `${baseUrl}/services/${category.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
    isCanonical: true,
  }));

  // Service locations from ServiceArea-Location-ZipCodes-ProTech.txt
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
  
  // Location specific pages - using path-based structure
  const locationPages: SitemapEntry[] = serviceLocations.map(location => ({
    url: `${baseUrl}/services/locations/${location.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    isCanonical: true,
  }));
  
  // Generate service detail pages with validation
  const serviceDetailPages: SitemapEntry[] = [];

  // Map to track which exact combinations we have validated
  const validCombinations: Set<string> = new Set();
  
  // First identify all valid combinations by checking pages that actually exist
  serviceCategories.forEach(category => {
    // Skip if category has no systems
    if (!category.systems || category.systems.length === 0) return;
    
    category.systems.forEach(system => {
      // Skip systems that don't have service types
      if (!system.serviceTypes || system.serviceTypes.length === 0) return;
      
      system.serviceTypes.forEach(serviceType => {
        // Skip service types without specific items or with empty items array
        if (!serviceType.items || serviceType.items.length === 0) return;
        
        // Skip emergency services that don't have specific items
        if (serviceType.id === 'emergency' && (!serviceType.items || serviceType.items.length === 0)) return;
        
        // Skip service types that are clearly placeholders
        if (serviceType.items.some(item => !item.id || item.id === '')) return;
        
        serviceType.items.forEach(item => {
          // Create a unique key for this combination to track it
          const combinationKey = `${category.id}-${system.id}-${serviceType.id}-${item.id}`;
          
          // Only include combinations that are fully defined with real data
          if (
            category.id && 
            system.id && 
            serviceType.id && 
            item.id && 
            // Additional validation could be added here
            true
          ) {
            validCombinations.add(combinationKey);
          }
        });
      });
    });
  });
  
  // Now generate URLs only for the validated combinations
  serviceCategories.forEach(category => {
    category.systems.forEach(system => {
      system.serviceTypes.forEach(serviceType => {
        serviceType.items.forEach(item => {
          const combinationKey = `${category.id}-${system.id}-${serviceType.id}-${item.id}`;
          
          // Only process combinations we've validated above
          if (validCombinations.has(combinationKey)) {
            // Generate pages only for valid combinations
            serviceLocations.forEach(location => {
              // Final URL validation - ensure no empty segments
              if (location.slug && location.slug.trim() !== '') {
                serviceDetailPages.push({
                  url: `${baseUrl}/services/${category.id}/${system.id}/${serviceType.id}/${item.id}/${location.slug}`,
                  lastModified: currentDate,
                  changeFrequency: 'weekly',
                  priority: 0.9,
                  isCanonical: true
                });
              }
            });
          }
        });
      });
    });
  });

  // Return all page groups
  return {
    staticPages,
    serviceCategoryPages,
    serviceLocations,
    locationPages,
    serviceDetailPages,
    // Helper function to get all pages combined
    getAllPages: () => {
      return [
        ...serviceDetailPages,
        ...staticPages, 
        ...serviceCategoryPages,
        ...locationPages,
      ];
    }
  };
}
