import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';
import { headers as nextHeaders } from 'next/headers';

/**
 * Debug API route to see all geolocation information
 * This is helpful for understanding what Vercel is detecting
 */
export async function GET(request: Request) {
  // Only enable in development or when specifically allowed
  if (process.env.NODE_ENV !== 'development' && process.env.ENABLE_DEBUG !== 'true') {
    return NextResponse.json({
      error: 'Debug endpoints are only available in development mode',
      env: process.env.NODE_ENV
    }, { status: 403 });
  }
  
  try {
    // Get Vercel's geolocation data
    const geoData = geolocation(request);
    
    // Get request headers
    const requestHeadersObj: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      requestHeadersObj[key] = value;
    });
    
    // Get all Next.js headers for debugging
    const nextHeadersObj = await nextHeaders();
    const allHeaders: Record<string, string> = {};
    for (const [key, value] of nextHeadersObj.entries()) {
      allHeaders[key] = value;
    }
    
    return NextResponse.json({
      success: true,
      vercel: {
        geolocation: geoData,
      },
      request: {
        url: request.url,
        headers: requestHeadersObj
      },
      nextHeaders: {
        headers: allHeaders
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
