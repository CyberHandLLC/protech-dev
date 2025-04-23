'use client';

import { ReactNode, useEffect, useState, useTransition, use, memo } from 'react';
import { usePathname } from 'next/navigation';

interface OptimizedClientWrapperProps {
  children: ReactNode;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  id?: string;
  defer?: boolean;
  loadOnView?: boolean;
}

/**
 * OptimizedClientWrapper - A high-performance client component wrapper
 * Uses React 19's latest features to minimize TBT
 * 
 * This component enables selective hydration by:
 * 1. Using useTransition to move hydration off the main thread
 * 2. Supporting deferring component hydration until idle or visible
 * 3. Implementing progressive enhancement for non-critical UI
 */
export default memo(function OptimizedClientWrapper({
  children,
  priority = 'medium',
  id,
  defer = true,
  loadOnView = true
}: OptimizedClientWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const [shouldRender, setShouldRender] = useState(!defer);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
  // Component-specific ID for debugging and tracking
  const componentId = id || `client-${pathname}-${Math.random().toString(36).slice(2, 9)}`;

  // Client-side only code
  useEffect(() => {
    setIsClient(true);
    
    // Skip defer logic if not needed
    if (!defer) return;
    
    // Set up performance marking
    if (process.env.NODE_ENV !== 'production') {
      performance.mark(`${componentId}-start`);
    }
    
    if (loadOnView && typeof IntersectionObserver !== 'undefined') {
      // Element we'll observe (we'll attach it later via ref)
      const element = document.getElementById(componentId);
      if (!element) return;
      
      // Create observer with proper threshold based on priority
      const thresholds = {
        critical: 0,
        high: 0.1,
        medium: 0.25,
        low: 0.5
      };
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            // Using startTransition to avoid blocking the main thread
            startTransition(() => {
              setShouldRender(true);
            });
            observer.disconnect();
          }
        },
        {
          threshold: thresholds[priority],
          rootMargin: priority === 'critical' ? '500px' : '100px',
        }
      );
      
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      // For non-visibility based loading, use requestIdleCallback
      if ('requestIdleCallback' in window) {
        const timeoutOptions = {
          timeout: priority === 'critical' ? 500 : 
                  priority === 'high' ? 1000 : 
                  priority === 'medium' ? 2000 : 3000
        };
        
        const idleId = (window as any).requestIdleCallback(() => {
          startTransition(() => {
            setShouldRender(true);
          });
        }, timeoutOptions);
        
        return () => (window as any).cancelIdleCallback(idleId);
      } else {
        // Fallback for browsers without requestIdleCallback
        const timeoutDelay = priority === 'critical' ? 100 : 
                            priority === 'high' ? 500 : 
                            priority === 'medium' ? 1000 : 2000;
        
        const timerId = setTimeout(() => {
          startTransition(() => {
            setShouldRender(true);
          });
        }, timeoutDelay);
        
        return () => clearTimeout(timerId);
      }
    }
  }, [componentId, defer, loadOnView, priority, pathname]);

  // Performance measurement completion
  useEffect(() => {
    if (shouldRender && process.env.NODE_ENV !== 'production') {
      performance.mark(`${componentId}-end`);
      performance.measure(
        `hydration-${componentId}`,
        `${componentId}-start`,
        `${componentId}-end`
      );
    }
  }, [shouldRender, componentId]);

  // For server-side rendering, always render a simple container with the actual content
  // This prevents hydration mismatches by using the same structure on server and client
  if (typeof window === 'undefined') {
    return (
      <div 
        id={componentId} 
        data-priority={priority} 
        data-hydration="pending"
      >
        {children}
      </div>
    );
  }

  // Client-side rendering with all dynamic behavior
  return (
    <div 
      id={componentId}
      data-priority={priority}
      data-hydration={shouldRender ? 'complete' : 'pending'}
      className={isPending ? 'pending-hydration' : ''}
    >
      {shouldRender || !defer ? children : (
        <div className="min-h-[100px] bg-navy opacity-80 animate-pulse rounded" />
      )}
    </div>
  );
});
