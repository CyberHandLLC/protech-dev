import { NextRequest, NextResponse } from 'next/server';
import { generateValidatedSitemapUrls } from '@/utils/sitemapUtils';

// We're now using the shared utility in sitemapUtils.ts

/**
 * Custom XML sitemap route handler with anti-duplicate content protection
 * Generates a sitemap with XSL stylesheet reference for better user experience
 * Built specifically for ProTech HVAC website according to 2025 SEO best practices
 * Implements canonical URL strategy to avoid duplicate content penalties
 */
export async function GET(request: NextRequest) {
  const baseUrl = 'https://protech-ohio.com'; // Domain name without trailing slash
  const currentDate = new Date().toISOString();
  
  // Get validated sitemap URLs from our shared utility
  const siteMapData = generateValidatedSitemapUrls(baseUrl, currentDate);
  
  // Get all pages, ensuring we only include canonical URLs (no duplicates)
  const allPages = siteMapData.getAllPages().filter(page => page.isCanonical === true);
  
  // Double-check for uniqueness by URL
  const uniqueUrls = new Map();
  allPages.forEach(page => {
    uniqueUrls.set(page.url, page);
  });
  
  // Final, deduplicated array of canonical pages
  const canonicalPages = Array.from(uniqueUrls.values());

  // Generate XML with stylesheet reference
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  xml += 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Add each URL to the sitemap with proper canonical hints for search engines
  canonicalPages.forEach(page => {
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
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex', // Prevent the sitemap itself from being indexed
      'Link': '<https://protech-ohio.com/sitemap.xml>; rel="canonical"' // Self-referential canonical
    }
  });
}
