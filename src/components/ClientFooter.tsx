'use client';

import { useEffect, useState } from 'react';
import Footer from './Footer';

/**
 * Client-only footer component
 * Lazy-loads the footer after critical content is visible
 * This reduces TBT by deferring non-critical interactivity
 */
export default function ClientFooter() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Use intersection observer to only hydrate footer when it's near viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When footer is within 500px of viewport, hydrate it
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' }
    );
    
    // Create a placeholder element to observe
    const target = document.getElementById('footer-placeholder');
    if (target) {
      observer.observe(target);
    }
    
    return () => observer.disconnect();
  }, []);
  
  if (!mounted) {
    // Just render a placeholder that maintains spacing
    return (
      <div id="footer-placeholder" className="bg-dark-blue py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="h-40 md:h-60"></div>
        </div>
      </div>
    );
  }
  
  // Once visible, render the actual footer
  return <Footer />;
}
