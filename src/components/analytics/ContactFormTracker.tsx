'use client';

import React, { useEffect, useRef } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';

interface ContactFormTrackerProps {
  children: React.ReactNode;
  formLocation: string;
  serviceName?: string;
  formType?: string;
  isSubmission?: boolean;
  formData?: {
    name?: string;
    email?: string;
    phone?: string;
    zipCode?: string;
    message?: string;
    service?: string;
    [key: string]: any;
  };
}

/**
 * ContactFormTracker Component
 * 
 * Tracks contact form views and submissions for comprehensive analytics
 * Uses deduplication to prevent duplicate events
 * Sends data to Facebook Pixel and Google Analytics
 */
export default function ContactFormTracker({
  children,
  formLocation,
  serviceName,
  formType = 'contact',
  isSubmission = false,
  formData = {}
}: ContactFormTrackerProps) {
  // Initialize tracking hooks
  const { trackPageView, trackFormSubmission, trackLead, trackContact } = useFacebookEvents();
  const { trackContact: trackServerContact } = useFacebookServerEvents();
  const { trackPageView: trackGAPageView, trackConversion } = useGoogleTracking();
  
  // Use refs to track events and prevent duplicates
  const viewTrackedRef = useRef(false);
  const submissionTrackedRef = useRef(false);
  const lastTrackedTimeRef = useRef(0);
  
  // Track form view once when component mounts
  useEffect(() => {
    // Skip if already tracked
    if (viewTrackedRef.current) return;
    
    // Mark as tracked to prevent future duplicate events
    viewTrackedRef.current = true;
    
    try {
      // Track the form view with Facebook client-side
      trackPageView({
        customData: {
          contentName: formType === 'contact' ? 'Contact Form' : 'Quote Request',
          contentType: 'form_view',
          contentCategory: 'Forms'
        }
      });
      
      // Track with Google Analytics
      trackGAPageView('form_view', `${formType} Form - ${formLocation}`, {
        form_type: formType,
        form_location: formLocation,
        service_requested: serviceName || 'General'
      });
      
      console.log(`Form view tracked: ${formType} at ${formLocation}`);
    } catch (error) {
      console.error('Error tracking form view:', error);
    }
  }, [formLocation, formType, serviceName, trackPageView, trackGAPageView]);
  
  // Track form submission when isSubmission is true
  useEffect(() => {
    // Skip if not a submission or already tracked
    if (!isSubmission || submissionTrackedRef.current) return;
    
    // Prevent duplicate submission tracking
    submissionTrackedRef.current = true;
    
    // Add a time-based throttle - don't fire more than once every 2 seconds
    const now = Date.now();
    if (now - lastTrackedTimeRef.current < 2000) return;
    lastTrackedTimeRef.current = now;
    
    try {
      // Client-side Facebook tracking
      trackFormSubmission({
        customData: {
          contentName: formType === 'contact' ? 'Contact Form' : 'Quote Request',
          contentType: 'form_submission',
          contentCategory: 'Forms'
        },
        userData: {
          phone: formData.phone,
          email: formData.email
        }
      });
      
      // Server-side tracking
      trackServerContact({
        source: `${formType} Form Submission - ${formLocation}`
      });
      
      // Also track as a lead with Facebook client-side
      trackLead({
        customData: {
          contentType: 'lead',
          contentName: `${formType} Form Lead - ${formLocation}`,
          contentCategory: 'Lead Generation'
        },
        userData: {
          phone: formData.phone,
          email: formData.email
        }
      });
      
      // Track as contact for more complete tracking
      trackContact({
        customData: {
          contentType: 'contact_form',
          contentName: `${formType} Form - ${formLocation}`,
          contentCategory: 'Lead Generation'
        },
        userData: {
          email: formData.email,
          phone: formData.phone
        }
      });
      
      // Google Analytics tracking
      trackConversion(
        'form_submission', 
        'form_submit', 
        {
          form_type: formType,
          form_location: formLocation,
          service_requested: serviceName || formData.service || 'General',
          has_contact: Boolean(formData.phone || formData.email)
        }
      );
      
      console.log(`Form submission tracked: ${formType} at ${formLocation}`);
    } catch (error) {
      console.error('Error tracking form submission:', error);
    }
  }, [isSubmission, formData, formLocation, formType, serviceName, trackFormSubmission, trackLead, trackContact, trackConversion, trackServerContact]);
  
  // Return the children wrapped in a fragment
  return <>{children}</>;
}
