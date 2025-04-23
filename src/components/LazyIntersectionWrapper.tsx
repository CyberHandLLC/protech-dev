'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyIntersectionWrapperProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  fallback?: ReactNode;
}

/**
 * Wrapper component that lazily renders children when they come into view
 * Reduces TBT by deferring below-the-fold component hydration
 */
export default function LazyIntersectionWrapper({
  children,
  rootMargin = '-200px',
  threshold = 0,
  triggerOnce = true,
  fallback
}: LazyIntersectionWrapperProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    rootMargin,
    threshold
  });
  
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setShowContent(true);
    }
  }, [inView]);
  
  return (
    <div ref={ref}>
      {showContent ? children : fallback || <div className="min-h-[100px]" />}
    </div>
  );
}
