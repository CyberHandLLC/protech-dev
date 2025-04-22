'use client';

import React, { ReactNode } from 'react';

export interface ContainerProps {
  /** The content to be rendered inside the container */
  children: ReactNode;
  /** Maximum width of the container */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Additional custom classes */
  className?: string;
}

/**
 * A standardized container component for consistent layout
 */
export default function Container({
  children,
  maxWidth = 'lg',
  className = ''
}: ContainerProps) {
  // Map maxWidth prop to Tailwind classes
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-3xl';
      case 'md':
        return 'max-w-5xl';
      case 'lg':
        return 'max-w-6xl';
      case 'xl':
        return 'max-w-7xl';
      case '2xl':
        return 'max-w-screen-2xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className={`${getMaxWidthClass()} mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
