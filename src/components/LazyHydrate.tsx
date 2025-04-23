'use client';

import { ReactNode, useEffect, useState } from 'react';

interface LazyHydrateProps {
  /** Content to be lazily hydrated */
  children: ReactNode;
  
  /** When to hydrate the component */
  whenToHydrate: 'idle' | 'visible' | 'delay' | 'never';
  
  /** Delay in ms (for 'delay' mode) */
  delayMs?: number;
  
  /** Placeholder to show until hydration */
  fallback?: ReactNode;
  
  /** Unique ID for debugging */
  id?: string;
}

/**
 * LazyHydrate defers JavaScript execution until a specific condition is met.
 * This significantly reduces Total Blocking Time (TBT) by:
 * 1. Preventing early hydration of components
 * 2. Controlling the precise timing of JavaScript execution
 * 3. Prioritizing visible content over off-screen elements
 * 
 * Options:
 * - idle: hydrates during browser idle time
 * - visible: hydrates when the element becomes visible in viewport
 * - delay: hydrates after a specified delay
 * - never: never hydrates (SSR only, for completely static parts)
 */
export default function LazyHydrate({
  children,
  whenToHydrate = 'idle',
  delayMs = 2000,
  fallback = null,
  id
}: LazyHydrateProps) {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Skip hydration for the 'never' option (useful for pure static content)
    if (whenToHydrate === 'never') return;
    
    // Log hydration status for debugging
    if (id) console.log(`LazyHydrate: ${id} ready to hydrate when ${whenToHydrate}`);
    
    const triggerHydration = () => {
      if (!hydrated) {
        if (id) console.log(`LazyHydrate: ${id} hydrating now`);
        setHydrated(true);
      }
    };
    
    // Different hydration strategies
    switch (whenToHydrate) {
      case 'idle':
        // Wait until the browser is idle using requestIdleCallback or setTimeout fallback
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(triggerHydration);
        } else {
          setTimeout(triggerHydration, 1000); // Fallback for browsers without requestIdleCallback
        }
        break;
        
      case 'visible':
        // Use Intersection Observer to detect visibility
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              triggerHydration();
              observer.disconnect();
            }
          },
          { rootMargin: '200px' } // Pre-load when element is within 200px of viewport
        );
        
        // Get the first DOM element in our children
        const element = document.getElementById(id || 'hydrate-wrapper');
        if (element) {
          observer.observe(element);
        }
        break;
        
      case 'delay':
        // Simple delay before hydration
        setTimeout(triggerHydration, delayMs);
        break;
    }
    
    return () => {
      // Cleanup if component unmounts before hydration
      if (whenToHydrate === 'visible') {
        const element = document.getElementById(id || 'hydrate-wrapper');
        if (element) {
          const observer = new IntersectionObserver(() => {});
          observer.disconnect();
        }
      }
    };
  }, [whenToHydrate, delayMs, hydrated, id]);
  
  // Render a wrapper with id for reference by the observer
  return (
    <div id={id || 'hydrate-wrapper'}>
      {hydrated ? children : fallback}
    </div>
  );
}