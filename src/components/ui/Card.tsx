'use client';

import React, { ReactNode } from 'react';

export interface CardProps {
  /** The content to be rendered inside the card */
  children: ReactNode;
  /** Whether to add hover effects */
  interactive?: boolean;
  /** Additional custom classes */
  className?: string;
  /** Optional onClick handler for interactive cards */
  onClick?: () => void;
  /** Optional inline style object */
  style?: React.CSSProperties;
}

/**
 * A standardized card component with consistent styling
 */
export default function Card({
  children,
  interactive = false,
  className = '',
  onClick,
  style
}: CardProps) {
  return (
    <div 
      className={`
        bg-dark-blue 
        rounded-xl 
        p-6 
        border 
        border-dark-blue-light 
        ${interactive ? 'hover:border-red cursor-pointer transition-colors group' : ''}
        ${className}
      `}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      style={style}
    >
      {children}
    </div>
  );
}
