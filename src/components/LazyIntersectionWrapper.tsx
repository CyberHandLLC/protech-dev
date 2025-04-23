'use client';

import { ReactNode, useEffect, useState, useRef, memo } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyIntersectionWrapperProps {
  /** Content to render when in view */
  children: ReactNode;
  
  /** Distance around viewport to pre-load (-100px loads earlier, 100px loads later) */
  rootMargin?: string;
  
  /** Visibility threshold (0-1) to trigger rendering */
  threshold?: number;
  
  /** Only trigger once? Default: true */
  triggerOnce?: boolean;
  
  /** Content to show while main content is loading */
  fallback?: ReactNode;
  
  /** Priority level (higher priority = earlier loading) */
  priority?: 'critical' | 'high' | 'medium' | 'low';
  
  /** Debug ID for performance monitoring */
  id?: string;
}

/**
 * Wrapper component that lazily renders children when they come into view
 * Reduces TBT by deferring below-the-fold component hydration
 * 
 * Performance benefits:
 * - Defers JavaScript execution for offscreen components
 * - Uses requestAnimationFrame for smoother loading sequence
 * - Adds performance marks for debugging and monitoring
 * - Supports priority levels for loading critical content first
 */
export default memo(function LazyIntersectionWrapper({
  children,
  rootMargin = '-100px', // Less aggressive margin for better user experience
  threshold = 0.1,       // Slightly higher threshold to delay loading
  triggerOnce = true,
  fallback,
  priority = 'medium',
  id
}: LazyIntersectionWrapperProps) {
  // Generate a unique ID for this instance if none is provided
  const componentId = useRef<string>(id || `lazy-intersection-${Math.random().toString(36).substring(2, 9)}`);
  
  // Determine rootMargin based on priority
  const priorityMargins = {
    critical: '400px', // Load very early
    high: '200px',     // Load somewhat early
    medium: '-100px',  // Default - load just before visible
    low: '-200px'      // Load only when almost visible
  };
  
  // Use priority-adjusted rootMargin if specified
  const effectiveRootMargin = priority !== 'medium' ? 
    priorityMargins[priority] : rootMargin;
  
  // Setup intersection observer hook with priority-based configuration
  const [ref, inView] = useInView({
    triggerOnce,
    rootMargin: effectiveRootMargin,
    threshold
  });
  
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (inView) {
      // Mark the start of hydration for this component
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`hydrate-start-${componentId.current}`);
      }
      
      // Use requestAnimationFrame to schedule the state update outside the main thread
      // This helps reduce TBT by moving work off the critical path
      requestAnimationFrame(() => {
        setShowContent(true);
        
        // Mark the end of hydration for performance measurement
        if (typeof performance !== 'undefined' && performance.mark) {
          performance.mark(`hydrate-end-${componentId.current}`);
          performance.measure(
            `hydration-${componentId.current}`,
            `hydrate-start-${componentId.current}`,
            `hydrate-end-${componentId.current}`
          );
        }
      });
    }
  }, [inView]);
  
  return (
    <div 
      ref={ref} 
      data-priority={priority}
      data-hydration-state={showContent ? 'hydrated' : 'pending'}
      className="lazy-intersection-wrapper"
    >
      {showContent ? children : fallback || <div className="min-h-[100px] animate-pulse bg-gray-100" />}
    </div>
  );
})
