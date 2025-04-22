import './globals.css';
import { Inter } from 'next/font/google';

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
      <body className={`${inter.variable} font-inter`}>
        {children}
      </body>
    </html>
  );
}