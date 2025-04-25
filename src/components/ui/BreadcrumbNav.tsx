import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm font-medium ${className}`}>
      <ol className="flex flex-wrap items-center space-x-2">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="text-ivory hover:text-red-light transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-ivory/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            {item.isCurrentPage ? (
              <span className="text-red-light font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              item.href ? (
                <Link 
                  href={item.href}
                  className="text-ivory hover:text-red-light transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-ivory/70">{item.label}</span>
              )
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}