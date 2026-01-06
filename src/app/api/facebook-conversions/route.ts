import { NextRequest, NextResponse } from 'next/server';

// Types based on Facebook's Conversions API parameters
interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_source_url?: string;
  action_source: string;
  event_id?: string;
  user_data: UserData;
  custom_data?: CustomData;
}

interface UserData {
  client_ip_address?: string;
  client_user_agent?: string;
  em?: string; // Hashed email
  ph?: string; // Hashed phone
  fn?: string; // Hashed first name
  ln?: string; // Hashed last name
  ct?: string; // Hashed city
  st?: string; // Hashed state
  zp?: string; // Hashed zip code
  external_id?: string;
  subscription_id?: string;
  fb_login_id?: string;
  lead_id?: string;
  // Facebook's browser ID cookie parameter - should not be hashed
  fbp?: string;
  // Facebook's click ID cookie parameter - should not be hashed
  fbc?: string;
  // Can include other fields as needed
}

interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: {
    id: string;
    quantity: number;
    item_price?: number;
  }[];
  content_type?: string;
  order_id?: string;
  predicted_ltv?: number;
  num_items?: number;
  search_string?: string;
  status?: string;
  // Can include other fields as needed
}

interface RequestBody {
  event?: ConversionEvent;
  events?: ConversionEvent[];
  // Can include additional info as needed
}

/**
 * Hash a string using SHA-256
 * This is required for PII data sent to Facebook's Conversions API
 */
async function hashData(input: string): Promise<string> {
  // Convert the input string to lowercase and remove whitespace
  const normalizedInput = input.toLowerCase().trim();
  
  // Create a hash of the input using SHA-256
  const msgBuffer = new TextEncoder().encode(normalizedInput);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Send event to Facebook Conversions API
 */
async function sendToFacebook(event: ConversionEvent): Promise<any> {
  // Hardcoded access token from Facebook
  const accessToken = 'EAAXiuUbOb9wBO3XOp9m6aetBCZAuyaSLvlzTJKwHNcwbKy6tVKMmgg74ygJD1Qm9Y5T6pSyipGgZABpEZBqzeZACUuu7P1d3pgKPlgHkZA6qNZCvjBmH5y9DJCZCLzWSqTpD7MVsQOUYRlxZAZB2KSpoMCdu8mWFxTwsU63dG4S1tRrSAp7dAZBKjEDjqSC5NifoCTTQZDZD';
  // Using hardcoded pixel ID from the Meta Pixel implementation
  const pixelId = '1201375401668813';
  
  // Using latest API version v18.0
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [event],
      access_token: accessToken,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Facebook Conversions API error: ${errorText}`);
  }
  
  // Handle empty or invalid JSON responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text && text.trim().length > 0) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse Facebook API response:', text);
        return { success: true, rawResponse: text };
      }
    }
  }
  
  return { success: true };
}

/**
 * API Route handler for Facebook Conversions API
 */
export async function POST(req: NextRequest) {
  try {
    // Extract client information
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';
    
    // Get the conversion event data from request body
    const body: RequestBody = await req.json();
    const { event, events } = body;
    
    // Support both single event and multiple events
    const eventsToProcess = events || (event ? [event] : []);
    
    // Validate event data
    if (eventsToProcess.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required event data'
      }, { status: 400 });
    }
    
    // Process each event
    const results = [];
    for (const evt of eventsToProcess) {
      if (!evt.event_name) {
        continue;
      }
      
      // Initialize user_data if not present
      if (!evt.user_data) {
        evt.user_data = {};
      }
      
      // Hash any PII data if not already hashed
      // Note: Data from client is already hashed, but we check to be safe
      if (evt.user_data.em && !evt.user_data.em.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.em = await hashData(evt.user_data.em);
      }
      
      if (evt.user_data.ph && !evt.user_data.ph.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.ph = await hashData(evt.user_data.ph);
      }
      
      if (evt.user_data.fn && !evt.user_data.fn.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.fn = await hashData(evt.user_data.fn);
      }
      
      if (evt.user_data.ln && !evt.user_data.ln.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.ln = await hashData(evt.user_data.ln);
      }
      
      if (evt.user_data.ct && !evt.user_data.ct.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.ct = await hashData(evt.user_data.ct);
      }
      
      if (evt.user_data.st && !evt.user_data.st.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.st = await hashData(evt.user_data.st);
      }
      
      if (evt.user_data.zp && !evt.user_data.zp.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.zp = await hashData(evt.user_data.zp);
      }
      
      if (evt.user_data.external_id && !evt.user_data.external_id.match(/^[a-f0-9]{64}$/)) {
        evt.user_data.external_id = await hashData(evt.user_data.external_id);
      }
      
      // Add client info to user_data if not provided
      if (!evt.user_data.client_ip_address) {
        evt.user_data.client_ip_address = ipAddress;
      }
      
      if (!evt.user_data.client_user_agent) {
        evt.user_data.client_user_agent = userAgent;
      }
      
      // Set event_time to now if not provided
      if (!evt.event_time) {
        evt.event_time = Math.floor(Date.now() / 1000);
      }
      
      // Set action_source if not provided
      if (!evt.action_source) {
        evt.action_source = 'website';
      }
      
      // Send the event to Facebook
      const result = await sendToFacebook(evt);
      results.push(result);
    }
    
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error sending conversion event:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
