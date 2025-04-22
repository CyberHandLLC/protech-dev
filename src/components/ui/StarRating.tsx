'use client';

import React from 'react';

export interface StarRatingProps {
  /** Rating value from 0-5 */
  rating: number;
  /** Size of stars */
  size?: 'sm' | 'md' | 'lg';
  /** Additional custom classes */
  className?: string;
}

/**
 * A standardized star rating component
 */
export default function StarRating({
  rating,
  size = 'md',
  className = ''
}: StarRatingProps) {
  // Get size classes for the stars
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <div 
      className={`flex items-center ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
          aria-hidden="true"
        >
          <svg className={`${getSizeClass()} inline-block`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
