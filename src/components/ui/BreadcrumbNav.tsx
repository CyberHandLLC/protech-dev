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
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center space-x-2">
        <li className="flex items-center">
          <Link href="/" className="text-ivory hover:text-red-light transition-colors">
            Home
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-ivory/50">/</span>
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