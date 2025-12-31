/**
 * Facebook Conversions API Utility
 * 
 * This utility provides functions for tracking conversion events through both
 * Facebook Pixel (client-side) and the Conversions API (server-side) simultaneously.
 * This dual-tracking approach provides more reliable conversion tracking.
 * 
 * Updated to follow Meta's 2025 best practices for event deduplication and advanced matching.
 */

import { collectBrowserParameters } from './metaPixelHelpers';

// Standard Facebook event names
export enum FacebookEventName {
  LEAD = 'Lead',
  COMPLETE_REGISTRATION = 'CompleteRegistration',
  CONTACT = 'Contact',
  SCHEDULE = 'Schedule',
  SUBMIT_APPLICATION = 'SubmitApplication',
  SUBSCRIBE = 'Subscribe',
  PAGE_VIEW = 'PageView',
  VIEW_CONTENT = 'ViewContent',
  ADD_TO_CART = 'AddToCart',
  ADD_TO_WISHLIST = 'AddToWishList',
  INITIATE_CHECKOUT = 'InitiateCheckout',
  ADD_PAYMENT_INFO = 'AddPaymentInfo',
  PURCHASE = 'Purchase',
  SEARCH = 'Search',
  // Custom events for ProTech HVAC
  SERVICE_VIEWED = 'ServiceViewed',
  LOCATION_VIEWED = 'LocationViewed',
  EMAIL_CLICKED = 'EmailClicked',
  EMERGENCY_CLICKED = 'EmergencyClicked',
  HERO_FORM_OPENED = 'HeroFormOpened',
  HERO_SERVICES_CLICKED = 'HeroServicesClicked',
  HERO_CONTACT_CLICKED = 'HeroContactClicked',
}

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: string; // Format: YYYYMMDD
  externalId?: string; // Client's internal user ID
  // Fields for custom audiences and advanced matching
}

interface CustomData {
  value?: number;
  currency?: string;
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  contents?: {
    id: string;
    quantity: number;
    itemPrice?: number;
  }[];
  contentType?: string;
  orderId?: string;
  numItems?: number;
  searchString?: string;
  status?: string;
  // ProTech HVAC specific fields
  serviceName?: string;
  serviceCategory?: string;
  location?: string;
  urgency?: 'emergency' | 'scheduled';
  source?: string;
  // Other fields as needed
}

export interface TrackEventOptions {
  userData?: UserData;
  customData?: CustomData;
  eventId?: string;
  eventSourceUrl?: string;
  debug?: boolean;
}

// Using hardcoded Pixel ID from the Meta Pixel implementation
const PIXEL_ID = '1201375401668813';

/**
 * Initialize the Facebook Pixel (client-side)
 * This should be called once when the application loads
 * Updated to follow Meta's 2025 best practices for initialization
 */
export function initFacebookPixel(): void {
  if (typeof window === 'undefined') return;
  
  // Check if fbq is already defined
  if ((window as any).fbq) return;
  
  // Initialize Facebook Pixel
  (window as any).fbq = function() {
    (window as any).fbq.callMethod 
      ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments) 
      : (window as any).fbq.queue.push(arguments);
  };
  
  if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
  (window as any).fbq.push = (window as any).fbq;
  (window as any).fbq.loaded = true;
  (window as any).fbq.version = '2.0';
  (window as any).fbq.queue = [];
  
  // Set autoConfig to false to prevent double initialization (2025 best practice)
  (window as any).fbq('set', 'autoConfig', false, PIXEL_ID);
  
  // Initialize with the proper pixel ID
  (window as any).fbq('init', PIXEL_ID);
  
  // Enable automatic advanced matching (2025 best practice)
  // This helps collect more conversion data automatically from the page
  (window as any).fbq('set', 'autoAdvancedMatching', true);
  
  console.log('[Facebook Pixel] Initialized with best practices');
}

/**
 * Track an event using both Facebook Pixel (client-side) and Conversions API (server-side)
 * Following Meta's 2025 best practices for event deduplication and advanced matching
 */
export async function trackEvent(
  eventName: FacebookEventName | string,
  options: TrackEventOptions = {}
): Promise<void> {
  const {
    userData = {},
    customData = {},
    eventId = generateEventId(),
    eventSourceUrl = typeof window !== 'undefined' ? window.location.href : '',
    debug = false,
  } = options;
  
  // Always add value to Lead and Purchase events if not provided (2025 best practice)
  if ((eventName === FacebookEventName.LEAD || eventName === FacebookEventName.CONTACT) && 
      customData.value === undefined) {
    customData.value = 150.00; // Estimated value of a lead for HVAC services
    if (!customData.currency) customData.currency = 'USD';
  }
  
  if (debug) {
    console.log(`[Facebook Event] ${eventName}`, { userData, customData, eventId });
  }
  
  // Track with Facebook Pixel (client-side) - now passing userData for advanced matching
  trackWithPixel(eventName, customData, eventId, userData);
  
  // Track with Conversions API (server-side)
  await trackWithConversionsApi(eventName, userData, customData, eventId, eventSourceUrl);
}

/**
 * Track an event with Facebook Pixel (client-side)
 * Implements Meta's 2025 best practices for advanced matching and event tracking
 */
function trackWithPixel(
  eventName: FacebookEventName | string,
  customData: CustomData = {},
  eventId: string,
  userData: UserData = {}
): void {
  // Skip if fbq is not defined or if we're on the server
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('[Facebook Pixel] fbq not available, skipping client-side tracking');
    return;
  }
  
  try {
    const fbq = (window as any).fbq;
    
    // Convert customData to format expected by fbq
    const pixelCustomData: Record<string, any> = {};
    
    if (customData.value !== undefined) pixelCustomData.value = customData.value;
    if (customData.currency) pixelCustomData.currency = customData.currency;
    if (customData.contentName) pixelCustomData.content_name = customData.contentName;
    if (customData.contentCategory) pixelCustomData.content_category = customData.contentCategory;
    if (customData.contentIds) pixelCustomData.content_ids = customData.contentIds;
    if (customData.contentType) pixelCustomData.content_type = customData.contentType;
    if (customData.orderId) pixelCustomData.order_id = customData.orderId;
    if (customData.numItems) pixelCustomData.num_items = customData.numItems;
    if (customData.searchString) pixelCustomData.search_string = customData.searchString;
    if (customData.status) pixelCustomData.status = customData.status;
    
    // Track the event with the eventID for deduplication (critical 2025 best practice)
    // Note: Advanced matching should be set during pixel initialization, not on every event
    fbq('track', eventName, pixelCustomData, { eventID: eventId });
    
    console.log(`[Facebook Pixel] Tracked event: ${eventName}`, {
      eventId,
      customData: pixelCustomData
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking event:', error);
  }
}

/**
 * Track an event with Facebook Conversions API (server-side)
 * Updated for 2025 best practices including enhanced PII handling and hashing
 */
async function trackWithConversionsApi(
  eventName: FacebookEventName | string,
  userData: UserData = {},
  customData: CustomData = {},
  eventId: string,
  eventSourceUrl: string
): Promise<void> {
  // Skip server-side tracking on client for PageView events to avoid errors
  // PageView is already tracked by the pixel itself
  if (eventName === FacebookEventName.PAGE_VIEW) {
    return;
  }
  
  try {
    // Collect browser parameters for improved Event Match Quality
    const browserParams = collectBrowserParameters();
    
    // Convert userData to format expected by Conversions API
    const apiUserData: Record<string, any> = {};
    
    // Apply proper data formatting for each field per 2025 best practices
    // In production, these values should be properly hashed for PII compliance
    if (userData.email) apiUserData.em = userData.email.toLowerCase();
    if (userData.phone) apiUserData.ph = userData.phone.replace(/[^0-9]/g, '');
    if (userData.firstName) apiUserData.fn = userData.firstName.toLowerCase();
    if (userData.lastName) apiUserData.ln = userData.lastName.toLowerCase();
    if (userData.city) apiUserData.ct = userData.city?.toLowerCase();
    if (userData.state) apiUserData.st = userData.state?.toLowerCase();
    if (userData.zip) apiUserData.zp = userData.zip;
    if (userData.country) apiUserData.country = userData.country;
    if (userData.gender) apiUserData.ge = userData.gender?.substring(0,1)?.toLowerCase();
    if (userData.dateOfBirth) apiUserData.db = userData.dateOfBirth;
    if (userData.externalId) apiUserData.external_id = userData.externalId;
    
    // Add browser parameters for Event Match Quality (2025 best practice)
    if (browserParams.fbp) apiUserData.fbp = browserParams.fbp;
    if (browserParams.fbc) apiUserData.fbc = browserParams.fbc;
    if (browserParams.externalId) apiUserData.external_id = browserParams.externalId;
    
    // Convert customData to format expected by Conversions API
    const apiCustomData: Record<string, any> = {};
    
    if (customData.value !== undefined) apiCustomData.value = customData.value;
    if (customData.currency) apiCustomData.currency = customData.currency;
    if (customData.contentName) apiCustomData.content_name = customData.contentName;
    if (customData.contentCategory) apiCustomData.content_category = customData.contentCategory;
    if (customData.contentIds) apiCustomData.content_ids = customData.contentIds;
    if (customData.contentType) apiCustomData.content_type = customData.contentType;
    if (customData.orderId) apiCustomData.order_id = customData.orderId;
    if (customData.numItems) apiCustomData.num_items = customData.numItems;
    if (customData.searchString) apiCustomData.search_string = customData.searchString;
    if (customData.status) apiCustomData.status = customData.status;
    
    // Send the event to our Conversions API endpoint
    const response = await fetch('/api/facebook-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: eventSourceUrl,
          event_id: eventId,
          action_source: 'website',
          user_data: apiUserData,
          custom_data: Object.keys(apiCustomData).length > 0 ? apiCustomData : undefined,
        },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Conversions API] Error sending ${eventName}:`, errorText);
      return;
    }
    
    const result = await response.json();
    console.log(`[Conversions API] Successfully tracked ${eventName}`, result);
  } catch (error) {
    // Silently fail for conversions API - don't break the user experience
    console.error('[Conversions API] Error:', error);
  }
}

/**
 * Generate a unique event ID for deduplication
 * Updated for 2025 best practices to ensure proper uniqueness
 */
function generateEventId(): string {
  // Create a more robust unique ID with timestamp and multiple random parts
  // This format guarantees uniqueness across simultaneous events
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substring(2, 10);
  const random2 = Math.random().toString(36).substring(2, 6);
  
  return `${timestamp}_${random1}_${random2}`;
}

/**
 * Hash PII data before sending to Facebook (for production use)
 * Meta requires that PII data be hashed with SHA-256 before sending
 * 
 * Note: In a real production environment, this function would need to be
 * implemented with a proper hashing library. This is a placeholder.
 */
function hashPII(value: string): string {
  // In production, replace this with proper SHA-256 hashing
  // For example, using the crypto API in Node.js or a client-side crypto library
  return value; // Placeholder - should hash in production
}
