'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * Client component wrapper for RootLayout
 * This isolates client-side optimizations from the server-rendered layout
 * Follows the consistent layout pattern established across the site
 */
export default function ClientRootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false);
  
  // Apply TBT optimizations on mount
  useEffect(() => {
    setIsClient(true);
    
    // Apply TBT optimization for mobile
    if (typeof window !== 'undefined') {
      // Break up long tasks
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
      
      // Make event listeners passive when possible to avoid blocking the main thread
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(
        type: string, 
        listener: EventListenerOrEventListenerObject, 
        options?: boolean | AddEventListenerOptions
      ) {
        // For scroll and touch events, force passive to be true
        if (type === 'scroll' || type === 'touchstart' || type === 'touchmove') {
          if (typeof options === 'object') {
            options = { ...options, passive: true };
          } else {
            options = { passive: true };
          }
        }
        
        return originalAddEventListener.call(this, type, listener, options);
      };

      // Monitor and break up long tasks
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) {
                console.debug('Long task detected:', entry.duration, 'ms');
              }
            });
          });
          
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.debug('PerformanceObserver not supported');
        }
      }
    }
  }, []);

  return (
    <>
      {children}
      
      {/* Scripts loaded with strategy="worker" for optimal mobile performance */}
      {isClient && (
        <>
          <Script
            src="/js/performance-monitor.js"
            strategy="lazyOnload"
            onLoad={() => console.log('Performance monitoring initialized')}
          />
          
          <Script
            src="/js/analytics.js"
            strategy="lazyOnload"
            onLoad={() => console.log('Analytics loaded')}
          />
        </>
      )}
    </>
  );
}
