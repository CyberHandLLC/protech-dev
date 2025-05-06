'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdsConversionProps {
  conversionId?: string;
}

/**
 * Google Ads Conversion Tracking Component
 * 
 * Implements Google Ads conversion tracking with Google Tag Manager support
 * Uses hardcoded Google Ads Conversion ID: AW-11287044712 for ProTech HVAC
 */
export default function GoogleAdsConversion({ conversionId }: GoogleAdsConversionProps) {
  // Hardcoded Google Ads Conversion ID for ProTech HVAC
  const adsId = conversionId || 'AW-11287044712';
  
  // Initialize Google Ads conversion tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Push initial conversion settings to dataLayer
      window.dataLayer?.push({
        'event': 'ads_conversion_init',
        'google_ads': {
          'conversion_id': adsId
        }
      });
      
      console.log('Google Ads conversion tracking initialized with ID:', adsId);
    }
  }, [adsId]);

  return (
    <>
      {/* Google Ads Conversion Tracking Script */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${adsId}');
        `}
      </Script>
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Track a specific conversion in Google Ads
 */
export function trackGoogleAdsConversion(
  conversionLabel: string,
  conversionValue?: number,
  currency?: string,
  transactionId?: string
) {
  if (typeof window !== 'undefined') {
    // Default currency is USD
    const finalCurrency = currency || 'USD';
    
    // Send through GTM dataLayer
    window.dataLayer?.push({
      'event': 'ads_conversion',
      'google_ads': {
        'conversion_label': conversionLabel,
        'conversion_value': conversionValue,
        'currency': finalCurrency,
        'transaction_id': transactionId
      }
    });
    
    // Also send directly to Google Ads if gtag exists
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11287044712/' + conversionLabel,
        'value': conversionValue,
        'currency': finalCurrency,
        'transaction_id': transactionId
      });
    }
    
    console.log(`Google Ads conversion tracked:`, {
      label: conversionLabel,
      value: conversionValue,
      currency: finalCurrency
    });
  }
}
