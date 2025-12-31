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
            
            // Initialize pixel with enhanced advanced matching
            // Collect external ID for better Event Match Quality
            var externalId = '';
            try {
              externalId = localStorage.getItem('fb_external_id');
              if (!externalId) {
                externalId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('fb_external_id', externalId);
              }
            } catch (e) {
              externalId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            // Initialize pixel with advanced matching parameters
            fbq('init', '${PIXEL_ID}', {
              external_id: externalId,
              ct: '', // City (will be populated from forms)
              st: 'oh', // State - Ohio
              country: 'us' // Country - United States
            });
            
            // Generate unique PageView event ID and store for server-side sync
            var pageviewEventId = 'pageview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            try {
              sessionStorage.setItem('fb_pageview_event_id', pageviewEventId);
            } catch (e) {
              console.warn('[Meta Pixel] Could not store event ID:', e);
            }
            
            // Delay PageView event to ensure _fbp cookie is set
            // This improves Event Match Quality by ensuring fbp is present
            setTimeout(function() {
              fbq('track', 'PageView', {}, {
                eventID: pageviewEventId
              });
            }, 300); // 300ms delay to allow cookie to be set
            
            // Debug: Log pixel initialization
            console.log('[Meta Pixel] Loaded on:', window.location.hostname);
            
            // Debug: Check _fbp cookie after short delay
            setTimeout(function() {
              var fbpMatch = document.cookie.match(/_fbp=([^;]+)/);
              if (fbpMatch) {
                console.log('[Meta Pixel] _fbp cookie:', fbpMatch[1]);
              } else {
                console.warn('[Meta Pixel] _fbp cookie not found on', window.location.hostname);
              }
            }, 1000);
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
