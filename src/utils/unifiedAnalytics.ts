/**
 * Unified Analytics Utility
 * 
 * Centralized tracking for all analytics platforms:
 * - Meta Pixel (Facebook)
 * - Google Analytics 4
 * - Vercel Analytics (with custom events)
 * 
 * This utility provides a single interface to track events across all platforms
 */

import { track } from '@vercel/analytics';

// Event types that can be tracked
export type AnalyticsEvent = 
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'form_started'
  | 'form_completed'
  | 'lead'
  | 'schedule'
  | 'contact_page_viewed'
  | 'phone_click'
  | 'email_click'
  | 'service_viewed'
  | 'scroll_depth'
  | 'time_on_page';

// Event data structure
export interface AnalyticsEventData {
  // Common properties
  event_name: AnalyticsEvent;
  
  // Optional properties
  page_path?: string;
  page_title?: string;
  value?: number;
  currency?: string;
  
  // Form-specific
  form_name?: string;
  form_location?: string;
  service_name?: string;
  
  // Engagement-specific
  scroll_percentage?: number;
  time_seconds?: number;
  
  // Custom properties
  [key: string]: any;
}

/**
 * Track an event across all analytics platforms
 */
export function trackEvent(eventData: AnalyticsEventData): void {
  const { event_name, ...properties } = eventData;
  
  // Track to Meta Pixel
  trackToMetaPixel(event_name, properties);
  
  // Track to Google Analytics
  trackToGoogleAnalytics(event_name, properties);
  
  // Track to Vercel Analytics
  trackToVercelAnalytics(event_name, properties);
  
  // Log for debugging (remove in production if needed)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event tracked:', event_name, properties);
  }
}

/**
 * Track to Meta Pixel (Facebook)
 */
function trackToMetaPixel(eventName: AnalyticsEvent, properties: any): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    // Map our event names to Meta Pixel event names
    const metaEventMap: Record<AnalyticsEvent, string> = {
      'page_view': 'PageView',
      'session_start': 'SessionStart',
      'session_end': 'SessionEnd',
      'form_started': 'FormStarted',
      'form_completed': 'FormCompleted',
      'lead': 'Lead',
      'schedule': 'Schedule',
      'contact_page_viewed': 'ContactPageViewed',
      'phone_click': 'Contact',
      'email_click': 'Contact',
      'service_viewed': 'ViewContent',
      'scroll_depth': 'ScrollDepth',
      'time_on_page': 'TimeOnPage',
    };
    
    const metaEventName = metaEventMap[eventName];
    
    // Standard events (Lead, Schedule, ViewContent, Contact, PageView)
    const standardEvents = ['Lead', 'Schedule', 'ViewContent', 'Contact', 'PageView'];
    
    if (standardEvents.includes(metaEventName)) {
      // Track as standard event
      window.fbq('track', metaEventName, properties);
    } else {
      // Track as custom event
      window.fbq('trackCustom', metaEventName, properties);
    }
  } catch (error) {
    console.error('[Analytics] Meta Pixel tracking error:', error);
  }
}

/**
 * Track to Google Analytics 4
 */
function trackToGoogleAnalytics(eventName: AnalyticsEvent, properties: any): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  try {
    // Map our event names to GA4 event names
    const gaEventMap: Record<AnalyticsEvent, string> = {
      'page_view': 'page_view',
      'session_start': 'session_start',
      'session_end': 'session_end',
      'form_started': 'form_start',
      'form_completed': 'form_submit',
      'lead': 'generate_lead',
      'schedule': 'schedule_appointment',
      'contact_page_viewed': 'view_contact_page',
      'phone_click': 'phone_click',
      'email_click': 'email_click',
      'service_viewed': 'view_item',
      'scroll_depth': 'scroll',
      'time_on_page': 'engagement_time',
    };
    
    const gaEventName = gaEventMap[eventName];
    
    // Convert properties to GA4 format
    const gaProperties: any = {
      ...properties,
    };
    
    // Add event category for better organization
    if (!gaProperties.event_category) {
      if (['lead', 'schedule'].includes(eventName)) {
        gaProperties.event_category = 'conversion';
      } else if (['form_started', 'form_completed'].includes(eventName)) {
        gaProperties.event_category = 'engagement';
      } else if (['phone_click', 'email_click'].includes(eventName)) {
        gaProperties.event_category = 'contact';
      } else {
        gaProperties.event_category = 'interaction';
      }
    }
    
    window.gtag('event', gaEventName, gaProperties);
  } catch (error) {
    console.error('[Analytics] Google Analytics tracking error:', error);
  }
}

/**
 * Track to Vercel Analytics
 */
function trackToVercelAnalytics(eventName: AnalyticsEvent, properties: any): void {
  // Skip page_view as Vercel tracks it automatically
  if (eventName === 'page_view') return;
  
  try {
    // Map our event names to Vercel-friendly names
    const vercelEventMap: Record<AnalyticsEvent, string> = {
      'page_view': 'pageview', // Won't be used due to skip above
      'session_start': 'session_start',
      'session_end': 'session_end',
      'form_started': 'form_start',
      'form_completed': 'form_complete',
      'lead': 'lead',
      'schedule': 'schedule',
      'contact_page_viewed': 'contact_view',
      'phone_click': 'phone_click',
      'email_click': 'email_click',
      'service_viewed': 'service_view',
      'scroll_depth': 'scroll',
      'time_on_page': 'time_on_page',
    };
    
    const vercelEventName = vercelEventMap[eventName];
    
    // Limit to 8 properties max (Pro + Web Analytics Plus limit)
    // Prioritize the most important properties
    const limitedProperties: Record<string, string | number | boolean | null> = {};
    const priorityKeys = ['value', 'currency', 'form_name', 'service_name', 'page_path', 'content_category', 'phone_number', 'email'];
    
    let propertyCount = 0;
    for (const key of priorityKeys) {
      if (properties[key] !== undefined && propertyCount < 8) {
        // Ensure values are allowed types (string, number, boolean, null)
        const value = properties[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
          limitedProperties[key] = value;
          propertyCount++;
        }
      }
    }
    
    // Track the event
    track(vercelEventName, limitedProperties);
  } catch (error) {
    console.error('[Analytics] Vercel Analytics tracking error:', error);
  }
}

/**
 * Helper function to track page views
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent({
    event_name: 'page_view',
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Helper function to track form submissions
 */
export function trackFormSubmission(formName: string, serviceName?: string): void {
  // Track form completed
  trackEvent({
    event_name: 'form_completed',
    form_name: formName,
    service_name: serviceName,
  });
  
  // Track lead conversion
  trackEvent({
    event_name: 'lead',
    value: 100,
    currency: 'USD',
    form_name: formName,
    service_name: serviceName,
  });
  
  // Track schedule conversion
  trackEvent({
    event_name: 'schedule',
    value: 150,
    currency: 'USD',
    form_name: formName,
    service_name: serviceName,
  });
}

/**
 * Helper function to track phone clicks
 */
export function trackPhoneClick(phoneNumber: string): void {
  trackEvent({
    event_name: 'phone_click',
    phone_number: phoneNumber,
  });
}

/**
 * Helper function to track email clicks
 */
export function trackEmailClick(email: string): void {
  trackEvent({
    event_name: 'email_click',
    email: email,
  });
}

/**
 * Helper function to track service page views
 */
export function trackServiceView(serviceName: string, category?: string): void {
  trackEvent({
    event_name: 'service_viewed',
    service_name: serviceName,
    content_category: category,
  });
}

/**
 * Get analytics status (for debugging)
 */
export function getAnalyticsStatus(): {
  metaPixel: boolean;
  googleAnalytics: boolean;
  vercelAnalytics: boolean;
} {
  return {
    metaPixel: typeof window !== 'undefined' && !!window.fbq,
    googleAnalytics: typeof window !== 'undefined' && !!window.gtag,
    vercelAnalytics: true, // Vercel Analytics is always active (custom events via track function)
  };
}

/**
 * Log analytics status to console (for debugging)
 */
export function logAnalyticsStatus(): void {
  const status = getAnalyticsStatus();
  console.log('[Analytics] Platform Status:', {
    'Meta Pixel (Facebook)': status.metaPixel ? '✅ Active' : '❌ Not loaded',
    'Google Analytics': status.googleAnalytics ? '✅ Active' : '❌ Not loaded',
    'Vercel Analytics': status.vercelAnalytics ? '✅ Active' : '❌ Not loaded',
  });
}
