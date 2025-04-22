import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'ProTech HVAC - Heating and Cooling Services',
  description: 'Professional HVAC services for residential and commercial needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Add preload hints for critical resources */}
        <link rel="preload" href="/hero-placeholder.jpg" as="image" />
      </head>
      <body className={`${inter.variable} font-inter`}>
        {children}
        
        {/* Load non-critical scripts after page load to reduce TBT */}
        <Script
          src="/scripts/analytics.js"
          strategy="afterInteractive"
          defer
        />
      </body>
    </html>
  );
}