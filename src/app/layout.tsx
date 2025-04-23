import './globals.css';
import { Inter } from 'next/font/google';

// Import the client navigation wrapper for deferred hydration
import ClientNavigation from '@/components/ClientNavigation';
import ClientFooter from '@/components/ClientFooter';

// Optimize font loading with display:swap and adjustable weights
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  preload: true,
  // Only loading essential weights to reduce font size
  weight: ['400', '500', '600', '700'],
});

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
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to essential third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload the hero image to improve LCP */}
        <link rel="preload" as="image" href="/hero-placeholder.jpg" />
      </head>
      <body className="font-inter">
        {/* Navigation hydrates separately after content is visible */}
        <ClientNavigation />
        
        {/* Main content renders first for better LCP/TBT */}
        {children}
        
        {/* Footer hydrates last, after all visible content */}
        <ClientFooter />
      </body>
    </html>
  );
}