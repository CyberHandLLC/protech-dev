'use client';

import React, { ReactNode } from 'react';

export interface SectionProps {
  /** The content to be rendered inside the section */
  children: ReactNode;
  /** Background color class for the section */
  bgColor?: 'navy' | 'dark-blue' | 'navy-light' | 'gradient' | 'white' | 'ivory'; 
  /** Additional padding classes */
  padding?: string;
  /** Additional margin classes */
  margin?: string;
  /** Additional custom classes */
  className?: string;
  /** ID for the section (useful for navigation) */
  id?: string;
}

/**
 * A standardized section component for consistent layout
 */
export default function Section({
  children,
  bgColor = 'navy',
  padding = 'py-16 px-4 md:px-8',
  margin = '',
  className = '',
  id
}: SectionProps) {
  const getBgColorClass = () => {
    switch (bgColor) {
      case 'navy':
        return 'bg-navy';
      case 'dark-blue':
        return 'bg-dark-blue';
      case 'navy-light':
        return 'bg-navy-light';
      case 'gradient':
        return 'bg-navy'; // Changed from gradient to solid navy
      case 'white':
        return 'bg-white';
      case 'ivory':
        return 'bg-ivory';
      default:
        return 'bg-navy';
    }
  };

  return (
    <section 
      id={id}
      className={`${getBgColorClass()} ${padding} ${margin} ${className}`}
    >
      {children}
    </section>
  );
}
