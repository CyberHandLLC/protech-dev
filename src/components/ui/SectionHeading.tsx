'use client';

import React from 'react';

export interface SectionHeadingProps {
  /** Main title text */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Small accent text above the title */
  accentText?: string;
  /** Center the text content */
  centered?: boolean;
  /** Control the size of the title */
  size?: 'sm' | 'md' | 'lg';
  /** Additional custom classes */
  className?: string;
}

/**
 * A standardized section heading component with consistent styling
 */
export default function SectionHeading({
  title,
  subtitle,
  accentText,
  centered = true,
  size = 'md',
  className = ''
}: SectionHeadingProps) {
  // Calculate title size class based on the size prop
  const getTitleClass = () => {
    switch (size) {
      case 'sm':
        return 'text-2xl md:text-3xl';
      case 'md':
        return 'text-3xl md:text-4xl';
      case 'lg':
        return 'text-4xl md:text-5xl';
      default:
        return 'text-3xl md:text-4xl';
    }
  };

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {accentText && (
        <div className="inline-block mb-4">
          <div className={`h-1 w-24 bg-red mb-3 ${centered ? 'mx-auto' : ''}`}></div>
          <span className="text-red-light uppercase text-sm tracking-wider font-medium">
            {accentText}
          </span>
        </div>
      )}
      <h2 className={`${getTitleClass()} font-bold text-white mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-ivory/80 ${centered ? 'max-w-3xl mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
