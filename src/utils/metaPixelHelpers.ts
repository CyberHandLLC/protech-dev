/**
 * Meta Pixel Helper Utilities
 * 
 * Utilities to improve Event Match Quality by capturing browser cookies
 * and URL parameters for better event attribution.
 * 
 * Following Meta's 2025 best practices for Click ID (fbc) and Browser ID (fbp)
 */

/**
 * Get the Facebook Browser ID (fbp) cookie
 * This is the _fbp cookie that Meta Pixel sets automatically
 * 
 * @returns The fbp value or null if not found
 */
export function getFacebookBrowserId(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') {
      return value;
    }
  }
  return null;
}

/**
 * Get the Facebook Click ID (fbc) from URL or cookie
 * This tracks when someone clicks a Facebook ad
 * 
 * Priority:
 * 1. Check URL for fbclid parameter
 * 2. Check _fbc cookie
 * 
 * @returns The fbc value or null if not found
 */
export function getFacebookClickId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // First, check URL for fbclid parameter
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  
  if (fbclid) {
    // Format: fb.1.timestamp.fbclid
    const timestamp = Date.now();
    const fbc = `fb.1.${timestamp}.${fbclid}`;
    
    // Get root domain (e.g., protech-ohio.com from www.protech-ohio.com)
    const hostname = window.location.hostname;
    const rootDomain = hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    
    // Store in cookie for future use (90 days) with root domain
    // This allows cookie to work on both www and non-www
    document.cookie = `_fbc=${fbc}; max-age=7776000; path=/; domain=.${rootDomain}`;
    
    return fbc;
  }
  
  // If not in URL, check cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') {
      return value;
    }
  }
  
  return null;
}

/**
 * Get user's IP address from client-side
 * Note: This is limited on client-side, server-side is more reliable
 * 
 * @returns Promise with IP address or null
 */
export async function getClientIpAddress(): Promise<string | null> {
  try {
    // This would need a server endpoint or third-party service
    // For now, return null and let server-side handle it
    return null;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
}

/**
 * Get user agent string
 * 
 * @returns User agent string or null
 */
export function getUserAgent(): string | null {
  if (typeof navigator === 'undefined') return null;
  return navigator.userAgent || null;
}

/**
 * Extract external ID from user session/storage
 * This could be your internal user ID if user is logged in
 * 
 * @returns External ID or null
 */
export function getExternalId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage for user ID
  try {
    const userId = localStorage.getItem('user_id');
    return userId;
  } catch (error) {
    return null;
  }
}

/**
 * Collect all available browser parameters for Event Match Quality
 * This function gathers all the data Meta needs for better attribution
 * 
 * @returns Object with all available parameters
 */
export function collectBrowserParameters() {
  return {
    fbp: getFacebookBrowserId(),
    fbc: getFacebookClickId(),
    userAgent: getUserAgent(),
    externalId: getExternalId(),
  };
}

/**
 * Check if user came from a Facebook ad
 * 
 * @returns true if fbclid is in URL
 */
export function isFromFacebookAd(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('fbclid');
}
