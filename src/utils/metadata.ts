import { Metadata } from 'next';
import { generateCanonicalUrl } from './canonical';

export type MetadataParams = {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  imageUrl?: string;
  canonical?: string;
};

/**
 * Generate base metadata that all pages will include
 */
export function generateBaseMetadata(): Metadata {
  return {
    // Defaults that can be overridden
    metadataBase: new URL('https://protech-ohio.com'),
    title: {
      template: '%s | ProTech HVAC',
      default: 'ProTech HVAC | Professional Heating & Cooling Services',
    },
    description: 'Professional heating, cooling, and air quality services throughout Northeast Ohio. Family-owned HVAC company with expert technicians.',
    applicationName: 'ProTech HVAC',
    authors: [{ name: 'ProTech HVAC', url: 'https://protech-ohio.com' }],
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    viewport: {
      width: 'device-width',
      initialScale: 1
    },
    themeColor: '#002B5B', // Navy blue primary brand color
    verification: {
      google: 'google-site-verification-code', // Replace with actual verification code when available
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
  };
}

/**
 * Generate service-specific metadata including rich SEO attributes
 */
export function generateServiceMetadata(params: MetadataParams): Metadata {
  const { title, description, keywords, path, imageUrl = '/images/service-default.jpg', canonical } = params;
  
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://protech-ohio.com${imageUrl}`;
  const canonicalUrl = canonical || (path ? generateCanonicalUrl(path) : undefined);
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL('https://protech-ohio.com'),
    openGraph: {
      title,
      description,
      url: canonicalUrl || '',
      siteName: 'ProTech HVAC Services',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: canonicalUrl || '',
    },
  };
}

/**
 * Generate location-specific metadata with enhanced SEO options
 * 
 * @param location Location slug (e.g., 'akron-oh')
 * @param locationName Optional formatted location name (e.g., 'Akron, OH')
 * @param options Optional SEO configuration options
 */
export function generateLocationMetadata(
  location: string, 
  locationName?: string, 
  options?: {
    canonical?: string;
    description?: string;
    keywords?: string[];
  }
): Metadata {
  // Format location name if not provided
  const formattedLocation = locationName || location
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
  
  // Generate path and canonical URL
  const path = `/services/locations/${location}`;
  const canonicalUrl = options?.canonical || generateCanonicalUrl(path);
  
  return generateServiceMetadata({
    title: `HVAC Services in ${formattedLocation} | ProTech HVAC`,
    description: options?.description || 
      `Professional heating, cooling and air quality services in ${formattedLocation}. Fast, reliable service with 100% satisfaction guarantee.`,
    keywords: options?.keywords || [
      `${formattedLocation} HVAC`, 
      `${formattedLocation} heating and cooling`, 
      `HVAC services ${formattedLocation}`,
      `air conditioning repair ${formattedLocation}`,
      `heating repair ${formattedLocation}`,
      `furnace repair ${formattedLocation}`
    ],
    path: path,
    // Note: canonical is handled in alternates property via generateServiceMetadata
  });
}