import { Metadata } from 'next';
import FacebookEventTester from '@/components/FacebookEventTester';

export const metadata: Metadata = {
  title: 'Facebook Event Testing',
  description: 'Test page for Facebook Pixel and Conversions API events',
  robots: {
    index: false,
    follow: false
  }
};

export default function TestFacebookEventsPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-2xl font-bold text-navy mb-6">Facebook Event Testing Page</h1>
      
      <div className="prose max-w-none mb-8">
        <h2>Testing Instructions</h2>
        <ol>
          <li>Keep the Facebook Events Manager Test Events page open in another tab</li>
          <li>Make sure you've entered your website URL and the test code (TEST69110) in Events Manager</li>
          <li>Click the buttons below to fire different test events</li>
          <li>Check the Events Manager tab to see if the events are being received</li>
        </ol>
        
        <p>
          <strong>Note:</strong> Events may take a few seconds to appear in the Test Events tool. 
          If events are not appearing, try refreshing the Test Events page.
        </p>
      </div>
      
      <FacebookEventTester />
      
      <div className="mt-12 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your ad blocker is disabled or has an exception for this domain</li>
          <li>Verify that the pixel ID in the code matches your Facebook Pixel ID (1201375401668813)</li>
          <li>Check browser console for any errors related to Facebook Pixel</li>
          <li>Try clearing your browser cache and cookies</li>
          <li>Test in an incognito/private window to rule out extension interference</li>
        </ul>
      </div>
    </main>
  );
}
