import { NextRequest, NextResponse } from 'next/server';
import { serviceCategories } from '@/data/serviceDataNew';

// Define URL prioritization and canoncalization strategy types
type UrlEntry = {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  isCanonical?: boolean;
};

/**
 * Custom XML sitemap route handler with anti-duplicate content protection
 * Generates a sitemap with XSL stylesheet reference for better user experience
 * Built specifically for ProTech HVAC website according to 2025 SEO best practices
 * Implements canonical URL strategy to avoid duplicate content penalties
 */
export async function GET(request: NextRequest) {
  const baseUrl = 'https://protech-ohio.com'; // Domain name without trailing slash
  const currentDate = new Date().toISOString();
  
  // Core pages - these are canonical by definition
  const staticPages: UrlEntry[] = [
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
      url: `${baseUrl}/services`, // Updated from services2 to services
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
  // Using path-based structure for better SEO and to avoid duplicate content issues
  const serviceCategoryPages: UrlEntry[] = serviceCategories.map(category => ({
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
  
  // Location specific pages - using path-based structure instead of query parameters
  // This helps Google recognize these as unique canonical pages rather than duplicates
  const locationPages: UrlEntry[] = serviceLocations.map(location => ({
    url: `${baseUrl}/services/locations/${location.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    isCanonical: true,
  }));
  
  // Generate service detail pages - using SEO-optimized URL patterns
  const serviceDetailPages: UrlEntry[] = [];
  
  // Loop through all possible service combinations
  serviceCategories.forEach(category => {
    category.systems.forEach(system => {
      system.serviceTypes.forEach(serviceType => {
        serviceType.items.forEach(item => {
          // Generate service detail pages for each location
          // We now use a more canonical-friendly structure to avoid duplicate content issues
          serviceLocations.forEach(location => {
            serviceDetailPages.push({
              url: `${baseUrl}/services/${category.id}/${system.id}/${serviceType.id}/${item.id}/${location.slug}`,
              lastModified: currentDate,
              changeFrequency: 'weekly',
              priority: 0.9,
              isCanonical: true, // Mark as canonical to avoid duplicate content issues
            });
          });
        });
      });
    });
  });

  // Filter only the canonical URLs to prevent duplicate content
  // Per Google's 2025 best practices: only include canonical URLs in sitemap
  const canonicalPages = [
    ...serviceDetailPages,
    ...staticPages, 
    ...serviceCategoryPages,
    ...locationPages,
  ].filter(page => page.isCanonical === true);
  
  // Only keep unique URLs
  const uniqueUrls = new Map();
  canonicalPages.forEach(page => {
    uniqueUrls.set(page.url, page);
  });
  
  // Convert back to array
  const allPages = Array.from(uniqueUrls.values());

  // Generate XML with stylesheet reference
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  xml += 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Add each URL to the sitemap with proper canonical hints for search engines
  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastModified}</lastmod>\n`;
    xml += `    <changefreq>${page.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    // Optional: Add hreflang if you have multi-language support in the future
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';

  // Return the XML sitemap with proper headers
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex', // Prevent the sitemap itself from being indexed
      'Link': '<https://protech-ohio.com/sitemap.xml>; rel="canonical"' // Self-referential canonical
    }
  });
}
