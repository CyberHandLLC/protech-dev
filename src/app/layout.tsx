import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Import client components (without using dynamic imports in Server Components)
import ClientRootLayout from '../components/client/ClientRootLayout';

// Use Inter font with a variable name to be consistent with established styling
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter' 
});

/**
 * Metadata for the site
 */
export const metadata: Metadata = {
  title: 'ProTech HVAC | Professional Heating & Cooling Services',
  description: 'ProTech HVAC provides expert heating, cooling, and air quality services throughout Northeast Ohio. Schedule service, request a quote, or learn about our services.',
  keywords: ['HVAC', 'heating', 'cooling', 'air conditioning', 'Ohio', 'Northeast Ohio'],
};

/**
 * Root layout using the established page layout pattern
 * Following Next.js App Router architecture for mobile optimization
 */
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
        
        {/* Preload critical assets for better mobile LCP */}
        <link rel="preload" href="/hero-placeholder.jpg" as="image" />
        <link rel="preload" href="/prism.css" as="style" />
        
        {/* Meta tags for mobile optimization and security */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval';" />
      </head>
      
      {/* Apply the Inter font variable to the body using the established pattern */}
      <body className={`${inter.variable} font-inter`}>
        {/* ClientRootLayout component handles all client-side optimizations */}
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}