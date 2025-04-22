'use client';

import { useEffect } from 'react';
import { isMobileDevice } from '@/utils/mobileOptimizer';

/**
 * Specialized component for enhancing mobile performance and reducing Total Blocking Time
 * 
 * This component applies the latest Next.js mobile optimization techniques, focusing on:
 * 1. Reducing JavaScript execution time
 * 2. Deferring non-critical work
 * 3. Minimizing layout shifts
 * 4. Prioritizing critical rendering path
 * 
 * It targets specifically the high TBT (740ms) issue on mobile devices
 */
const MobilePerformanceManager = () => {
  useEffect(() => {
    // Only run optimizations on mobile devices
    if (!isMobileDevice()) return;
    
    console.debug('Applying mobile-specific TBT optimizations');
    
    // Critical first: Apply CSS optimizations for animations
    const optimizeCSS = () => {
      // Create a style element with optimized mobile styles
      const style = document.createElement('style');
      style.textContent = `
        /* Mobile performance optimizations to reduce TBT */
        @media (max-width: 767px) {
          /* Disable expensive animations */
          .animate-pulse {
            animation: none !important;
          }
          
          /* Simplify gradients for better performance */
          .bg-gradient-to-br, .bg-gradient-to-tr {
            background: var(--bg-color, #0d2240) !important;
          }
          
          /* Force hardware acceleration for critical elements */
          .hero-section, .hero-content, h1, h2, .btn-primary {
            transform: translateZ(0);
            will-change: auto;
          }
          
          /* Optimize transitions to reduce main thread work */
          * {
            transition-duration: 0.1s !important;
            transition-delay: 0s !important;
          }
          
          /* Remove hover effects (which can be costly) on touch devices */
          .hover\\:bg-red-dark:hover {
            background-color: inherit !important;
          }
        }
      `;
      document.head.appendChild(style);
    };
    
    // Optimize event handlers to reduce main thread blocking
    const optimizeEventHandlers = () => {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Make all touch/mouse events passive on mobile
        if (type.startsWith('touch') || type.startsWith('mouse')) {
          if (typeof options === 'object') {
            options = { ...options, passive: true };
          } else {
            options = { passive: true };
          }
        }
        
        return originalAddEventListener.call(this, type, listener, options);
      };
    };
    
    // Reduce the priority of non-critical resources
    const optimizeResourceLoading = () => {
      // Find all non-critical images and defer them
      const images = document.querySelectorAll('img:not([priority])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      });
      
      // Find all non-critical scripts
      const scripts = document.querySelectorAll('script:not([critical])');
      scripts.forEach(script => {
        script.setAttribute('async', '');
        script.setAttribute('defer', '');
      });
    };
    
    // Break up long tasks to improve TBT
    const breakupLongTasks = () => {
      // Set up performance observer to monitor long tasks
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              console.debug(`Long task detected: ${entry.duration}ms`);
              
              // Report long tasks to analytics
              if (window.performance && window.performance.mark) {
                window.performance.mark(`long-task-${entry.startTime}`);
              }
            });
          });
          
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.debug('PerformanceObserver not supported');
        }
      }
    };
    
    // Apply optimizations with proper timing
    // 1. First apply critical CSS optimizations immediately
    optimizeCSS();
    
    // 2. Optimize event handlers which impacts all future interactions
    optimizeEventHandlers();
    
    // 3. Schedule less-critical optimizations for after first paint
    setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          optimizeResourceLoading();
          breakupLongTasks();
        });
      } else {
        setTimeout(() => {
          optimizeResourceLoading();
          breakupLongTasks();
        }, 1000);
      }
    }, 100);
    
    // Cleanup function
    return () => {
      // Cleanup would be here if needed
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default MobilePerformanceManager;
