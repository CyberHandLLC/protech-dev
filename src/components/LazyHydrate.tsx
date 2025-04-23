'use client';

import { ReactNode, useEffect, useState } from 'react';

interface LazyHydrateProps {
  /** Content to be lazily hydrated */
  children: ReactNode;
  
  /** When to hydrate the component */
  whenToHydrate?: 'idle' | 'visible' | 'delay' | 'never';
  
  /** Delay in ms (for 'delay' mode) */
  delayMs?: number;
  
  /** Placeholder to show until hydration */
  fallback?: ReactNode;
  
  /** Unique ID for debugging */
  id?: string;
  
  /** Root margin for Intersection Observer (e.g., '-200px') */
  rootMargin?: string;
  
  /** Priority level (0=highest, larger numbers=lower priority) */
  priority?: number;
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
/**
 * Optimized LazyHydrate component with low-impact initial rendering and prioritized hydration
 * This version significantly reduces TBT by managing hydration timing more aggressively
 */
export default function LazyHydrate({
  children,
  whenToHydrate = 'visible', // Change default to visible for best TBT results
  delayMs = 2000,
  fallback = null,
  id,
  rootMargin = '200px',
  priority = 0
}: LazyHydrateProps) {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Skip hydration for the 'never' option (useful for pure static content)
    if (whenToHydrate === 'never') return;
    
    // Added queuing system for TBT reduction based on priority
    const queueHydration = (callback: Function, delay = 0) => {
      // Use requestIdleCallback with timeout to ensure eventual execution
      if ('requestIdleCallback' in window) {
        return (window as any).requestIdleCallback(
          () => setTimeout(callback, delay),
          { timeout: 2000 + (priority * 500) } // Higher priority gets shorter timeout
        );
      } else {
        return setTimeout(callback, delay + (priority * 100));
      }
    };
    
    const triggerHydration = () => {
      if (!hydrated) {
        // Use queueMicrotask to batch state updates for better performance
        queueMicrotask(() => setHydrated(true));
      }
    };
    
    let cleanupFunction: Function | undefined;
    
    // Different hydration strategies
    switch (whenToHydrate) {
      case 'idle':
        // Priority-based idle hydration 
        const idleId = queueHydration(triggerHydration, priority * 100);
        cleanupFunction = () => {
          if ('cancelIdleCallback' in window && idleId) {
            (window as any).cancelIdleCallback(idleId);
          } else if (idleId) {
            clearTimeout(idleId as any);
          }
        };
        break;
        
      case 'visible':
        // Use Intersection Observer with configurable rootMargin
        // This enables different view thresholds for different components
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              queueHydration(triggerHydration);
              observer.disconnect();
            }
          },
          { rootMargin } // Configurable preload distance
        );
        
        // Delay observer attachment slightly for better initial page load
        setTimeout(() => {
          // Get the element directly from DOM (more reliable)
          const element = document.getElementById(id || 'hydrate-wrapper');
          if (element) {
            observer.observe(element);
          }
        }, 100);
        
        cleanupFunction = () => observer.disconnect();
        break;
        
      case 'delay':
        // Delay with priority consideration
        const finalDelay = delayMs + (priority * 200);
        const timeoutId = setTimeout(triggerHydration, finalDelay);
        cleanupFunction = () => clearTimeout(timeoutId);
        break;
    }
    
    return () => {
      // Cleanup observer and timers
      if (cleanupFunction) cleanupFunction();
    };
  }, [whenToHydrate, delayMs, hydrated, id, rootMargin, priority]);
  
  // Render a wrapper with id for reference by the observer
  // Using data attributes instead of ids to prevent conflicts
  return (
    <div id={id || 'hydrate-wrapper'} data-hydrated={hydrated} data-priority={priority}>
      {hydrated ? children : fallback}
    </div>
  );
}