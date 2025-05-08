'use client';

import { ReactNode } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import BreadcrumbsWithSchema from '@/components/BreadcrumbsWithSchema';

type PageLayoutProps = {
  children: ReactNode;
  /** Whether to display the main navigation */
  showNavigation?: boolean;
  /** Whether to display the footer */
  showFooter?: boolean;
  /** Whether to display breadcrumbs navigation */
  showBreadcrumbs?: boolean;
  /** Custom breadcrumbs to override the automatic ones */
  customBreadcrumbs?: Array<{label: string; href: string}>;
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
  showBreadcrumbs = true,
  customBreadcrumbs,
  className = ''
}: PageLayoutProps) {
  return (
    <>
      {showNavigation && <MainNavigation />}
      <div className={`min-h-screen flex flex-col bg-navy text-ivory ${showNavigation ? 'pt-24' : ''} ${className}`}>
        <div className="flex-grow">
          {showBreadcrumbs && (
            <div className="container mx-auto px-4 py-2">
              <BreadcrumbsWithSchema items={customBreadcrumbs} overrideItems={!!customBreadcrumbs} />
            </div>
          )}
          {children}
        </div>
        {showFooter && <Footer />}
      </div>
    </>
  );
}
