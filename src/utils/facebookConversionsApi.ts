/**
 * Facebook Conversions API Utility
 * 
 * This utility provides functions for tracking conversion events through both
 * Facebook Pixel (client-side) and the Conversions API (server-side) simultaneously.
 * This dual-tracking approach provides more reliable conversion tracking.
 */

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
}

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  // Other fields as needed
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
  
  (window as any).fbq('init', PIXEL_ID);
}

/**
 * Track an event using both Facebook Pixel (client-side) and Conversions API (server-side)
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
  
  if (debug) {
    console.log(`[Facebook Event] ${eventName}`, { userData, customData, eventId });
  }
  
  // Track with Facebook Pixel (client-side)
  trackWithPixel(eventName, customData, eventId);
  
  // Track with Conversions API (server-side)
  await trackWithConversionsApi(eventName, userData, customData, eventId, eventSourceUrl);
}

/**
 * Track an event with Facebook Pixel (client-side)
 */
function trackWithPixel(
  eventName: FacebookEventName | string,
  customData: CustomData = {},
  eventId: string
): void {
  if (typeof window === 'undefined') return;
  
  const fbq = (window as any).fbq;
  
  if (!fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }
  
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
  
  // Track the event
  fbq('track', eventName, pixelCustomData, { eventID: eventId });
}

/**
 * Track an event with Facebook Conversions API (server-side)
 */
async function trackWithConversionsApi(
  eventName: FacebookEventName | string,
  userData: UserData = {},
  customData: CustomData = {},
  eventId: string,
  eventSourceUrl: string
): Promise<void> {
  try {
    // Convert userData to format expected by Conversions API
    const apiUserData: Record<string, any> = {};
    
    if (userData.email) apiUserData.em = userData.email;
    if (userData.phone) apiUserData.ph = userData.phone;
    if (userData.firstName) apiUserData.fn = userData.firstName;
    if (userData.lastName) apiUserData.ln = userData.lastName;
    
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
      console.error(`Error sending conversion event: ${errorText}`);
    }
  } catch (error) {
    console.error('Error sending conversion event:', error);
  }
}

/**
 * Generate a unique event ID for deduplication
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
