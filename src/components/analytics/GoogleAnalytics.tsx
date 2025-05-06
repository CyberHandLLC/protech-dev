'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics 4 Component
 * 
 * Implements Google Analytics 4 with direct GA4 tag and through Tag Manager
 * Uses hardcoded GA4 Measurement ID: G-7H1V0PZ9YV for ProTech HVAC
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Hardcoded GA4 Measurement ID for ProTech HVAC
  const ga4Id = measurementId || 'G-7H1V0PZ9YV';
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views when route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname) {
      // Push page_view event to dataLayer for GTM
      window.dataLayer?.push({
        event: 'page_view',
        page: {
          path: pathname,
          title: document.title,
          location: window.location.href,
          search: searchParams?.toString() || '',
        },
      });

      // Also directly call gtag if it exists (direct GA4 implementation)
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: pathname,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
      
      console.log('GA4 page_view event sent for:', pathname);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Analytics 4 Script - Direct Implementation */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}', {
            send_page_view: false, // We'll handle this manually for more control
            cookie_flags: 'max-age=7200;secure;samesite=none',
          });
        `}
      </Script>
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Track a specific event in Google Analytics 4
 */
export function trackGoogleAnalyticsEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== 'undefined') {
    // Send through GTM dataLayer
    window.dataLayer?.push({
      event: eventName,
      ...eventParams,
    });
    
    // Also send directly to GA4 if gtag exists
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
    
    console.log(`GA4 ${eventName} event sent:`, eventParams);
  }
}
