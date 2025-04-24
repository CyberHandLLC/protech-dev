import { Metadata } from 'next';

interface MetadataParams {
  title: string;
  description: string;
  keywords: string[];
}

// Utility to generate consistent metadata for service pages
export function generateServiceMetadata({ title, description, keywords }: MetadataParams): Metadata {
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
      url: 'https://protech-hvac.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: 'https://protech-hvac.com',
    },
  };
}