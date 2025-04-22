import './globals.css';
import './mobile-tbt-optimizer.css'; // Import specialized mobile TBT optimization CSS
import { Inter } from 'next/font/google';
import Script from 'next/script';
import PerformanceOptimizers from '@/components/PerformanceOptimizers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'ProTech HVAC - Heating and Cooling Services',
  description: 'Professional HVAC services for residential and commercial needs',
};

// Using PerformanceOptimizers client component instead of direct dynamic imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetching for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Add preload hints for critical resources */}
        <link rel="preload" href="/hero-placeholder.jpg" as="image" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/prism.css" as="style" />
        
        {/* Critical meta tags to improve performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval';" />
      </head>
      <body className={`${inter.variable} font-inter`}>
        {/* Performance optimizers must be the first components to ensure they run early */}
        <PerformanceOptimizers />
        
        {children}
        
        {/* Load non-critical scripts with highest possible optimization */}
        <Script
          src="/scripts/analytics.js"
          strategy="lazyOnload" /* More aggressive than afterInteractive */
          defer
        />
        
        {/* Finely-tuned script loading */}
        <Script id="performance-marks" strategy="beforeInteractive">
          {`
            // Set performance marks to measure TBT
            performance.mark('app-started');
            document.addEventListener('DOMContentLoaded', function() {
              performance.mark('dom-loaded');
              performance.measure('tbt-measure', 'app-started', 'dom-loaded');
            });
            
            // Optimize rendering by reducing work on the main thread
            document.documentElement.style.scrollBehavior = 'auto';
          `}
        </Script>
      </body>
    </html>
  );
}