'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOCanonicalProps {
  overridePathname?: string;
  baseUrl?: string;
}

/**
 * SEOCanonical Component
 * 
 * Adds a canonical URL tag to each page to prevent duplicate content issues
 * This is especially important for pages that can be accessed via multiple routes
 */
export default function SEOCanonical({ 
  overridePathname, 
  baseUrl = 'https://protechhvac.com' 
}: SEOCanonicalProps) {
  const pathname = usePathname();
  const canonicalUrl = `${baseUrl}${overridePathname || pathname}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
