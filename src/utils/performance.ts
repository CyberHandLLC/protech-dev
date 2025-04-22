'use client';

/**
 * Performance optimization utilities
 * 
 * This file contains utilities specifically designed to reduce Total Blocking Time (TBT)
 * by optimizing JavaScript execution patterns.
 */

/**
 * Breaks down long-running tasks into smaller chunks that don't block the main thread
 * This is critical for reducing TBT
 */
export function scheduleWork<T>(
  items: T[],
  process: (item: T) => void,
  chunkSize = 5,
  delay = 1
): Promise<void> {
  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve();
      return;
    }

    let i = 0;
    
    function processChunk() {
      const chunk = items.slice(i, i + chunkSize);
      i += chunkSize;
      
      // Process this chunk
      chunk.forEach(process);
      
      // If more items, schedule next chunk when browser is idle
      if (i < items.length) {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => setTimeout(processChunk, delay));
        } else {
          setTimeout(processChunk, delay);
        }
      } else {
        resolve();
      }
    }
    
    processChunk();
  });
}

/**
 * Defers non-critical calculations until after the page has become interactive
 * This significantly reduces TBT by moving work off the critical rendering path
 */
export function deferredCalculation<T>(calculation: () => T): () => T {
  let result: T | null = null;
  let calculated = false;
  
  return () => {
    if (calculated) return result as T;
    
    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      result = calculation();
      calculated = true;
      return result;
    }
    
    // If document isn't complete yet, schedule the calculation for later
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        if (!calculated) {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
              result = calculation();
              calculated = true;
            });
          } else {
            setTimeout(() => {
              result = calculation();
              calculated = true;
            }, 200);
          }
        }
      }, { once: true });
    }
    
    // Return a placeholder or default value
    return null as unknown as T;
  };
}

/**
 * Creates a throttled version of a function that doesn't execute more than once
 * during the specified time period. Critical for event handlers that might fire
 * repeatedly during scrolling or resizing.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  };
}

/**
 * Lazy initializes expensive objects only when they're needed
 * This prevents unnecessary JavaScript execution during initial page load
 */
export function lazyInitialize<T>(factory: () => T): () => T {
  let instance: T | null = null;
  
  return () => {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  };
}

/**
 * Optimizes CSS animations by using the browser's compositor thread
 * This offloads animation work from the main thread, significantly reducing TBT
 */
export function optimizeElement(element: HTMLElement | null): void {
  if (!element) return;
  
  // Force GPU acceleration for animations
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  
  // Signal to the browser which properties will change
  element.style.willChange = 'transform, opacity';
}
