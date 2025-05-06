'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client-side component
const FacebookServerEventTester = dynamic(
  () => import('@/components/FacebookServerEventTester'),
  { ssr: false }
);

/**
 * Client component wrapper for the Facebook Server Event Tester
 */
export default function ServerEventTestClient() {
  return (
    <>
      <FacebookServerEventTester />
    </>
  );
}
