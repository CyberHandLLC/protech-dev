'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';

/**
 * Facebook Pixel Component
 * 
 * Implements the Facebook Pixel directly in the site
 * Uses the hardcoded pixel ID from Facebook Meta Pixel implementation
 */
export default function FacebookPixel() {
  // Using the exact pixel ID from the Facebook code snippet
  const fbPixelId = '1201375401668813';

  // Add inline initialization to ensure pixel loads even if the Script component fails
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Force initialization and PageView tracking
      const initPixel = () => {
        // Initialize fbq if needed
        if (!(window as any).fbq) {
          console.log('Initializing Facebook Pixel directly from useEffect');
          (window as any).fbq = function() {
            (window as any).fbq.callMethod ? 
              (window as any).fbq.callMethod.apply((window as any).fbq, arguments) : 
              (window as any).fbq.queue.push(arguments);
          };
          
          if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
          (window as any).fbq.push = (window as any).fbq;
          (window as any).fbq.loaded = true;
          (window as any).fbq.version = '2.0';
          (window as any).fbq.queue = [];
        }
        
        // Initialize with your Pixel ID (even if already done, this is safe)
        (window as any).fbq('init', fbPixelId);
        
        // Explicitly track PageView with debug info
        console.log('Manually firing PageView event');
        (window as any).fbq('track', 'PageView', {}, {eventID: `pv_${Date.now()}`});
        
        // Add test event code
        (window as any).fbq('set', 'autoConfig', false, fbPixelId);
        (window as any).fbq('test', fbPixelId, 'TEST69110');
      };
      
      // Load the Facebook Pixel script if not already loaded
      if (!document.getElementById('fb-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'fb-pixel-script';
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.onload = () => {
          console.log('Facebook Pixel script loaded');
          initPixel();
        };
        document.head.appendChild(script);
      } else {
        // Script already loaded, just initialize
        initPixel();
      }
      
      // Ensure PageView is fired, even if delayed
      setTimeout(() => {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'PageView', {}, {eventID: `pv_delayed_${Date.now()}`});
          console.log('Delayed PageView fired as backup');
        }
      }, 1500);
    } catch (error) {
      console.error('Error initializing Facebook Pixel:', error);
    }
    
    // Add fallback noscript pixel as well
    try {
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`;
      img.alt = '';
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    } catch (e) {
      console.error('Error adding noscript pixel:', e);
    }
    
  }, [fbPixelId]);

  return (
    <>
      {/* Facebook Pixel Base Code */}
      <Script id="facebook-pixel-base" strategy="beforeInteractive">
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
          fbq('track', 'PageView', {}, {eventID: 'pv_init_script'});
          
          // Add test event code for Facebook's Test Events tool
          if (typeof window !== 'undefined') {
            window.fbq('set', 'autoConfig', false, '${fbPixelId}');
            window.fbq('set', 'agent', 'tmgoogletagmanager', '${fbPixelId}');
            
            // This is the test event code from your Facebook Test Events tool
            window.fbq('test', '${fbPixelId}', 'TEST69110');
            console.log('Facebook Pixel script loaded with explicit PageView event');
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

      {/* Extra insurance - inline script in Head */}
      <Head>
        <script dangerouslySetInnerHTML={{ __html: `
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
          // This is the test event code from your Facebook's Test Events tool
          fbq('test', '${fbPixelId}', 'TEST69110');
        ` }} />
      </Head>
    </>
  );
}
