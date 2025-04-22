'use client';

/**
 * Mobile Performance Optimizer
 * 
 * This module provides specialized utilities for optimizing performance on mobile devices,
 * focusing specifically on reducing Total Blocking Time (TBT).
 * 
 * Based on Next.js documentation best practices for mobile optimization.
 */

/**
 * Detects if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Check for common mobile user agent patterns
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  
  // Regular expressions for mobile detection
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // Alternative check based on screen size
  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return mobileRegex.test(userAgent) || isMobileScreen;
}

/**
 * Defers non-critical operations for mobile devices
 */
export function mobileOptimizedOperation<T>(
  operation: () => T,
  mobileDelay: number = 2000,
  desktopDelay: number = 100
): Promise<T> {
  return new Promise((resolve) => {
    const delay = isMobileDevice() ? mobileDelay : desktopDelay;
    
    // For mobile devices, wait until after critical rendering is complete
    setTimeout(() => {
      // Execute the operation when browser is idle
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          resolve(operation());
        });
      } else {
        resolve(operation());
      }
    }, delay);
  });
}

/**
 * Applies mobile-specific optimizations to DOM elements
 */
export function optimizeForMobile(): void {
  if (typeof document === 'undefined') return;
  if (!isMobileDevice()) return;
  
  // Dynamically adjust image quality for mobile
  const adjustImageQuality = () => {
    // Select all Next.js Image components (which render as <img> with data-nimg attribute)
    const images = document.querySelectorAll('img[data-nimg]');
    
    images.forEach(imgElement => {
      // Cast to HTMLImageElement to access img-specific properties
      const img = imgElement as HTMLImageElement;
      
      // Reduce quality for faster loading
      if (img.src && img.src.includes('q=75')) {
        img.src = img.src.replace('q=75', 'q=60');
      }
      
      // Ensure images are properly sized for mobile viewport
      if (!img.sizes) {
        img.sizes = '100vw';
      }
      
      // Lazy load all non-critical images
      if (!img.hasAttribute('loading') && 
          !img.hasAttribute('priority') && 
          img.getBoundingClientRect().top > window.innerHeight) {
        img.setAttribute('loading', 'lazy');
      }
    });
  };
  
  // Remove non-critical animations on mobile
  const optimizeAnimations = () => {
    // Find elements with animations that might cause layout shifts
    const animatedElements = document.querySelectorAll(
      '.animate-fade-in, .animate-slide-up, .animate-marquee'
    );
    
    animatedElements.forEach(el => {
      // Disable complex animations on mobile
      if ((el as HTMLElement).classList.contains('animate-marquee') || 
          (el as HTMLElement).classList.contains('animate-marquee-2')) {
        (el as HTMLElement).classList.remove('animate-marquee', 'animate-marquee-2');
      }
      
      // Simplify other animations
      if ((el as HTMLElement).classList.contains('animate-fade-in')) {
        (el as HTMLElement).style.transitionProperty = 'opacity';
        (el as HTMLElement).style.transitionDuration = '0.1s';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).classList.remove('animate-fade-in');
      }
    });
  };
  
  // Add mobile-specific font display settings
  const optimizeFonts = () => {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
      /* Optimize font loading for mobile */
      @font-face {
        font-display: optional;
      }
      
      /* Minimize layout shifts */
      * {
        text-size-adjust: none;
      }
    `;
    document.head.appendChild(style);
  };
  
  // Execute these optimizations when the page becomes interactive
  if (document.readyState === 'complete') {
    // Schedule optimization for after first paint
    setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          adjustImageQuality();
          optimizeAnimations();
          optimizeFonts();
        });
      } else {
        setTimeout(() => {
          adjustImageQuality();
          optimizeAnimations();
          optimizeFonts();
        }, 1000);
      }
    }, 200);
  } else {
    // Wait for content to load
    window.addEventListener('load', () => {
      setTimeout(() => {
        adjustImageQuality();
        optimizeAnimations();
        optimizeFonts();
      }, 200);
    });
  }
}

/**
 * Applies inline critical CSS for mobile devices
 * This is important for reducing mobile TBT by avoiding render-blocking CSS
 */
export function applyMobileCriticalCSS(): void {
  if (typeof document === 'undefined') return;
  if (!isMobileDevice()) return;
  
  // Create critical CSS for mobile only
  const criticalCSS = `
    /* Critical mobile CSS */
    @media (max-width: 767px) {
      /* Reduce complexity of background gradients */
      .bg-gradient-to-br {
        background: #0d2240 !important;
      }
      
      /* Simplify box shadows */
      .shadow-lg, .shadow-md {
        box-shadow: none !important;
      }
      
      /* Optimize performance by reducing complexity */
      .animate-pulse {
        animation: none !important;
        opacity: 0.7;
      }
      
      /* Force hardware acceleration for smoother scrolling */
      body {
        -webkit-overflow-scrolling: touch;
        backface-visibility: hidden;
      }
    }
  `;
  
  // Add critical CSS inline
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}
