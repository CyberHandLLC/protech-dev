import { Metadata } from 'next';
import { generateCanonicalUrl } from './canonical';

interface MetadataParams {
  title: string;
  description: string;
  keywords: string[];
  path?: string;
  imageUrl?: string;
}

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
      },
    },
  };
}

/**
 * Generate service-specific metadata including rich SEO attributes
 */
export function generateServiceMetadata({ 
  title, 
  description, 
  keywords,
  path = '',
  imageUrl = '/images/service-default.jpg' 
}: MetadataParams): Metadata {
  const canonicalUrl = path ? generateCanonicalUrl(path) : undefined;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://protech-ohio.com${imageUrl}`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'ProTech HVAC',
      url: canonicalUrl || 'https://protechhvac.com',
      images: [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: `${title} - ProTech HVAC Service`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate location-specific metadata 
 */
export function generateLocationMetadata(location: string): Metadata {
  // Capitalize the first letter of each word in the location
  const formattedLocation = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return generateServiceMetadata({
    title: `HVAC Services in ${formattedLocation} | ProTech HVAC`,
    description: `Professional heating, cooling and air quality services in ${formattedLocation}. Fast, reliable service with 100% satisfaction guarantee.`,
    keywords: [
      `${formattedLocation} HVAC`, 
      `${formattedLocation} heating and cooling`, 
      `HVAC services ${formattedLocation}`,
      `air conditioning repair ${formattedLocation}`,
      `heating repair ${formattedLocation}`,
      `furnace repair ${formattedLocation}`
    ],
    path: `/services2/location/${location}`,
  });
}