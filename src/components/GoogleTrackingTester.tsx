'use client';

import React, { useState } from 'react';
import useGoogleTracking from '@/hooks/useGoogleTracking';

/**
 * Component for testing Google tracking events
 * This will allow verifying that Google Analytics 4 and Google Ads events are working
 */
export default function GoogleTrackingTester() {
  const [eventResult, setEventResult] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('service_view');
  const [formName, setFormName] = useState<string>('Contact Form');
  const [serviceName, setServiceName] = useState<string>('AC Installation');
  const [serviceCategory, setServiceCategory] = useState<string>('cooling');
  const [phoneSource, setPhoneSource] = useState<string>('Header');
  
  const {
    isTracking,
    error,
    trackPageView,
    trackPhoneCall,
    trackFormSubmission,
    trackServiceView
  } = useGoogleTracking();

  const handleTestEvent = async () => {
    let result: boolean;
    const timestamp = new Date().toISOString();
    
    // Send the appropriate event based on selection
    switch (selectedEvent) {
      case 'phone_call':
        result = trackPhoneCall(phoneSource, 50);
        break;

      case 'form_submission':
        result = trackFormSubmission(formName, 'lead', 100);
        break;

      case 'service_view':
        result = trackServiceView(serviceName, serviceCategory, 20);
        break;

      case 'page_view':
        result = trackPageView('page', document.title);
        break;

      default:
        result = false;
    }

    setEventResult(
      result 
        ? `✅ Successfully sent ${selectedEvent} event at ${timestamp}` 
        : `❌ Failed to send ${selectedEvent} event`
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-navy-light rounded-lg shadow-lg mt-6 mb-10">
      <h2 className="text-2xl font-bold text-white mb-6">Google Tracking Tester</h2>
      
      <div className="mb-6">
        <label className="block text-ivory mb-2">Event Type:</label>
        <select
          className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="service_view">Service View (GA4)</option>
          <option value="page_view">Page View (GA4)</option>
          <option value="phone_call">Phone Call (GA4 + Ads)</option>
          <option value="form_submission">Form Submission (GA4 + Ads)</option>
        </select>
      </div>

      {selectedEvent === 'phone_call' && (
        <div className="mb-6">
          <label className="block text-ivory mb-2">Phone Source:</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
            value={phoneSource}
            onChange={(e) => setPhoneSource(e.target.value)}
            placeholder="Header, Footer, Contact Page, etc."
          />
        </div>
      )}

      {selectedEvent === 'form_submission' && (
        <div className="mb-6">
          <label className="block text-ivory mb-2">Form Name:</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contact Form, Quote Request, etc."
          />
        </div>
      )}

      {selectedEvent === 'service_view' && (
        <>
          <div className="mb-6">
            <label className="block text-ivory mb-2">Service Name:</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="AC Installation, Furnace Repair, etc."
            />
          </div>
          <div className="mb-6">
            <label className="block text-ivory mb-2">Service Category:</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              placeholder="cooling, heating, maintenance, etc."
            />
          </div>
        </>
      )}

      <button
        onClick={handleTestEvent}
        disabled={isTracking}
        className="w-full py-3 bg-teal hover:bg-teal/80 text-white font-medium rounded transition-colors"
      >
        {isTracking ? 'Sending...' : 'Test Selected Event'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-light/20 border border-red rounded">
          <p className="text-ivory">{error}</p>
        </div>
      )}

      {eventResult && (
        <div className={`mt-4 p-4 rounded ${eventResult.includes('✅') ? 'bg-teal/20 border-teal' : 'bg-red-light/20 border-red'} border`}>
          <p className="text-ivory">{eventResult}</p>
        </div>
      )}
      
      <div className="mt-6 border-t border-navy pt-4 text-ivory/80 text-sm">
        <p className="mb-2">To verify these events:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Open Chrome DevTools (F12) and go to the Console tab</li>
          <li>Check for Google Analytics and Google Ads tracking logs</li>
          <li>Check Google Tag Assistant Chrome extension (if installed)</li>
          <li>View events in GA4 DebugView and Google Tag Manager Preview mode</li>
        </ol>
      </div>
    </div>
  );
}
