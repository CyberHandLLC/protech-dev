'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface FacebookPixelProps {
  pixelId?: string;
}

/**
 * Facebook Pixel Component
 * 
 * Adds Facebook Pixel tracking code to the site
 * Reads the pixel ID from environment variables when not explicitly provided
 */
export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const fbPixelId = pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  
  // Don't render anything if no pixel ID is available
  if (!fbPixelId) {
    console.warn('Facebook Pixel ID not provided. Add NEXT_PUBLIC_FACEBOOK_PIXEL_ID to your environment variables.');
    return null;
  }

  return (
    <>
      {/* Facebook Pixel Base Code */}
      <Script id="facebook-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${fbPixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      
      {/* Fallback noscript pixel */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }} 
          src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
