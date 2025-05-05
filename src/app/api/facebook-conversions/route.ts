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
  external_id?: string;
  subscription_id?: string;
  fb_login_id?: string;
  lead_id?: string;
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
  event: ConversionEvent;
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
  const accessToken = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
  // Using hardcoded pixel ID from the Meta Pixel implementation
  const pixelId = '1201375401668813';
  
  if (!accessToken) {
    throw new Error('Facebook Conversions API token not configured');
  }
  
  const url = `https://graph.facebook.com/v17.0/${pixelId}/events`;
  
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
  
  return response.json();
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
    const { event } = body;
    
    // Hash any PII data if not already hashed
    if (event.user_data.em && !event.user_data.em.includes('$')) {
      event.user_data.em = await hashData(event.user_data.em);
    }
    
    if (event.user_data.ph && !event.user_data.ph.includes('$')) {
      event.user_data.ph = await hashData(event.user_data.ph);
    }
    
    if (event.user_data.fn && !event.user_data.fn.includes('$')) {
      event.user_data.fn = await hashData(event.user_data.fn);
    }
    
    if (event.user_data.ln && !event.user_data.ln.includes('$')) {
      event.user_data.ln = await hashData(event.user_data.ln);
    }
    
    // Add client info to user_data if not provided
    if (!event.user_data.client_ip_address) {
      event.user_data.client_ip_address = ipAddress;
    }
    
    if (!event.user_data.client_user_agent) {
      event.user_data.client_user_agent = userAgent;
    }
    
    // Set event_time to now if not provided
    if (!event.event_time) {
      event.event_time = Math.floor(Date.now() / 1000);
    }
    
    // Set action_source if not provided
    if (!event.action_source) {
      event.action_source = 'website';
    }
    
    // Send the event to Facebook
    const result = await sendToFacebook(event);
    
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error sending conversion event:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
