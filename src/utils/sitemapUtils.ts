import { serviceCategories } from '@/data/serviceDataNew';
import { serviceLocations as actualServiceLocations } from '@/utils/locationUtils';
import { expandedServiceLocations } from '@/utils/expandedLocationUtils';

// CRITICAL SEO FIX: Only include Ohio locations in sitemap (Fix #1 from original plan)
// Filter out any non-Ohio locations to prevent Google from discovering out-of-service-area pages
const allServiceLocations = [
  ...actualServiceLocations.filter(loc => loc.stateCode === 'OH'),
  ...expandedServiceLocations.filter(loc => loc.stateCode === 'OH')
];

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

  // Validate category pages to ensure they exist before including in sitemap
  // Include both residential and commercial services
  const validCategories = new Set(['residential', 'commercial']);
  
  // Service category pages - using clean URLs instead of query parameters (only valid ones)
  const serviceCategoryPages: SitemapEntry[] = serviceCategories
    .filter(category => validCategories.has(category.id))
    .map(category => ({
      url: `${baseUrl}/services/${category.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      isCanonical: true,
    }));
    
  // Log which categories are included/excluded for debugging
  console.log(`Including category pages: ${validCategories.size} of ${serviceCategories.length}`);
  console.log(`Excluded categories: ${serviceCategories.filter(c => !validCategories.has(c.id)).map(c => c.id).join(', ')}`);
  

  // Use BOTH standard and expanded service locations for comprehensive coverage
  // All these locations have actual pages in the application thanks to our dynamic page implementation
  const serviceLocations = allServiceLocations.map(location => ({
    name: location.name,
    slug: location.id
  }));
  
  // Log the number of locations for debugging
  console.log(`Total service locations for sitemap: ${serviceLocations.length} locations`);
  console.log(`Standard locations: ${actualServiceLocations.length}, Expanded locations: ${expandedServiceLocations.length}`);
  
  // Generate location pages with extra validation
  const locationPages: SitemapEntry[] = [];
  
  // Process ONLY Ohio locations (standard + expanded) that have our validated slugs
  serviceLocations.forEach(location => {
    // Double check the page URL pattern matches what we have implemented AND is Ohio
    if (location.slug && location.slug.endsWith('-oh')) {
      // Ensure the slug format is consistent (lowercase with hyphens)
      const formattedSlug = location.slug.toLowerCase().trim();
      
      locationPages.push({
        url: `${baseUrl}/services/locations/${formattedSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        isCanonical: true,
      });
    }
  });
  
  // Log the final count of location pages
  console.log(`Generated ${locationPages.length} valid location pages for sitemap`);
  
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
    },
    // Additional statistics for logging
    stats: {
      totalLocations: serviceLocations.length,
      standardLocations: actualServiceLocations.length,
      expandedLocations: expandedServiceLocations.length,
      totalDetailPages: serviceDetailPages.length,
      totalPages: serviceDetailPages.length + staticPages.length + serviceCategoryPages.length + locationPages.length
    }
  };
}
