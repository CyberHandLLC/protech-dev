'use client';

import { useEffect, useCallback } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

interface GoogleTagManagerProps {
  containerId?: string;
}

// Define HVAC business specific event types
type HVACConversionEvent = 
  | 'appointment_scheduled'
  | 'service_call_requested' 
  | 'quote_requested'
  | 'phone_call'
  | 'form_submitted'
  | 'emergency_service';

// Define window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Enhanced Google Tag Manager Component for HVAC Business
 * 
 * Implements optimized conversion tracking for HVAC services
 * Uses hardcoded GTM ID: GTM-T6QSRR5H for ProTech HVAC
 * Updated for 2025 best practices with Next.js App Router
 */
export default function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  // Hardcoded GTM ID for ProTech HVAC
  const gtmId = containerId || 'GTM-T6QSRR5H';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Page view event handler with route change detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Push initial pageview to dataLayer with enhanced data
    window.dataLayer.push({
      'event': 'page_view',
      'page': {
        'title': document.title,
        'location': window.location.href,
        'path': pathname,
        'referrer': document.referrer,
        'query_params': Object.fromEntries(searchParams.entries())
      },
      'user': {
        'client_id': getClientId()
      },
      'timestamp': new Date().toISOString()
    });
    
    console.log('Google Tag Manager initialized with ID:', gtmId);
  }, [gtmId, pathname, searchParams]);
  
  // Helper function to get Google Analytics client ID
  const getClientId = () => {
    try {
      const gaCookie = document.cookie.split(';').find(c => c.trim().startsWith('_ga='));
      if (gaCookie) {
        return gaCookie.split('.').slice(-2).join('.');
      }
      return 'unknown';
    } catch (e) {
      return 'unknown';
    }
  };
  
  // HVAC-specific conversion event tracking function
  const trackHVACConversion = useCallback((
    eventName: HVACConversionEvent, 
    eventData: Record<string, any> = {}
  ) => {
    if (typeof window === 'undefined') return;
    
    // Standard data for all HVAC conversion events
    const baseEventData = {
      timestamp: new Date().toISOString(),
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname
    };
    
    // Push enhanced conversion event to dataLayer
    window.dataLayer.push({
      event: eventName,
      hvac_data: {
        ...baseEventData,
        ...eventData,
        service_area: eventData.service_area || 'Ohio',
        service_type: eventData.service_type || 'general'
      }
    });
    
    console.log(`HVAC Conversion tracked: ${eventName}`, eventData);
  }, [pathname]);
  
  // Add trackHVACConversion function to window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackHVACConversion = trackHVACConversion;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).trackHVACConversion;
      }
    };
  }, [trackHVACConversion]);

  return (
    <>
      {/* Google Tag Manager script - optimized for 2025 */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      
      {/* Google Tag Manager noscript fallback */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
