import { MetadataRoute } from 'next';

/**
 * Generates robots.txt for the website
 * This helps search engines understand which pages to crawl and which to ignore
 * Updated with comprehensive crawl directives and correct domain name
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // Hide API routes
          '/admin/',        // Hide admin paths
          '/*.json$',       // Hide JSON data files
          '/404',           // Hide error pages
          '/500',           // Hide error pages
          '/thank-you',     // Hide thank you pages (post-form submission)
          '/*?preview=*',   // Hide preview pages
          '/*?draft=*',     // Hide draft pages
        ],
      },
      {
        // Additional rules for specific bots if needed
        userAgent: 'GPTBot',
        disallow: ['/']
      },
    ],
    sitemap: 'https://protech-ohio.com/sitemap.xml',  // Updated domain name
    host: 'https://protech-ohio.com',                 // Added host directive
  };
}
