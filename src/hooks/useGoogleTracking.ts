'use client';

import { useState } from 'react';
import { trackGoogleAnalyticsEvent } from '@/components/analytics/GoogleAnalytics';
import { trackGoogleAdsConversion } from '@/components/analytics/GoogleAdsConversion';

/**
 * Custom hook for tracking conversions and events across Google's tracking systems
 * Combines Google Analytics 4 events with Google Ads conversion tracking
 */
export default function useGoogleTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Track a conversion with both Google Analytics and Google Ads
   */
  const trackConversion = (
    eventName: string,
    conversionLabel: string,
    params?: Record<string, any>
  ) => {
    try {
      setIsTracking(true);
      setError(null);
      
      // Common parameters
      const value = params?.value || 0;
      const currency = params?.currency || 'USD';
      const transactionId = params?.transaction_id || `txn_${Date.now()}`;
      
      // Track in GA4
      trackGoogleAnalyticsEvent(eventName, {
        ...params,
        currency: currency,
        value: value,
        transaction_id: transactionId
      });
      
      // Track in Google Ads
      trackGoogleAdsConversion(
        conversionLabel,
        value,
        currency,
        transactionId
      );
      
      console.log(`Conversion tracked successfully: ${eventName}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown tracking error';
      console.error(`Error tracking conversion: ${errorMessage}`);
      setError(errorMessage);
      return false;
    } finally {
      setIsTracking(false);
    }
  };

  /**
   * Track a page view for a specific type of content
   */
  const trackPageView = (
    contentType: string,
    contentName: string,
    additionalParams?: Record<string, any>
  ) => {
    try {
      trackGoogleAnalyticsEvent('page_view', {
        content_type: contentType,
        content_name: contentName,
        ...additionalParams
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown page view tracking error';
      console.error(`Error tracking page view: ${errorMessage}`);
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Track a phone call with Google Analytics and Google Ads
   */
  const trackPhoneCall = (
    source: string,
    value: number = 50
  ) => {
    return trackConversion(
      'phone_call',     // GA4 event name
      'BQbMCNLn85sYEM_Eq6Qp', // Google Ads conversion label for phone calls
      {
        source: source,
        value: value,
        content_type: 'contact',
        method: 'phone'
      }
    );
  };

  /**
   * Track a form submission with Google Analytics and Google Ads
   */
  const trackFormSubmission = (
    formName: string,
    formType: string = 'lead',
    value: number = 100
  ) => {
    return trackConversion(
      'form_submission', // GA4 event name
      'j-OYCOuR6JsYEM_Eq6Qp',  // Google Ads conversion label for form submissions
      {
        form_name: formName,
        form_type: formType,
        value: value,
        content_type: 'lead'
      }
    );
  };

  /**
   * Track a service page view with Google Analytics
   */
  const trackServiceView = (
    serviceName: string,
    serviceCategory: string,
    value: number = 20
  ) => {
    trackGoogleAnalyticsEvent('view_item', {
      items: [{
        item_name: serviceName,
        item_category: serviceCategory,
        price: value
      }],
      currency: 'USD',
      value: value
    });
    
    // No Google Ads conversion for this since it's not a direct conversion
    return true;
  };

  return {
    isTracking,
    error,
    trackConversion,
    trackPageView,
    trackPhoneCall,
    trackFormSubmission,
    trackServiceView
  };
}
