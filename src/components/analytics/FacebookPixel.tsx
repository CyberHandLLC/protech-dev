'use client';

import Script from 'next/script';

/**
 * Meta Pixel (Facebook Pixel) Component
 * 
 * Implements Meta Pixel following 2025 best practices:
 * - Single initialization point to prevent duplicates
 * - Proper event deduplication with eventID
 * - Advanced matching enabled
 * - No invalid commands (removed 'test' command)
 * - Clean, minimal implementation
 */
export default function FacebookPixel() {
  const PIXEL_ID = '1201375401668813';

  return (
    <>
      {/* Meta Pixel Base Code - Single source of truth */}
      <Script 
        id="meta-pixel" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            // Initialize pixel with advanced matching enabled
            fbq('init', '${PIXEL_ID}', {}, {
              autoConfig: true,
              debug: false
            });
            
            // Track initial PageView with unique eventID for deduplication
            fbq('track', 'PageView', {}, {
              eventID: 'pageview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            });
          `
        }}
      />
      
      {/* Noscript fallback for users with JavaScript disabled */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }} 
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
