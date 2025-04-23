'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

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
  
  /** Root margin for IntersectionObserver (visible mode) */
  rootMargin?: string;
  
  /** Threshold for IntersectionObserver (visible mode) */
  threshold?: number;
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
  id,
  rootMargin = '200px',
  threshold = 0.1
}: LazyHydrateProps) {
  const [hydrated, setHydrated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Generate a unique ID for this instance if none is provided
  const uniqueId = useRef<string>(id || `lazy-hydrate-${Math.random().toString(36).substring(2, 9)}`);
  
  useEffect(() => {
    // Skip hydration for the 'never' option (useful for pure static content)
    if (whenToHydrate === 'never') return;
    
    // Only log in development to avoid console spam in production
    if (process.env.NODE_ENV !== 'production' && uniqueId.current) {
      console.log(`LazyHydrate: ${uniqueId.current} ready to hydrate when ${whenToHydrate}`);
    }
    
    const triggerHydration = () => {
      if (!hydrated) {
        if (process.env.NODE_ENV !== 'production' && uniqueId.current) {
          console.log(`LazyHydrate: ${uniqueId.current} hydrating now`);
          // Add a performance mark to help with debugging
          if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(`hydrate-${uniqueId.current}`);
          }
        }
        // Use requestAnimationFrame to ensure we're not blocking the main thread
        requestAnimationFrame(() => {
          setHydrated(true);
        });
      }
    };
    
    // Different hydration strategies
    let cleanupFunction: (() => void) | undefined;
    
    switch (whenToHydrate) {
      case 'idle':
        // Wait until the browser is idle using requestIdleCallback or setTimeout fallback
        if ('requestIdleCallback' in window) {
          const idleCallback = (window as any).requestIdleCallback(triggerHydration, { timeout: 2000 });
          cleanupFunction = () => (window as any).cancelIdleCallback(idleCallback);
        } else {
          // Fallback for browsers without requestIdleCallback
          const timeoutId = setTimeout(triggerHydration, 1000);
          cleanupFunction = () => clearTimeout(timeoutId);
        }
        break;
        
      case 'visible':
        // Use Intersection Observer to detect visibility
        if (typeof IntersectionObserver !== 'undefined' && elementRef.current) {
          // Disconnect any existing observer
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
          
          // Create a new observer with the specified options
          observerRef.current = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                triggerHydration();
                // Immediately disconnect once triggered
                if (observerRef.current) {
                  observerRef.current.disconnect();
                  observerRef.current = null;
                }
              }
            },
            { rootMargin, threshold }
          );
          
          // Start observing our element
          observerRef.current.observe(elementRef.current);
          
          // Setup cleanup
          cleanupFunction = () => {
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          };
        } else {
          // Fallback if IntersectionObserver is not available
          const timeoutId = setTimeout(triggerHydration, 500);
          cleanupFunction = () => clearTimeout(timeoutId);
        }
        break;
        
      case 'delay':
        // Simple delay before hydration
        const timeoutId = setTimeout(triggerHydration, delayMs);
        cleanupFunction = () => clearTimeout(timeoutId);
        break;
    }
    
    // Return a cleanup function
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [whenToHydrate, delayMs, hydrated, rootMargin, threshold]);
  
  // Render wrapper with ref for IntersectionObserver
  return (
    <div 
      ref={elementRef}
      id={uniqueId.current}
      data-hydration-state={hydrated ? 'hydrated' : 'pending'}
      className="lazy-hydrate-wrapper"
    >
      {hydrated ? children : fallback}
    </div>
  );
}