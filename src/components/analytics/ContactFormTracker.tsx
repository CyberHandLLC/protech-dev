'use client';

import React, { useEffect, useState } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

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
  const { trackPageView, trackFormSubmission, trackLead, trackContact } = useFacebookEvents();
  const { trackPageView: trackGAPageView, trackConversion } = useGoogleTracking();
  
  const [hasTrackedView, setHasTrackedView] = useState(false);
  
  // Track form view once when component mounts
  useEffect(() => {
    if (!hasTrackedView) {
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
        setHasTrackedView(true);
      } catch (error) {
        console.error('Error tracking form view:', error);
      }
    }
  }, [hasTrackedView, formLocation, formType, serviceName, trackPageView, trackGAPageView]);
  
  // Track form submission when isSubmission is true
  useEffect(() => {
    if (isSubmission) {
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
    }
  }, [isSubmission, formData, formLocation, formType, serviceName, trackFormSubmission, trackLead, trackContact, trackConversion]);
  
  return <>{children}</>;
}
