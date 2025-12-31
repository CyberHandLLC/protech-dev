import './globals.css';
import { Inter } from 'next/font/google';
import ClientGlobalSEO from '@/components/ClientGlobalSEO';

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter" suppressHydrationWarning>
        <ClientGlobalSEO>
          {children}
        </ClientGlobalSEO>
      </body>
    </html>
  );
}