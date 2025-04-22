'use client';

import React, { ReactNode } from 'react';

export interface IconFeatureProps {
  /** The icon to display */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Make the item interactive */
  interactive?: boolean;
  /** Optional action URL */
  href?: string;
  /** Additional custom classes */
  className?: string;
}

/**
 * A standardized icon feature component for displaying features with consistent styling
 */
export default function IconFeature({
  icon,
  title,
  description,
  interactive = false,
  href,
  className = ''
}: IconFeatureProps) {
  return (
    <div className={`group ${className}`}>
      <div className="relative">
        {interactive && (
          <div className="absolute -left-[5px] top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-dark-blue-light group-hover:bg-red transition-colors"></div>
        )}
        
        <div className={`flex items-start gap-3 sm:gap-4 ${interactive ? 'border-l-2 border-dark-blue-light pl-4 sm:pl-6 py-2 group-hover:border-red transition-colors' : ''}`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-navy-light to-dark-blue-light flex items-center justify-center flex-shrink-0 mt-1">
            {icon}
          </div>
          
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold text-white ${interactive ? 'group-hover:text-red transition-colors' : ''}`}>
              {title}
            </h3>
            
            <p className="text-ivory/80 mt-1 sm:mt-2 text-sm sm:text-base">{description}</p>
            
            {href && (
              <a 
                href={href}
                className="mt-2 sm:mt-3 text-red-light hover:text-red font-medium flex items-center gap-1 group-hover:underline text-sm sm:text-base"
              >
                <span>Learn More</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
