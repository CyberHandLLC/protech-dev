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

  /**
   * Track when user views a specific HVAC service page
   */
  const trackServiceViewed = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    const serviceName = options?.customData?.serviceName || 'Unknown Service';
    
    if (!trackGlobalEvent('service_viewed', serviceName)) {
      console.log(`Service viewed event throttled: ${serviceName}`);
      return false;
    }
    
    return trackEvent(FacebookEventName.SERVICE_VIEWED, options);
  };

  /**
   * Track when user views a service area/location page
   */
  const trackLocationViewed = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    const location = options?.customData?.location || 'Unknown Location';
    
    if (!trackGlobalEvent('location_viewed', location)) {
      console.log(`Location viewed event throttled: ${location}`);
      return false;
    }
    
    return trackEvent(FacebookEventName.LOCATION_VIEWED, options);
  };

  /**
   * Track when user clicks an email link
   */
  const trackEmailClicked = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    const source = options?.customData?.source || 'Website';
    
    if (!trackGlobalEvent('email_clicked', source)) {
      console.log(`Email clicked event throttled: ${source}`);
      return false;
    }
    
    return trackEvent(FacebookEventName.EMAIL_CLICKED, options);
  };

  /**
   * Track when user clicks emergency service button or visits emergency page
   */
  const trackEmergencyClicked = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    const service = options?.customData?.serviceName || 'Emergency Service';
    
    if (!trackGlobalEvent('emergency_clicked', service)) {
      console.log(`Emergency clicked event throttled: ${service}`);
      return false;
    }
    
    return trackEvent(FacebookEventName.EMERGENCY_CLICKED, options);
  };

  /**
   * Track when user opens form in hero section
   */
  const trackHeroFormOpened = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    if (!trackGlobalEvent('hero_form_opened', 'hero_form')) {
      console.log('Hero form opened event throttled');
      return false;
    }
    
    return trackEvent(FacebookEventName.HERO_FORM_OPENED, options);
  };

  /**
   * Track when user clicks services button in hero section
   */
  const trackHeroServicesClicked = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    if (!trackGlobalEvent('hero_services_clicked', 'hero_services')) {
      console.log('Hero services clicked event throttled');
      return false;
    }
    
    return trackEvent(FacebookEventName.HERO_SERVICES_CLICKED, options);
  };

  /**
   * Track when user clicks contact button in hero section
   */
  const trackHeroContactClicked = async (options: Omit<TrackEventOptions, 'eventId'> = {}) => {
    if (!trackGlobalEvent('hero_contact_clicked', 'hero_contact')) {
      console.log('Hero contact clicked event throttled');
      return false;
    }
    
    return trackEvent(FacebookEventName.HERO_CONTACT_CLICKED, options);
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
    trackPageView,
    // New ProTech-specific events
    trackServiceViewed,
    trackLocationViewed,
    trackEmailClicked,
    trackEmergencyClicked,
    trackHeroFormOpened,
    trackHeroServicesClicked,
    trackHeroContactClicked,
  };
}
