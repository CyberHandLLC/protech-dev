'use client';

// Type definition for the Facebook Pixel function
interface FacebookPixel {
  (event: string, eventName: string, params?: any): void;
  (event: string, params?: any): void;
}

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq?: FacebookPixel;
  }
}

import { useState } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import Button from './ui/Button';

/**
 * Facebook Event Tester Component
 * 
 * This component provides buttons to manually trigger Facebook events
 * for testing purposes. Use this when working with Facebook's Test Events tool.
 */
export default function FacebookEventTester() {
  const [lastEvent, setLastEvent] = useState<string>('');
  const { 
    trackLead, 
    trackContact, 
    trackFormSubmission,
    trackSchedule
  } = useFacebookEvents();
  
  // Facebook Pixel is already typed at the top of the file
  
  const triggerPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      setLastEvent('PageView');
    }
  };
  
  const triggerLead = async () => {
    await trackLead({
      userData: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '5551234567'
      },
      customData: {
        value: 100,
        currency: 'USD',
        contentCategory: 'Test Lead',
        contentName: 'Lead Event'
      }
    });
    setLastEvent('Lead');
  };
  
  const triggerContact = async () => {
    await trackContact({
      userData: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '5551234567'
      },
      customData: {
        contentCategory: 'Test Contact',
        contentName: 'Contact Event',
        status: 'submitted'
      }
    });
    setLastEvent('Contact');
  };
  
  const triggerFormSubmission = async () => {
    await trackFormSubmission({
      userData: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '5551234567'
      },
      customData: {
        contentCategory: 'Test Form',
        contentName: 'Form Submission Event'
      }
    });
    setLastEvent('FormSubmission');
  };
  
  const triggerSchedule = async () => {
    await trackSchedule({
      userData: {
        firstName: 'Test',
        lastName: 'User',
        phone: '5551234567'
      },
      customData: {
        contentCategory: 'Test Schedule',
        contentName: 'AC Repair',
        status: 'scheduled'
      }
    });
    setLastEvent('Schedule');
  };
  
  return (
    <div className="p-4 bg-navy/10 rounded-lg my-4 shadow-sm border border-navy/20">
      <h2 className="text-lg font-semibold mb-3">Facebook Event Tester</h2>
      <p className="text-sm mb-4">Use these buttons to test Facebook Pixel events.</p>
      
      <div className="space-y-2">
        <Button onClick={triggerPageView} size="sm" variant="secondary">
          Test PageView Event
        </Button>
        
        <Button onClick={triggerLead} size="sm" variant="secondary">
          Test Lead Event
        </Button>
        
        <Button onClick={triggerContact} size="sm" variant="secondary">
          Test Contact Event
        </Button>
        
        <Button onClick={triggerFormSubmission} size="sm" variant="secondary">
          Test Form Submission
        </Button>
        
        <Button onClick={triggerSchedule} size="sm" variant="secondary">
          Test Schedule Event
        </Button>
      </div>
      
      {lastEvent && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm">
          Event fired: <strong>{lastEvent}</strong>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: Make sure the Facebook Test Events page is open in another tab while testing.</p>
        <p>Test code: <strong>TEST69110</strong></p>
      </div>
    </div>
  );
}
