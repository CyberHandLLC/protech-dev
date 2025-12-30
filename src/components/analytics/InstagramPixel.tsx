'use client';

import Script from 'next/script';

interface InstagramPixelProps {
  pixelId?: string;
}

/**
 * Instagram Pixel Component
 * 
 * NOTE: Instagram ads use the same Meta Pixel infrastructure as Facebook.
 * If you're running Instagram ads, you should use your Facebook Pixel ID.
 * A separate Instagram Pixel ID is only needed for specific Instagram-only campaigns.
 * 
 * For most cases, the FacebookPixel component handles both Facebook and Instagram tracking.
 */
export default function InstagramPixel({ pixelId }: InstagramPixelProps) {
  const igPixelId = pixelId || process.env.NEXT_PUBLIC_INSTAGRAM_PIXEL_ID;
  
  // Don't render anything if no pixel ID is available - this is expected behavior
  if (!igPixelId) {
    // Silent return - no warning needed as Instagram uses Facebook Pixel by default
    return null;
  }

  return (
    <>
      {/* Instagram Pixel Base Code - Uses the same structure as Facebook Pixel */}
      <Script id="instagram-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${igPixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      
      {/* Fallback noscript pixel */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }} 
          src={`https://www.facebook.com/tr?id=${igPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
