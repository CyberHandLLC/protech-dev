'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import is allowed in client components
const GoogleTrackingTester = dynamic(
  () => import('@/components/GoogleTrackingTester'),
  { ssr: false }
);

/**
 * Client component wrapper for the Google Tracking Tester
 * This fixes the SSR issue with dynamic imports
 */
export default function GoogleTrackingTesterClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="p-8 text-center text-ivory">Loading tracking tools...</div>;
  }
  
  return <GoogleTrackingTester />;
}
