import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import dynamic from 'next/dynamic';

// Dynamically import the client-side component
const FacebookServerEventTester = dynamic(
  () => import('@/components/FacebookServerEventTester'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Facebook Server Events Tester | ProTech HVAC',
  description: 'Test Facebook Conversions API events for ProTech HVAC',
};

export default function TestFacebookServerEventsPage() {
  return (
    <PageLayout className="bg-navy">
      <div className="max-w-7xl mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Facebook Conversions API Tester
        </h1>
        <p className="text-lg text-ivory/80 text-center mb-10">
          Use this page to test different events using the Facebook Conversions API
        </p>
        
        <FacebookServerEventTester />
        
        <div className="mt-10 bg-navy-light rounded-lg p-6 text-ivory max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">About Facebook Server Events</h2>
          <p className="mb-4">
            These events are sent server-side using the Facebook Conversions API, which helps ensure
            reliable tracking even when client-side tracking (like the Facebook Pixel) is blocked by
            ad blockers or browser privacy settings.
          </p>
          <p className="mb-4">
            Server events have the following advantages:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>More reliable tracking (not affected by ad blockers)</li>
            <li>Better privacy compliance (data can be hashed server-side)</li>
            <li>More accurate conversion attribution</li>
            <li>Improved ad targeting and optimization</li>
          </ul>
          <p>
            After testing, you can verify events in your Facebook Events Manager and see if they are
            being properly received.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
