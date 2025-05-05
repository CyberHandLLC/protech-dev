'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  containerId?: string;
}

/**
 * Google Tag Manager Component
 * 
 * Adds Google Tag Manager tracking code to the site
 * Reads the GTM container ID from environment variables when not explicitly provided
 */
export default function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  const gtmId = containerId || process.env.NEXT_PUBLIC_GTM_ID;
  
  // Don't render anything if no container ID is available
  if (!gtmId) {
    console.warn('Google Tag Manager ID not provided. Add NEXT_PUBLIC_GTM_ID to your environment variables.');
    return null;
  }

  return (
    <>
      {/* Google Tag Manager script */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      
      {/* Google Tag Manager noscript fallback */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
