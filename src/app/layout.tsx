import './globals.css';
import { Inter } from 'next/font/google';
import ClientGlobalSEO from '@/components/ClientGlobalSEO';
import Script from 'next/script';

// Direct implementation of Facebook Pixel to ensure it loads
const FACEBOOK_PIXEL_ID = '1201375401668813';
const TEST_EVENT_CODE = 'TEST69110';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: true });

export const metadata = {
  title: 'ProTech HVAC - Heating and Cooling Services',
  description: 'Professional HVAC services for residential and commercial needs',
  applicationName: 'ProTech HVAC',
  authors: [{ name: 'ProTech HVAC', url: 'https://protech-ohio.com' }],
  generator: 'Next.js',
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Northeast Ohio', 'Akron', 'Cleveland', 'Canton'],
  referrer: 'origin-when-cross-origin',
  themeColor: '#0B2B4C', // Navy blue color - should match your primary brand color
  colorScheme: 'dark',
  viewport: { width: 'device-width', initialScale: 1 },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Direct Facebook Pixel implementation in head */}
        <Script
          id="facebook-pixel"
          strategy="beforeInteractive"
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
              fbq('init', '${FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
              fbq('test', '${FACEBOOK_PIXEL_ID}', '${TEST_EVENT_CODE}');
              console.log('Facebook Pixel loaded from layout.tsx');
            `,
          }}
        />
      </head>
      <body className="font-inter">
        <ClientGlobalSEO>
          {children}
        </ClientGlobalSEO>
        {/* Fallback noscript pixel */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }} 
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}