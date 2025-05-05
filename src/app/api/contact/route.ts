import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Specify Node.js runtime for Twilio compatibility
export const runtime = 'nodejs';

// Validate environment variables at module load time
const validateEnvVars = () => {
  const requiredVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'OWNER_PHONE_NUMBER'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Create a Twilio client when needed, not on module load
const getClient = () => {
  if (!validateEnvVars()) {
    throw new Error('Missing required environment variables for Twilio');
  }
  
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
};

// Format contact data into a message string
function formatContactMessage(data: any, formSource: string): string {
  let message = `New ${formSource} Form Submission:\n\n`;
  
  // Always include these fields if they exist
  if (data.name) message += `Name: ${data.name}\n`;
  if (data.phone) message += `Phone: ${data.phone}\n`;
  if (data.email) message += `Email: ${data.email}\n`;
  if (data.service) message += `Service: ${data.service}\n`;
  if (data.location) message += `Location: ${data.location}\n`;
  if (data.message) message += `Message: ${data.message}\n`;
  
  message += `\nReceived: ${new Date().toLocaleString()}`;
  return message;
}

// Rate limit information for Vercel
export const maxDuration = 10; // Maximum execution time in seconds

/**
 * Request body type definition for better type safety
 */
type ContactRequest = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  location?: string;
  message?: string;
  source?: string;
};

/**
 * Validate contact form request body
 */
function validateContactRequest(data: any): data is ContactRequest {
  // Check if data exists and is an object
  if (!data || typeof data !== 'object') return false;
  
  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') return false;
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim() === '') return false;
  
  // Optional fields validation if present
  if (data.email !== undefined && (typeof data.email !== 'string' || data.email.trim() === '')) return false;
  if (data.service !== undefined && typeof data.service !== 'string') return false;
  if (data.location !== undefined && typeof data.location !== 'string') return false;
  if (data.message !== undefined && typeof data.message !== 'string') return false;
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Basic request validation
    if (request.method !== 'POST') {
      return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
    }
    
    // Parse and validate request body
    let data;
    try {
      data = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
    
    // Validate contact form data
    if (!validateContactRequest(data)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid form data. Name and phone are required fields.' 
      }, { status: 400 });
    }
    
    const formSource = data.source || 'Contact';

    // Format the message
    const messageBody = formatContactMessage(data, formSource);
    
    if (!process.env.TWILIO_PHONE_NUMBER || !process.env.OWNER_PHONE_NUMBER) {
      console.error('Missing Twilio phone numbers');
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error' 
      }, { status: 500 });
    }

    // Send SMS via Twilio
    const client = getClient();
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.OWNER_PHONE_NUMBER!
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send message',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
