'use client';

import { useEffect } from 'react';

/**
 * FormInteractionTracker Component
 * 
 * Tracks user interactions with forms:
 * - Form field focus (user started filling form)
 * - Form field completion
 * - Form abandonment (started but didn't submit)
 */
export default function FormInteractionTracker() {
  useEffect(() => {
    const trackedForms = new Set<HTMLFormElement>();
    const formInteractions = new Map<HTMLFormElement, {
      started: boolean;
      fields: Set<string>;
      startTime: number;
    }>();

    const handleFormFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form');
        
        if (form && !trackedForms.has(form)) {
          trackedForms.add(form);
          
          // Track form interaction start
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'FormStarted', {
              form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
              page_path: window.location.pathname,
              field_name: (target as HTMLInputElement).name || (target as HTMLInputElement).id
            });
            
            console.log('[FormInteraction] User started filling form');
          }
          
          // Initialize tracking data
          formInteractions.set(form, {
            started: true,
            fields: new Set([(target as HTMLInputElement).name]),
            startTime: Date.now()
          });
        } else if (form) {
          // Track additional field interactions
          const interaction = formInteractions.get(form);
          if (interaction) {
            interaction.fields.add((target as HTMLInputElement).name);
          }
        }
      }
    };

    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      
      if (formInteractions.has(form)) {
        const interaction = formInteractions.get(form)!;
        const timeSpent = Date.now() - interaction.startTime;
        
        // Track successful form completion
        if (typeof window !== 'undefined' && window.fbq) {
          // Track custom FormCompleted event (detailed analytics)
          window.fbq('trackCustom', 'FormCompleted', {
            form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
            page_path: window.location.pathname,
            fields_filled: interaction.fields.size,
            time_spent_seconds: Math.round(timeSpent / 1000)
          });
          
          // Track standard Lead event (lead generation campaigns)
          window.fbq('track', 'Lead', {
            content_name: 'Service Inquiry',
            content_category: 'lead_generation',
            value: 100, // Estimated lead value in dollars
            currency: 'USD'
          });
          
          // Track standard Schedule event (appointment scheduling campaigns)
          window.fbq('track', 'Schedule', {
            content_name: 'HVAC Service Appointment Request',
            content_category: 'appointment_scheduling',
            value: 150, // Estimated appointment value
            currency: 'USD'
          });
          
          console.log('[FormInteraction] Form completed - Lead and Schedule events tracked');
        }
        
        // Clean up
        formInteractions.delete(form);
        trackedForms.delete(form);
      }
    };

    // Track form abandonment on page unload
    const handleBeforeUnload = () => {
      formInteractions.forEach((interaction, form) => {
        if (interaction.started) {
          const timeSpent = Date.now() - interaction.startTime;
          
          // Track form abandonment
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'FormAbandoned', {
              form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
              page_path: window.location.pathname,
              fields_filled: interaction.fields.size,
              time_spent_seconds: Math.round(timeSpent / 1000)
            });
            
            console.log('[FormInteraction] Form abandoned');
          }
        }
      });
    };

    // Add event listeners
    document.addEventListener('focusin', handleFormFocus);
    document.addEventListener('submit', handleFormSubmit);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('focusin', handleFormFocus);
      document.removeEventListener('submit', handleFormSubmit);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
