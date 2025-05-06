import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import GoogleTrackingTesterClient from './GoogleTrackingTesterClient';

export const metadata: Metadata = {
  title: 'Google Tracking Tester | ProTech HVAC',
  description: 'Test Google Analytics 4 and Google Ads tracking for ProTech HVAC',
};

export default function TestGoogleTrackingPage() {
  return (
    <PageLayout className="bg-navy">
      <div className="max-w-7xl mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Google Tracking Test Suite
        </h1>
        <p className="text-lg text-ivory/80 text-center mb-10">
          Use this page to test tracking events with Google Analytics 4 and Google Ads
        </p>
        
        <GoogleTrackingTesterClient />
        
        <div className="mt-10 bg-navy-light rounded-lg p-6 text-ivory max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">About Google Tracking</h2>
          <p className="mb-4">
            This implementation includes a complete Google tracking stack:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Google Tag Manager (GTM)</strong> - Container ID: GTM-T6QSRR5H</li>
            <li><strong>Google Analytics 4 (GA4)</strong> - Measurement ID: G-7H1V0PZ9YV</li>
            <li><strong>Google Ads Conversion Tracking</strong> - Conversion ID: AW-11287044712</li>
          </ul>
          <p className="mb-4">
            Events tracked through this system are sent both directly to Google Analytics 4 and through
            Google Tag Manager, ensuring maximum compatibility and reliability.
          </p>
          <p>
            After testing, you can verify events in your Google Analytics 4 property under 
            DebugView, and in Google Ads under Conversions.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
