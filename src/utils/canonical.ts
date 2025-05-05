/**
 * Canonical URL utility for SEO
 * 
 * Provides functions to generate canonical URLs for different page types
 * Helps prevent duplicate content issues when pages can be accessed via multiple URLs
 */

const BASE_URL = 'https://protech-ohio.com'; // Updated to correct domain name

/**
 * Generate a canonical URL for any page
 */
export function generateCanonicalUrl(path: string): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generate a canonical URL for a service page
 * This ensures that regardless of how the page is accessed, 
 * search engines recognize it as the same content
 */
export function generateServiceCanonicalUrl(
  categoryId: string, 
  serviceId: string, 
  location: string = 'northeast-ohio'
): string {
  return generateCanonicalUrl(`/services2/${categoryId}/${serviceId}/${location}`);
}
