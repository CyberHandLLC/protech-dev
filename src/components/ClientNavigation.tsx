'use client';

import { useEffect, useState } from 'react';
import MainNavigation from './MainNavigation';

/**
 * Client-only navigation component
 * Defers hydration of the navigation until after content is visible
 * This significantly reduces TBT by avoiding early JS execution
 */
export default function ClientNavigation() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Defer navigation hydration with a small delay
    // This ensures content is rendered first
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!mounted) {
    // Render a static placeholder with same dimensions
    // This prevents layout shift when navigation hydrates
    return (
      <div className="fixed top-0 left-0 right-0 bg-navy z-50 h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="text-white font-bold text-2xl">ProTech HVAC</div>
          <div className="w-64 h-10"></div>
        </div>
      </div>
    );
  }
  
  // Once mounted, render the actual interactive navigation
  return <MainNavigation />;
}
