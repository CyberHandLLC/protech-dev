'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  overrideItems?: boolean;
  className?: string;
}

/**
 * BreadcrumbsWithSchema Component
 * 
 * Displays breadcrumb navigation and adds structured data for SEO
 * This helps both users navigate and search engines understand your site structure
 */
export default function BreadcrumbsWithSchema({ 
  items, 
  overrideItems = false,
  className = ''
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generate breadcrumbs automatically from the pathname if not provided
  const breadcrumbs: BreadcrumbItem[] = overrideItems && items ? items : generateBreadcrumbs(pathname, items);
  
  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on the homepage or if there's only one level
  }

  // Generate the schema data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://protechhvac.com${item.href}` // Full URL required for schema
    }))
  };

  return (
    <>
      {/* Add structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Visual breadcrumbs for users */}
      <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
        <ol className="flex flex-wrap items-center text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-ivory/50" aria-hidden="true">
                  /
                </span>
              )}
              
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page" className="text-red">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link 
                  href={breadcrumb.href}
                  className="text-ivory/70 hover:text-ivory transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * Helper function to generate breadcrumbs from the pathname
 */
function generateBreadcrumbs(pathname: string, customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  // Always include Home as the first breadcrumb
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
  
  if (pathname === '/') {
    return breadcrumbs;
  }
  
  // Handle special case for services
  if (pathname.startsWith('/services')) {
    breadcrumbs.push({ label: 'Services', href: '/services' });
  }
  
  // If custom items are provided, add them after the standard home + services
  if (customItems) {
    return [...breadcrumbs, ...customItems];
  }
  
  // Otherwise generate from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    // Skip services as we've already added it
    if (segment === 'services') return;
    
    currentPath += `/${segment}`;
    
    // Format the segment label (remove hyphens, capitalize first letter)
    const label = formatBreadcrumbLabel(segment);
    
    // Only add if not already in breadcrumbs
    if (!breadcrumbs.some(item => item.href === currentPath)) {
      breadcrumbs.push({
        label,
        href: currentPath
      });
    }
  });
  
  return breadcrumbs;
}

/**
 * Helper function to format breadcrumb labels
 */
function formatBreadcrumbLabel(segment: string): string {
  // Decode URL parameters
  segment = decodeURIComponent(segment);
  
  // Replace hyphens with spaces
  segment = segment.replace(/-/g, ' ');
  
  // Capitalize first letter of each word
  return segment
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
