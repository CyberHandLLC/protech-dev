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
      // Client-side Facebook tracking with enhanced advanced matching
      trackFormSubmission({
        customData: {
          contentName: formType === 'contact' ? 'Contact Form' : 'Quote Request',
          contentType: 'form_submission',
          contentCategory: 'Forms',
          value: 150.00,  // Estimated value of a form submission for HVAC
          currency: 'USD'
        },
        userData: {
          // Advanced matching parameters with complete user data
          phone: formData.phone,
          email: formData.email,
          // Extract first and last name if available
          firstName: formData.name ? formData.name.split(' ')[0] : undefined,
          lastName: formData.name ? formData.name.split(' ').slice(1).join(' ') : undefined,
          // Critical - Add zip code for better geographic targeting
          zip: formData.zipCode || formData.zip || undefined,
          // Add location data if available
          city: formData.city,
          state: formData.state || 'OH', // Default to Ohio for ProTech HVAC
          externalId: `form_${Date.now()}` // Unique identifier for this lead
        }
      });
      
      // Server-side tracking
      trackServerContact({
        source: `${formType} Form Submission - ${formLocation}`
      });
      
      // Also track as a lead with Facebook client-side - with enhanced data
      trackLead({
        customData: {
          contentType: 'lead',
          contentName: `${formType} Form Lead - ${formLocation}`,
          contentCategory: 'Lead Generation',
          value: 150.00, // Consistent lead value
          currency: 'USD',
          // Add service information when available
          contentIds: formData.service ? [formData.service] : undefined
        },
        userData: {
          // Complete advanced matching data set
          phone: formData.phone,
          email: formData.email,
          firstName: formData.name ? formData.name.split(' ')[0] : undefined,
          lastName: formData.name ? formData.name.split(' ').slice(1).join(' ') : undefined,
          zip: formData.zipCode || formData.zip || undefined,
          city: formData.city,
          state: formData.state || 'OH',
          externalId: `lead_${formLocation}_${Date.now()}`
        }
      });
      
      // Track as contact for more complete tracking with enhanced user data
      trackContact({
        customData: {
          contentType: 'contact_form',
          contentName: `${formType} Form - ${formLocation}`,
          contentCategory: 'Lead Generation',
          value: 150.00, // Standard contact value for HVAC services
          currency: 'USD',
          // Add message and service details when available for better attribution
          status: formData.message ? 'With Message' : 'No Message',
          searchString: formData.service || serviceName || 'General'
        },
        userData: {
          // Full advanced matching data set
          email: formData.email,
          phone: formData.phone,
          firstName: formData.name ? formData.name.split(' ')[0] : undefined,
          lastName: formData.name ? formData.name.split(' ').slice(1).join(' ') : undefined,
          zip: formData.zipCode || formData.zip || undefined,
          city: formData.city,
          state: formData.state || 'OH',
          // Optional - can include external ID for customer data platform integration
          externalId: `contact_${formLocation}_${Date.now()}`
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
