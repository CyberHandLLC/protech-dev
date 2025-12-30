'use client';

import { useEffect } from 'react';
import { 
  initFacebookPixel, 
  trackEvent, 
  FacebookEventName,
  type TrackEventOptions 
} from '@/utils/facebookConversionsApi';
import { useTracking } from '@/context/TrackingContext';

/**
 * Hook for tracking Facebook Conversion events
 * 
 * This initializes the Facebook Pixel once and provides methods for tracking events
 * through both Facebook Pixel and Conversions API simultaneously
 */
export function useFacebookEvents() {
  const { trackEvent: trackGlobalEvent, isTrackingEnabled } = useTracking();

  // Note: Facebook Pixel initialization and PageView tracking is handled by the FacebookPixel component
  // This hook only provides methods for tracking conversion events
  
  /**
   * Track a lead submission (form fill, quote request, etc.)
   */
  const trackLead = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    // Get content name from options or use a default
    const contentName = options?.customData?.contentName || 'Lead';
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('lead', contentName)) {
      console.log(`Lead event throttled: ${contentName}`); 
      return false;
    }
    
    return trackEvent(FacebookEventName.LEAD, options);
  };
  
  /**
   * Track a form submission
   */
  const trackFormSubmission = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    // Get content name from options or use a default
    const contentName = options?.customData?.contentName || 'Form Submission';
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('form_submission', contentName)) {
      console.log(`Form submission event throttled: ${contentName}`); 
      return false;
    }
    
    return trackEvent(FacebookEventName.COMPLETE_REGISTRATION, options);
  };
  
  /**
   * Track a contact request
   */
  const trackContact = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    // Get content name from options or use a default
    const contentName = options?.customData?.contentName || 'Contact Request';
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('contact', contentName)) {
      console.log(`Contact event throttled: ${contentName}`); 
      return false;
    }
    
    return trackEvent(FacebookEventName.CONTACT, options);
  };
  
  /**
   * Track a service scheduling
   */
  const trackSchedule = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    // Get content name from options or use a default
    const contentName = options?.customData?.contentName || 'Service Scheduling';
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('schedule', contentName)) {
      console.log(`Schedule event throttled: ${contentName}`); 
      return false;
    }
    
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
    // Get content name from options or use a default
    const contentName = options?.customData?.contentName || 'Content View';
    const contentType = options?.customData?.contentType || 'content';
    
    // Create a unique ID combining type and name
    const uniqueId = `view_content:${contentType}:${contentName}`.toLowerCase().replace(/\s+/g, '-');
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('view_content', contentName, uniqueId)) {
      console.log(`View content event throttled: ${contentName}`); 
      return false;
    }
    
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
    // Extract content info from options or use defaults
    const sourceInfo = options?.customData?.contentName || 'Website';
    const contentName = `Phone Click: ${sourceInfo}`;
    
    // Check if this event should be throttled
    if (!trackGlobalEvent('phone_call', contentName)) {
      console.log(`Phone call event throttled: ${contentName}`); 
      return false;
    }
    
    // Using 'Contact' event for phone clicks as it's most appropriate
    return trackEvent(FacebookEventName.CONTACT, {
      ...options,
      customData: {
        ...options.customData,
        contentType: 'phone_call',
      },
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
