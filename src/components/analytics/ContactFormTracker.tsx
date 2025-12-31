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
      // All conversion events (Lead, Schedule, FormCompleted) are now handled by FormInteractionTracker
      // This component is deprecated and should be removed in the future
      // Keeping only Google Analytics tracking here for now
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
