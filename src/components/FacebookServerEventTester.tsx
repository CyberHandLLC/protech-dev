'use client';

import React, { useState } from 'react';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';

/**
 * Component for testing Facebook server-side events
 * This will be used to verify that events are properly being sent to Facebook
 */
export default function FacebookServerEventTester() {
  const [eventResult, setEventResult] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('ViewContent');
  const {
    isLoading,
    error,
    trackContact,
    trackViewContent,
    trackLead,
    trackSubscribe,
    trackFindLocation,
    trackSchedule
  } = useFacebookServerEvents();

  const handleTestEvent = async () => {
    let result;

    // Common data for all events
    const testUserData = {
      email: 'test@example.com',
      phone: '3306421111',
      firstName: 'Test',
      lastName: 'User',
      city: 'Akron',
      state: 'OH',
      zipCode: '44333',
    };

    // Send the appropriate event based on selection
    switch (selectedEvent) {
      case 'Contact':
        result = await trackContact({
          source: 'Phone Call',
          userData: testUserData,
        });
        break;

      case 'ViewContent':
        result = await trackViewContent({
          contentName: 'AC Installation Page',
          contentCategory: 'services',
          contentType: 'product_info',
          userData: testUserData,
          value: 150,
          currency: 'USD',
        });
        break;

      case 'Lead':
        result = await trackLead({
          formName: 'Contact Form',
          leadId: `lead_${Date.now()}`,
          value: 250,
          userData: testUserData,
        });
        break;

      case 'Subscribe':
        result = await trackSubscribe({
          subscriptionId: `sub_${Date.now()}`,
          value: 99,
          userData: testUserData,
        });
        break;

      case 'FindLocation':
        result = await trackFindLocation({
          locationName: 'Northeast Ohio Service Area',
          searchQuery: 'HVAC services near me',
          userData: testUserData,
        });
        break;

      case 'Schedule':
        result = await trackSchedule({
          appointmentType: 'AC Maintenance',
          preferredTime: '2023-06-15T14:00:00',
          value: 149,
          userData: testUserData,
        });
        break;

      default:
        break;
    }

    setEventResult(result);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-navy-light rounded-lg shadow-lg my-10">
      <h2 className="text-2xl font-bold text-white mb-6">Facebook Server Event Tester</h2>
      
      <div className="mb-6">
        <label className="block text-ivory mb-2">Event Type:</label>
        <select
          className="w-full p-2 rounded bg-dark-blue text-white border border-navy-light"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="ViewContent">ViewContent</option>
          <option value="Contact">Contact</option>
          <option value="Lead">Lead</option>
          <option value="Subscribe">Subscribe</option>
          <option value="FindLocation">FindLocation</option>
          <option value="Schedule">Schedule</option>
        </select>
      </div>

      <button
        onClick={handleTestEvent}
        disabled={isLoading}
        className="w-full py-3 bg-red hover:bg-red-dark text-white font-medium rounded transition-colors"
      >
        {isLoading ? 'Sending...' : 'Test Selected Event'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-light/20 border border-red rounded">
          <p className="text-ivory">{error}</p>
        </div>
      )}

      {eventResult && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-ivory mb-2">Result:</h3>
          <pre className="bg-dark-blue p-4 rounded overflow-auto max-h-60 text-sm text-ivory-light">
            {JSON.stringify(eventResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
