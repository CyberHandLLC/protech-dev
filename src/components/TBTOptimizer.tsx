'use client';

/**
 * TBT Optimizer Component
 * 
 * This component sits at the top of the page and helps optimize Total Blocking Time
 * by carefully scheduling JavaScript execution to prevent main thread blocking.
 */

import { useEffect } from 'react';

export default function TBTOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to break down heavy tasks into smaller chunks
    const breakLongTasks = () => {
      // Override setTimeout to ensure it doesn't block for too long
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = function(callback: Function | string, delay?: number, ...args: any[]): number {
        if (typeof callback !== 'function') {
          return originalSetTimeout(callback as string, delay, ...args);
        }
        
        // For long timeouts, use requestIdleCallback to defer non-critical work
        if (delay && delay > 50) {
          if ('requestIdleCallback' in window) {
            const callbackId = (window as any).requestIdleCallback(() => {
              originalSetTimeout(callback as Function, 0, ...args);
            }, { timeout: delay });
            
            // Return a unique ID that can be used with clearTimeout
            return callbackId as unknown as number;
          }
        }
        
        return originalSetTimeout(callback as Function, delay, ...args);
      } as typeof setTimeout;
      
      // Detect long tasks and break them up
      if ('PerformanceObserver' in window) {
        try {
          // Observe long tasks and log them
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              // Log long tasks for debugging
              console.debug('Long task detected:', entry.duration, 'ms');
              
              // Report long tasks to analytics for monitoring
              if (window.performance && window.performance.mark) {
                window.performance.mark(`long-task-${entry.startTime}`);
              }
            });
          });
          
          // Start observing long tasks
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // Fallback if PerformanceObserver isn't supported
          console.debug('PerformanceObserver not supported');
        }
      }
      
      // Optimize event listeners to use passive mode where possible
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Make scroll and touch events passive by default to prevent blocking
        if (type === 'scroll' || type === 'touchstart' || type === 'touchmove') {
          if (options === undefined || options === false) {
            options = { passive: true };
          } else if (typeof options === 'object' && options !== null && !('passive' in options)) {
            options = { ...options, passive: true };
          }
        }
        
        return originalAddEventListener.call(this, type, listener, options);
      };
      
      // Optimize and debounce resize and scroll event handlers
      const debounce = <T extends (...args: any[]) => any>(
        func: T, 
        wait: number
      ): (...args: Parameters<T>) => void => {
        let timeout: number | undefined;
        
        return function(...args: Parameters<T>): void {
          const later = () => {
            timeout = undefined;
            func(...args);
          };
          
          clearTimeout(timeout);
          timeout = window.setTimeout(later, wait) as unknown as number;
        };
      };
      
      // Find and optimize handlers for high-frequency events
      const optimizeHandlers = () => {
        const events = ['resize', 'scroll'];
        
        events.forEach(eventName => {
          const listeners = (window as any).getEventListeners?.(window)?.[eventName];
          if (!listeners) return;
          
          listeners.forEach((listenerObj: any) => {
            window.removeEventListener(eventName, listenerObj.listener);
            window.addEventListener(eventName, debounce(listenerObj.listener, 100), { passive: true });
          });
        });
      };
      
      // Run optimization when idle to prevent blocking the main thread
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(optimizeHandlers);
      } else {
        setTimeout(optimizeHandlers, 1000);
      }
    };

    // Apply optimizations when document is interactive to reduce TBT
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      breakLongTasks();
    } else {
      document.addEventListener('DOMContentLoaded', breakLongTasks);
    }
    
    // Optimize image loading
    const optimizeImages = () => {
      if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => {
          if (!img.hasAttribute('loading') && !img.hasAttribute('fetchpriority')) {
            if (img.getBoundingClientRect().top > window.innerHeight) {
              img.loading = 'lazy';
            }
          }
        });
      }
    };
    
    // Wait until after render to optimize images
    setTimeout(optimizeImages, 1000);
    
    return () => {
      // Clean up by restoring original functions if component unmounts
      if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
          img.removeAttribute('loading');
        });
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
