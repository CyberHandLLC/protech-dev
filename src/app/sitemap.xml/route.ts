import { NextRequest, NextResponse } from 'next/server';
import { serviceCategories } from '@/data/serviceDataNew';

/**
 * Custom XML sitemap route handler
 * Generates a sitemap with XSL stylesheet reference for better user experience
 * Built specifically for ProTech HVAC website according to 2025 SEO best practices
 */
export async function GET(request: NextRequest) {
  const baseUrl = 'https://protech-ohio.com'; // Domain name
  const currentDate = new Date().toISOString();
  
  // Core pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services2`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Service category pages
  const serviceCategoryPages = serviceCategories.map(category => ({
    url: `${baseUrl}/services2?category=${category.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
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
  
  // Location specific pages
  const locationPages = serviceLocations.map(location => ({
    url: `${baseUrl}/services2?location=${location.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  // Generate service detail pages
  const serviceDetailPages = [];
  
  // Loop through all possible service combinations
  serviceCategories.forEach(category => {
    category.systems.forEach(system => {
      system.serviceTypes.forEach(serviceType => {
        serviceType.items.forEach(item => {
          // Generate service detail pages for each location
          serviceLocations.forEach(location => {
            serviceDetailPages.push({
              url: `${baseUrl}/services2/${category.id}/${system.id}/${serviceType.id}/${item.id}/${location.slug}`,
              lastModified: currentDate,
              changeFrequency: 'weekly',
              priority: 0.9,
            });
          });
        });
      });
    });
  });

  // Combine all pages
  const allPages = [
    ...serviceDetailPages,
    ...staticPages, 
    ...serviceCategoryPages,
    ...locationPages,
  ];

  // Generate XML with stylesheet reference
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  xml += 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Add each URL to the sitemap
  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastModified}</lastmod>\n`;
    xml += `    <changefreq>${page.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';

  // Return the XML sitemap with proper headers
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
