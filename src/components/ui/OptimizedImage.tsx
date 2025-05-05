'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * OptimizedImage Component
 * 
 * A wrapper around Next.js Image component that provides:
 * - SEO-friendly image loading with proper alt text
 * - Automatic WebP/AVIF format conversion
 * - Placeholder blurring while loading
 * - Core Web Vitals optimization
 * - Responsive sizing
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`overflow-hidden ${isLoading ? 'bg-dark-blue-light animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`
          ${className}
          ${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
          transition-all duration-500
        `}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}
