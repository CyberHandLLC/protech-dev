'use client';

import { ReactNode, memo, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import critical navigation directly
import MainNavigation from '@/components/MainNavigation';

// Use dynamic imports for non-critical components
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <FooterSkeleton />,
  ssr: true
});

// Lightweight skeleton to reduce TBT during loading
const FooterSkeleton = () => (
  <div className="w-full py-8 bg-navy-dark">
    <div className="container mx-auto px-4">
      <div className="h-6 bg-navy-light/40 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-navy-light/30 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-navy-light/30 rounded w-1/2"></div>
    </div>
  </div>
);

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
// Memoized page layout to prevent unnecessary re-renders
function PageLayoutBase({ 
  children, 
  showNavigation = true,
  showFooter = true,
  className = ''
}: PageLayoutProps) {
  // Track if component is mounted to control hydration behavior
  const [isMounted, setIsMounted] = useState(false);
  
  // Use effect to signal component is mounted to avoid hydration mismatches
  useEffect(() => {
    // Use requestIdleCallback to defer this operation until the browser is idle
    // This is crucial for TBT reduction
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setIsMounted(true);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => setIsMounted(true), 100);
    }
  }, []);

  // Apply TBT optimization - use transform translate3d for hardware acceleration
  useEffect(() => {
    if (!isMounted) return;
    
    // Find all animating elements and apply hardware acceleration
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    animatedElements.forEach(el => {
      // Force GPU acceleration for animations to reduce main thread work
      (el as HTMLElement).style.transform = 'translate3d(0,0,0)';
      (el as HTMLElement).style.willChange = 'opacity, transform';
    });
    
    return () => {
      // Cleanup when unmounting
      animatedElements.forEach(el => {
        (el as HTMLElement).style.willChange = 'auto';
      });
    };
  }, [isMounted]);

  return (
    <>
      {/* MainNavigation is critical for user interaction - kept outside of Suspense */}
      {showNavigation && <MainNavigation />}
      
      <div 
        className={`min-h-screen flex flex-col bg-navy text-ivory ${showNavigation ? 'pt-20' : ''} ${className}`}
        style={{ contain: 'content' }} /* Use CSS containment to reduce layout recalculations */
      >
        <div className="flex-grow">
          {/* Render children early for better interactivity */}
          {children}
        </div>
        
        {/* Use Suspense for the footer to prevent it from blocking interactivity */}
        {showFooter && (
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
        )}
      </div>
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(PageLayoutBase);
