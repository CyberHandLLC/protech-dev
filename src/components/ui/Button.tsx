'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** URL if the button should act as a link */
  href?: string;
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional custom classes */
  className?: string;
  /** Optional onClick handler */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional icon to display before content */
  iconBefore?: ReactNode;
  /** Optional icon to display after content */
  iconAfter?: ReactNode;
  /** External link attributes */
  external?: boolean;
  /** ARIA label for better accessibility */
  ariaLabel?: string;
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * A standardized button component with consistent styling
 */
export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  iconBefore,
  iconAfter,
  external = false,
  ariaLabel,
  type
}: ButtonProps) {
  // Generate classes based on variant and size
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-red text-white hover:bg-red-dark';
      case 'secondary':
        return 'bg-dark-blue text-white hover:bg-dark-blue-light';
      case 'outline':
        return 'bg-transparent text-ivory border border-ivory/40 hover:bg-white/10';
      case 'text':
        return 'bg-transparent text-ivory hover:text-red';
      default:
        return 'bg-red text-white hover:bg-red-dark';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-5 py-2.5';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-5 py-2.5';
    }
  };

  const allClasses = `
    ${getVariantClasses()} 
    ${getSizeClasses()} 
    rounded-lg 
    transition-colors 
    font-medium 
    inline-flex 
    items-center 
    justify-center
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const content = (
    <>
      {iconBefore && <span className="mr-2">{iconBefore}</span>}
      {children}
      {iconAfter && <span className="ml-2">{iconAfter}</span>}
    </>
  );

  if (href) {
    const externalProps = external ? { 
      target: "_blank", 
      rel: "noopener noreferrer" 
    } : {};
    
    return (
      <Link
        href={href}
        className={allClasses}
        aria-label={ariaLabel}
        {...externalProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
      aria-label={ariaLabel}
      type={type || 'button'}
    >
      {content}
    </button>
  );
}
