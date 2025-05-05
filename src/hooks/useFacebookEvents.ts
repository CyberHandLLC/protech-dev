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
  
  return {
    trackLead,
    trackFormSubmission,
    trackContact,
    trackSchedule,
    trackServiceView,
    trackCustomEvent,
  };
}
