'use client';

import { useEffect } from 'react';
import { 
  initFacebookPixel, 
  trackEvent, 
  FacebookEventName,
  type TrackEventOptions 
} from '@/utils/facebookConversionsApi';

/**
 * Hook for tracking Facebook Conversion events
 * 
 * This initializes the Facebook Pixel once and provides methods for tracking events
 * through both Facebook Pixel and Conversions API simultaneously
 */
export function useFacebookEvents() {
  // Initialize Facebook Pixel on mount
  useEffect(() => {
    initFacebookPixel();
    
    // Track PageView for the current page on first load
    trackEvent(FacebookEventName.PAGE_VIEW);
  }, []);
  
  /**
   * Track a lead submission (form fill, quote request, etc.)
   */
  const trackLead = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.LEAD, options);
  };
  
  /**
   * Track a form submission
   */
  const trackFormSubmission = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.COMPLETE_REGISTRATION, options);
  };
  
  /**
   * Track a contact request
   */
  const trackContact = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.CONTACT, options);
  };
  
  /**
   * Track a service scheduling
   */
  const trackSchedule = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.SCHEDULE, options);
  };
  
  /**
   * Track a view of service content
   */
  const trackServiceView = async (
    serviceName: string,
    serviceCategory: string,
    options: Omit<TrackEventOptions, 'eventId' | 'customData'> = {}
  ) => {
    return trackEvent(FacebookEventName.VIEW_CONTENT, {
      ...options,
      customData: {
        contentName: serviceName,
        contentCategory: serviceCategory,
        contentType: 'service',
      },
    });
  };
  
  /**
   * Track a generic custom event
   */
  const trackCustomEvent = async (
    eventName: string, 
    options: Omit<TrackEventOptions, 'eventId'> = {}
  ) => {
    return trackEvent(eventName, options);
  };
  
  /**
   * Track when a user views a product or service detail page
   */
  const trackViewContent = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.VIEW_CONTENT, options);
  };
  
  /**
   * Track when a user initiates a quote request or checkout-like process
   */
  const trackInitiateCheckout = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.INITIATE_CHECKOUT, options);
  };
  
  /**
   * Track when a user clicks a phone number to call
   */
  const trackPhoneClick = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    // Using 'Contact' event for phone clicks as it's most appropriate
    return trackEvent(FacebookEventName.CONTACT, {
      ...options,
      customData: {
        ...options.customData,
        contentCategory: 'Phone Call',
        contentType: 'phone_click'
      }
    });
  };

  /**
   * Track a page view
   */
  const trackPageView = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    return trackEvent(FacebookEventName.PAGE_VIEW, options);
  };

  return {
    trackLead,
    trackFormSubmission,
    trackContact,
    trackSchedule,
    trackServiceView,
    trackCustomEvent,
    trackViewContent,
    trackInitiateCheckout,
    trackPhoneClick,
    trackPageView
  };
}
