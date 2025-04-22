'use client';

import { useEffect } from 'react';
import { optimizeForMobile, applyMobileCriticalCSS, isMobileDevice } from '@/utils/mobileOptimizer';

/**
 * Mobile Optimizer Component
 * 
 * This component applies specific optimizations for mobile devices,
 * focusing on reducing TBT (Total Blocking Time) which is typically higher
 * on mobile devices due to lower processing power.
 * 
 * It follows Next.js best practices for mobile optimization.
 */
export default function MobileOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only execute optimizations if we're on a mobile device
    if (!isMobileDevice()) return;
    
    // Apply first-paint optimizations immediately
    applyMobileCriticalCSS();
    
    // Schedule more intensive optimizations for after first paint
    const optimizeAfterPaint = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          optimizeForMobile();
        });
      } else {
        setTimeout(() => {
          optimizeForMobile();
        }, 500);
      }
    };
    
    // Execute optimization based on document readiness
    if (document.readyState === 'complete') {
      optimizeAfterPaint();
    } else {
      window.addEventListener('load', optimizeAfterPaint, { once: true });
    }
    
    // Apply additional mobile-specific TBT optimizations
    const applyMobileTBTOptimizations = () => {
      // Register ServiceWorker for caching on supported browsers (reduces network time)
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.debug('ServiceWorker registration failed:', err);
        });
      }
      
      // Reduce scrolling jank on mobile by disabling smooth scroll
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Add touch-action hints to improve responsiveness
      document.querySelectorAll('a, button').forEach(el => {
        (el as HTMLElement).style.touchAction = 'manipulation';
      });
      
      // Optimize event listeners specifically for mobile
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        // Make touch events passive by default to prevent blocking
        if (type.startsWith('touch')) {
          if (options === undefined || options === false) {
            options = { passive: true };
          } else if (typeof options === 'object' && options !== null && !('passive' in options)) {
            options = { ...options, passive: true };
          }
        }
        
        return originalAddEventListener.call(this, type, listener, options);
      };
    };
    
    // Schedule mobile TBT optimizations
    setTimeout(applyMobileTBTOptimizations, 100);
    
    // Create performance marks to measure mobile TBT
    if (window.performance && window.performance.mark) {
      window.performance.mark('mobile-optimization-start');
      
      setTimeout(() => {
        window.performance.mark('mobile-optimization-end');
        window.performance.measure(
          'mobile-optimization-measure',
          'mobile-optimization-start',
          'mobile-optimization-end'
        );
      }, 2000);
    }
    
    return () => {
      // Cleanup if component unmounts
      window.removeEventListener('load', optimizeAfterPaint);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
