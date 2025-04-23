'use client';

import { ReactNode } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

type PageLayoutProps = {
  children: ReactNode;
  /** Whether to display the main navigation */
  showNavigation?: boolean;
  /** Whether to display the footer */
  showFooter?: boolean;
  /** Additional classes for the main content wrapper */
  className?: string;
};

/**
 * Standard page layout component that provides consistent structure across the application
 * Includes main navigation, content area, and footer
 */
export default function PageLayout({ 
  children, 
  showNavigation = true,
  showFooter = true,
  className = ''
}: PageLayoutProps) {
  return (
    <>
      {showNavigation && <MainNavigation />}
      <div className={`min-h-screen flex flex-col bg-navy text-ivory ${showNavigation ? 'pt-20' : ''} ${className}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </div>
    </>
  );
}
