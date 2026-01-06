/**
 * Hash Customer Data for Meta Pixel
 * 
 * Meta requires customer information to be hashed using SHA-256 before sending
 * This improves Event Match Quality (EMQ) for better ad targeting and attribution
 */

/**
 * Hash a string using SHA-256
 * @param value - The value to hash
 * @returns Hashed value in hex format
 */
async function sha256(value: string): Promise<string> {
  // Normalize: lowercase and trim whitespace
  const normalized = value.toLowerCase().trim();
  
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Hash customer data for Meta Pixel
 * @param data - Customer data object
 * @returns Object with hashed customer data
 */
export async function hashCustomerData(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): Promise<{
  em?: string;  // email
  ph?: string;  // phone
  fn?: string;  // first name
  ln?: string;  // last name
  ct?: string;  // city
  st?: string;  // state
  zp?: string;  // zip
  country?: string;  // country (2-letter code, not hashed)
}> {
  const hashed: any = {};
  
  // Hash email
  if (data.email) {
    hashed.em = await sha256(data.email);
  }
  
  // Hash phone (remove non-digits first)
  if (data.phone) {
    const phoneDigits = data.phone.replace(/\D/g, '');
    hashed.ph = await sha256(phoneDigits);
  }
  
  // Hash first name
  if (data.firstName) {
    hashed.fn = await sha256(data.firstName);
  }
  
  // Hash last name
  if (data.lastName) {
    hashed.ln = await sha256(data.lastName);
  }
  
  // Hash city
  if (data.city) {
    hashed.ct = await sha256(data.city);
  }
  
  // Hash state (2-letter code)
  if (data.state) {
    hashed.st = await sha256(data.state);
  }
  
  // Hash zip
  if (data.zip) {
    hashed.zp = await sha256(data.zip);
  }
  
  // Country code (not hashed, 2-letter ISO code)
  if (data.country) {
    hashed.country = data.country.toLowerCase();
  }
  
  return hashed;
}

/**
 * Extract name parts from full name
 * @param fullName - Full name string
 * @returns Object with firstName and lastName
 */
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  // First word is first name, rest is last name
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  
  return { firstName, lastName };
}

/**
 * Extract location data from location string
 * @param location - Location string (e.g., "Cleveland, OH" or "44101")
 * @returns Object with city, state, and zip
 */
export function parseLocation(location: string): { city: string; state: string; zip: string } {
  // Check if it's a zip code (5 digits)
  if (/^\d{5}$/.test(location.trim())) {
    return {
      city: '',
      state: '',
      zip: location.trim()
    };
  }
  
  const parts = location.split(',').map(p => p.trim());
  
  if (parts.length >= 2) {
    return {
      city: parts[0],
      state: parts[1],
      zip: ''
    };
  }
  
  return { city: '', state: '', zip: '' };
}
