'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

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
          
          // Track form interaction start to Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'FormStarted', {
              form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
              page_path: window.location.pathname,
              field_name: (target as HTMLInputElement).name || (target as HTMLInputElement).id
            });
          }
          
          // Track to Vercel Analytics
          try {
            const formName = form.getAttribute('name') || form.getAttribute('id') || 'contact_form';
            track('form_start', {
              form_name: formName,
              page_path: window.location.pathname,
              field_name: (target as HTMLInputElement).name || (target as HTMLInputElement).id
            });
          } catch (error) {
            console.error('[FormInteraction] Vercel Analytics error:', error);
          }
          
          console.log('[FormInteraction] Form started - tracked to Meta + Vercel');
          
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
          // Generate unique event IDs for deduplication
          const leadEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 4);
          const scheduleEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 4);
          
          // Store event IDs for server-side sync
          try {
            sessionStorage.setItem('fb_lead_event_id', leadEventId);
            sessionStorage.setItem('fb_schedule_event_id', scheduleEventId);
          } catch (e) {
            console.warn('[FormInteraction] Could not store event IDs:', e);
          }
          
          // Track custom FormCompleted event (detailed analytics)
          window.fbq('trackCustom', 'FormCompleted', {
            form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
            page_path: window.location.pathname,
            fields_filled: interaction.fields.size,
            time_spent_seconds: Math.round(timeSpent / 1000)
          });
          
          // Track standard Lead event with Event ID (lead generation campaigns)
          (window.fbq as any)('track', 'Lead', {
            content_name: 'Service Inquiry',
            content_category: 'lead_generation',
            value: 100, // Estimated lead value in dollars
            currency: 'USD'
          }, { eventID: leadEventId });
          
          // Track standard Schedule event with Event ID (appointment scheduling campaigns)
          (window.fbq as any)('track', 'Schedule', {
            content_name: 'HVAC Service Appointment Request',
            content_category: 'appointment_scheduling',
            value: 150, // Estimated appointment value
            currency: 'USD'
          }, { eventID: scheduleEventId });
          
          // Track to Vercel Analytics
          try {
            const formName = form.getAttribute('name') || form.getAttribute('id') || 'contact_form';
            
            // Track Lead event
            track('lead', {
              value: 100,
              currency: 'USD',
              form_name: formName,
              content_category: 'lead_generation'
            });
            
            // Track Schedule event
            track('schedule', {
              value: 150,
              currency: 'USD',
              form_name: formName,
              content_category: 'appointment_scheduling'
            });
            
            // Track Form Complete event
            track('form_complete', {
              form_name: formName,
              page_path: window.location.pathname,
              fields_filled: interaction.fields.size
            });
            
            console.log('[FormInteraction] Vercel Analytics events tracked');
          } catch (error) {
            console.error('[FormInteraction] Vercel Analytics error:', error);
          }
          
          // Send to Conversions API for server-side tracking
          fetch('/api/facebook-conversions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              events: [
                {
                  event_name: 'Lead',
                  event_id: leadEventId,
                  event_time: Math.floor(Date.now() / 1000),
                  event_source_url: window.location.href,
                  action_source: 'website',
                  custom_data: {
                    content_name: 'Service Inquiry',
                    content_category: 'lead_generation',
                    value: 100,
                    currency: 'USD'
                  }
                },
                {
                  event_name: 'Schedule',
                  event_id: scheduleEventId,
                  event_time: Math.floor(Date.now() / 1000),
                  event_source_url: window.location.href,
                  action_source: 'website',
                  custom_data: {
                    content_name: 'HVAC Service Appointment Request',
                    content_category: 'appointment_scheduling',
                    value: 150,
                    currency: 'USD'
                  }
                }
              ]
            })
          }).catch(err => console.error('[FormInteraction] Server-side tracking error:', err));
          
          console.log('[FormInteraction] Form completed - Lead and Schedule events tracked (client + server)');
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
          
          // Track form abandonment to Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'FormAbandoned', {
              form_name: form.getAttribute('name') || form.getAttribute('id') || 'contact_form',
              page_path: window.location.pathname,
              fields_filled: interaction.fields.size,
              time_spent_seconds: Math.round(timeSpent / 1000)
            });
          }
          
          // Track to Vercel Analytics
          try {
            const formName = form.getAttribute('name') || form.getAttribute('id') || 'contact_form';
            track('form_abandoned', {
              form_name: formName,
              page_path: window.location.pathname,
              fields_filled: interaction.fields.size,
              time_spent_seconds: Math.round(timeSpent / 1000)
            });
          } catch (error) {
            console.error('[FormInteraction] Vercel Analytics error:', error);
          }
          
          console.log('[FormInteraction] Form abandoned - tracked to Meta + Vercel');
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
