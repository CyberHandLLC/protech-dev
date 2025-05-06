'use client';

import { useState, useEffect } from 'react';
import { trackGoogleAnalyticsEvent } from '@/components/analytics/GoogleAnalytics';
import { trackGoogleAdsConversion } from '@/components/analytics/GoogleAdsConversion';
import { useTracking } from '@/context/TrackingContext';

/**
 * Custom hook for tracking conversions and events across Google's tracking systems
 * Combines Google Analytics 4 events with Google Ads conversion tracking
 */
export default function useGoogleTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent: trackGlobalEvent, isTrackingEnabled } = useTracking();

  /**
   * Track a conversion with both Google Analytics and Google Ads
   */
  const trackConversion = (
    eventName: string,
    conversionLabel: string,
    params?: Record<string, any>
  ) => {
    try {
      // Don't track if tracking is disabled
      if (!isTrackingEnabled) return false;
      
      setIsTracking(true);
      setError(null);
      
      // Create a content name from the event details
      const contentName = params?.content_name || params?.form_type || eventName;
      
      // Check if this event should be throttled
      if (!trackGlobalEvent('conversion', contentName)) {
        console.log(`Conversion event throttled: ${eventName} - ${contentName}`);
        return false;
      }
      
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
      // Don't track if tracking is disabled
      if (!isTrackingEnabled) return false;
      
      // Create a unique ID for this page view event
      const uniqueId = `page_view:${contentType}:${contentName}`.toLowerCase().replace(/\s+/g, '-');
      
      // Check if this event should be throttled
      if (!trackGlobalEvent('page_view', contentName, uniqueId)) {
        console.log(`Page view event throttled: ${contentType} - ${contentName}`);
        return false;
      }
      
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
    // Create a unique identifier for this phone call event
    const contentName = `Phone Call - ${source}`;
    
    // Check if this event should be throttled through the global context
    if (!trackGlobalEvent('phone_call', contentName)) {
      console.log(`Phone call event throttled: ${contentName}`);
      return false;
    }
    
    return trackConversion(
      'phone_call',     // GA4 event name
      'phone_call',     // Google Ads conversion label 
      { 
        source: source,
        value: value,
        content_name: contentName
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
