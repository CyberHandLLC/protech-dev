'use client';

import React, { useState } from 'react';
import ContentViewTracker from '@/components/analytics/ContentViewTracker';
import ServicePageTracker from '@/components/analytics/ServicePageTracker';
import BlogPostTracker from '@/components/analytics/BlogPostTracker';
import LocationFinderTracker from '@/components/analytics/LocationFinderTracker';
import PhoneCallTracker from '@/components/analytics/PhoneCallTracker';

/**
 * Test Tracking Page
 * 
 * This page showcases all the tracking components and allows you to test them.
 */
export default function TestTrackingPage() {
  const [selectedTracker, setSelectedTracker] = useState<string>('');
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Analytics Tracking Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a tracking component to test:</h2>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className={`px-4 py-2 rounded ${selectedTracker === 'content' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTracker('content')}
          >
            Content View Tracker (About Page)
          </button>
          
          <button 
            className={`px-4 py-2 rounded ${selectedTracker === 'service' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTracker('service')}
          >
            Service Page Tracker
          </button>
          
          <button 
            className={`px-4 py-2 rounded ${selectedTracker === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTracker('blog')}
          >
            Blog Post Tracker
          </button>
          
          <button 
            className={`px-4 py-2 rounded ${selectedTracker === 'location' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTracker('location')}
          >
            Location Finder Tracker
          </button>
          
          <button 
            className={`px-4 py-2 rounded ${selectedTracker === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTracker('phone')}
          >
            Phone Call Tracker
          </button>
        </div>
      </div>
      
      {selectedTracker && (
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Testing: {selectedTracker}</h3>
          
          {selectedTracker === 'content' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This component will track a view of the About page content when it loads.
                Check your Facebook and Google Analytics dashboards for the event.
              </p>
              
              <h2 className="text-2xl">About ProTech HVAC</h2>
              <p className="mb-4">This is a simulation of your about page content.</p>
              
              {/* The actual tracker */}
              <ContentViewTracker
                contentName="About ProTech HVAC"
                contentType="about_page"
                contentCategory="Company Information"
                additionalData={{
                  page_section: 'main',
                  engagement_time: 30
                }}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Event sent:</strong> ContentViewTracker event for "About ProTech HVAC"
                </p>
                <p className="text-xs text-gray-500">
                  Open your browser console to see the tracking confirmation.
                </p>
              </div>
            </div>
          )}
          
          {selectedTracker === 'service' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This component will track a view of a service page when it loads.
                Check your Facebook and Google Analytics dashboards for the event.
              </p>
              
              <h2 className="text-2xl">AC Repair Services</h2>
              <p>Our professional AC repair services keep your home cool all summer.</p>
              
              {/* The actual tracker */}
              <ServicePageTracker
                serviceName="AC Repair Services"
                serviceCategory="Cooling"
                serviceDescription="Professional AC repair and maintenance"
                estimatedValue={249}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Event sent:</strong> ServicePageTracker event for "AC Repair Services"
                </p>
                <p className="text-xs text-gray-500">
                  Open your browser console to see the tracking confirmation.
                </p>
              </div>
            </div>
          )}
          
          {selectedTracker === 'blog' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This component will track a view of a blog post when it loads.
                Check your Facebook and Google Analytics dashboards for the event.
              </p>
              
              <h2 className="text-2xl">5 Tips for Better HVAC Efficiency</h2>
              <p>Posted by John Smith on May 5, 2025</p>
              
              {/* The actual tracker */}
              <BlogPostTracker
                postTitle="5 Tips for Better HVAC Efficiency"
                postCategory="HVAC Maintenance"
                postAuthor="John Smith"
                postDate="2025-05-05"
                postTags={['efficiency', 'maintenance', 'summer', 'cooling']}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Event sent:</strong> BlogPostTracker event for "5 Tips for Better HVAC Efficiency"
                </p>
                <p className="text-xs text-gray-500">
                  Open your browser console to see the tracking confirmation.
                </p>
              </div>
            </div>
          )}
          
          {selectedTracker === 'location' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This component will track a location search when it loads.
                Check your Facebook and Google Analytics dashboards for the event.
              </p>
              
              <h2 className="text-2xl">Service Area: Cleveland</h2>
              <p>We provide HVAC services throughout the Cleveland metropolitan area.</p>
              
              {/* The actual tracker */}
              <LocationFinderTracker
                locationName="Cleveland Service Area"
                searchQuery="HVAC near Cleveland"
                city="Cleveland"
                zipCode="44101"
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Event sent:</strong> LocationFinderTracker event for "Cleveland Service Area"
                </p>
                <p className="text-xs text-gray-500">
                  Open your browser console to see the tracking confirmation.
                </p>
              </div>
            </div>
          )}
          
          {selectedTracker === 'phone' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the phone number below to test the phone call tracking.
                This will track the click event and then open your device's dialer.
              </p>
              
              <h2 className="text-2xl">Contact Us</h2>
              <p>Call us for immediate service:</p>
              
              {/* The actual tracker */}
              <PhoneCallTracker
                phoneNumber="330-642-4822"
                displayNumber="330-642-HVAC"
                source="Test Page"
                className="text-xl font-bold text-blue-600 hover:underline"
                showIcon={true}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm">
                  <strong>Click event:</strong> When you click the phone number above, a tracking event will be sent.
                </p>
                <p className="text-xs text-gray-500">
                  Open your browser console to see the tracking confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-12 p-4 bg-gray-100 rounded-md">
        <h2 className="font-bold mb-2">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>All trackers send events to both Facebook Pixel and Facebook Conversions API (server-side)</li>
          <li>Google Analytics 4 events are sent for all interactions</li>
          <li>Open your browser console and network tab to see the events being fired</li>
          <li>The trackers use the hooks we've created: useFacebookEvents, useFacebookServerEvents, and useGoogleTracking</li>
          <li>No additional setup is needed - just add these components to your pages</li>
        </ul>
      </div>
    </div>
  );
}
