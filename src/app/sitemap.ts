import { MetadataRoute } from 'next';
import { generateValidatedSitemapUrls } from '@/utils/sitemapUtils';

/**
 * Generates a sitemap for the website 
 * This helps search engines discover and crawl all your pages
 * Updated for 2025 SEO best practices with validated URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://protech-ohio.com'; // Correct domain name with no email or address
  const currentDate = new Date().toISOString();
  
  // Generate validated sitemap URLs using our shared utility
  const { 
    staticPages, 
    serviceCategoryPages, 
    locationPages, 
    serviceDetailPages 
  } = generateValidatedSitemapUrls(baseUrl, currentDate);

  // Convert to Metadata Route format
  const allPages = [
    ...serviceDetailPages,
    ...staticPages, 
    ...serviceCategoryPages,
    ...locationPages,
  ].map(page => ({
    url: page.url,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency as 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'always',
    priority: page.priority
  }));

  return allPages;
}
