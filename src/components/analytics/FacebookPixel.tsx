'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Facebook Pixel Component
 * 
 * Implements the Facebook Pixel directly in the site
 * Uses the hardcoded pixel ID from Facebook Meta Pixel implementation
 */
export default function FacebookPixel() {
  // Using the exact pixel ID from the Facebook code snippet
  const fbPixelId = '1201375401668813';

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
          
          // Add test event code for Facebook's Test Events tool
          if (typeof window !== 'undefined') {
            window.fbq('set', 'autoConfig', false, '${fbPixelId}');
            window.fbq('set', 'agent', 'tmgoogletagmanager', '${fbPixelId}');
            window.fbq('set', 'experimentsConfig', {}, '${fbPixelId}');
            
            // This is the test event code from your Facebook Test Events tool
            window.fbq('test', '${fbPixelId}', 'TEST69110');
          }
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
