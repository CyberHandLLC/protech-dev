'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the types for each event
interface BaseEventParams {
  eventSourceUrl?: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    externalId?: string;
  };
}

interface ContactEventParams extends BaseEventParams {
  source: string;
}

interface ViewContentEventParams extends BaseEventParams {
  contentName: string;
  contentCategory?: string;
  contentType?: string;
  value?: number;
  currency?: string;
}

interface SubscribeEventParams extends BaseEventParams {
  subscriptionId?: string;
  value?: number;
  currency?: string;
}

interface LeadEventParams extends BaseEventParams {
  leadId?: string;
  formName?: string;
  value?: number;
  currency?: string;
}

interface FindLocationEventParams extends BaseEventParams {
  locationName: string;
  searchQuery?: string;
}

interface ScheduleEventParams extends BaseEventParams {
  appointmentType: string;
  preferredTime?: string;
  value?: number;
}

interface PageViewEventParams extends BaseEventParams {
  pageUrl?: string;
  pageTitle?: string;
  pageCategory?: string;
  eventId?: string;
}

/**
 * Custom hook for sending events to Facebook Conversions API via our server endpoint
 */
export default function useFacebookServerEvents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extracts browser cookies needed for Facebook attribution
   */
  const getFacebookCookies = () => {
    if (typeof window === 'undefined') return { fbp: undefined, fbc: undefined };

    // Extract Facebook Browser ID cookie (fbp)
    const fbp = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('_fbp='))
      ?.split('=')[1];

    // Extract Facebook Click ID cookie (fbc)
    const fbc = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('_fbc='))
      ?.split('=')[1];

    return { fbp, fbc };
  };

  /**
   * Sends an event to our server API which forwards it to Facebook
   */
  const sendServerEvent = async (
    eventName: string, 
    params: Record<string, any>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { userData, ...customData } = params;
      // Generate an event ID for deduplication
      const eventId = uuidv4();
      // Get current timestamp in seconds
      const eventTime = Math.floor(Date.now() / 1000);
      // Get current page URL if not provided
      const eventSourceUrl = params.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : undefined);
      // Get Facebook cookies
      const { fbp, fbc } = getFacebookCookies();

      // Build the event object for the API
      const event = {
        event_name: eventName,
        event_time: eventTime,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        event_id: eventId,
        user_data: {
          // Include Facebook cookies if available
          fbp,
          fbc,
          // Include user data if provided - all of these will be hashed server-side
          // PII fields: email, phone, name, city, state, zip, etc.
          em: userData?.email,
          ph: userData?.phone,
          fn: userData?.firstName,
          ln: userData?.lastName,
          ge: userData?.gender,
          db: userData?.dateOfBirth,
          // These are the fields that were causing the error - make sure to use proper parameter names
          ct: userData?.city,        // City must use 'ct' parameter
          st: userData?.state,       // State must use 'st' parameter
          zp: userData?.zipCode,     // Zip code must use 'zp' parameter
          external_id: userData?.externalId,
          // Non-PII fields - don't need hashing
          client_user_agent: navigator?.userAgent,
        },
        custom_data: customData
      };

      // Send the event to our server endpoint
      const response = await fetch('/api/facebook-conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send event to Facebook');
      }

      const result = await response.json();
      console.log(`Facebook ${eventName} event sent successfully:`, result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error sending event';
      console.error(`Error sending ${eventName} event to Facebook:`, errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Track a Contact event (phone call, email, chat)
   */
  const trackContact = (params: ContactEventParams) => {
    return sendServerEvent('Contact', {
      ...params,
      content_type: 'contact',
      content_name: `Contact via ${params.source}`,
    });
  };

  /**
   * Track a ViewContent event (page view, product view)
   */
  const trackViewContent = (params: ViewContentEventParams) => {
    return sendServerEvent('ViewContent', {
      ...params,
      content_name: params.contentName,
      content_category: params.contentCategory,
      content_type: params.contentType || 'product',
    });
  };

  /**
   * Track a Subscribe event (newsletter, subscription)
   */
  const trackSubscribe = (params: SubscribeEventParams) => {
    return sendServerEvent('Subscribe', {
      ...params,
      subscription_id: params.subscriptionId,
      value: params.value,
      currency: params.currency || 'USD',
    });
  };

  /**
   * Track a Lead event (form submission)
   */
  const trackLead = (params: LeadEventParams) => {
    return sendServerEvent('Lead', {
      ...params,
      lead_id: params.leadId,
      content_name: params.formName || 'Lead Form',
      value: params.value,
      currency: params.currency || 'USD',
    });
  };

  /**
   * Track a FindLocation event (store locator)
   */
  const trackFindLocation = (params: FindLocationEventParams) => {
    return sendServerEvent('FindLocation', {
      ...params,
      content_name: params.locationName,
      search_string: params.searchQuery,
    });
  };

  /**
   * Track a Schedule event (appointment booking)
   */
  const trackSchedule = (params: ScheduleEventParams) => {
    return sendServerEvent('Schedule', {
      ...params,
      content_category: 'appointment',
      content_name: params.appointmentType,
      preferred_time: params.preferredTime,
      value: params.value,
    });
  };

  /**
   * Track a PageView event (automatically called on page navigation)
   */
  const trackPageView = (params: PageViewEventParams) => {
    return sendServerEvent('PageView', {
      ...params,
      content_name: params.pageTitle || document.title,
      content_category: params.pageCategory || 'Page',
      content_type: 'website',
      event_source_url: params.pageUrl || window.location.href
    });
  };

  return {
    isLoading,
    error,
    trackContact,
    trackViewContent,
    trackLead,
    trackSubscribe,
    trackFindLocation,
    trackSchedule,
    trackPageView,
  };
}
