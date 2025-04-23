'use client';

import { ReactNode, useEffect, useState } from 'react';

/**
 * ClientOnly component ensures content is only rendered on the client
 * This prevents hydration mismatches and delays JavaScript execution
 * until explicitly needed for interactive components
 */
interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only render children client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return fallback;
  }
  
  return <>{children}</>;
}
