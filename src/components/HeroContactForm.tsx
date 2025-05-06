'use client';

import { useState } from 'react';
import Button from './ui/Button';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import ContactFormTracker from './analytics/ContactFormTracker';

type FormField = 'name' | 'phone' | 'service' | 'location';
type FormData = Record<FormField, string>;

// Option types for dropdowns
type Option = { value: string; label: string };

// Common form components with compact styling for hero section
const FormInput = ({ 
  id, 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder = ''
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
}) => (
  <div className="mb-3">
    <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
      {label} {required && <span className="text-red">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-dark-blue-light bg-navy rounded-lg focus:ring-2 focus:ring-red focus:border-transparent outline-none text-white text-sm"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const FormSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
}) => (
  <div className="mb-3">
    <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
      {label} {required && <span className="text-red">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-dark-blue-light bg-navy rounded-lg focus:ring-2 focus:ring-red focus:border-transparent outline-none appearance-none text-white text-sm bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.7rem_center] bg-[length:0.65em] bg-no-repeat pr-8"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// Service options
const SERVICES: Option[] = [
  { value: '', label: 'Select a service' },
  { value: 'AC Repair', label: 'AC Repair' },
  { value: 'Heating Repair', label: 'Heating Repair' },
  { value: 'Tune-Up', label: 'Tune-Up' },
  { value: 'Installation', label: 'Installation' },
  { value: 'Air Quality', label: 'Air Quality' },
  { value: 'Other', label: 'Other' }
];

// Location options
const LOCATIONS: Option[] = [
  { value: '', label: 'Select your location' },
  { value: 'Cleveland, OH', label: 'Cleveland, OH' },
  { value: 'Akron, OH', label: 'Akron, OH' },
  { value: 'Canton, OH', label: 'Canton, OH' },
  { value: 'Other', label: 'Other' },
];

const INITIAL_FORM_STATE: FormData = {
  name: '',
  phone: '',
  service: '',
  location: '',
};

interface HeroContactFormProps {
  className?: string;
}

export default function HeroContactForm({ className = '' }: HeroContactFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  // State to track form submission for analytics
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Initialize Facebook conversion tracking (both client-side and server-side)
  const { trackSchedule, trackLead } = useFacebookEvents();
  const { 
    trackSchedule: trackServerSchedule, 
    trackLead: trackServerLead 
  } = useFacebookServerEvents();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Set submitting state
      setFormStatus({ submitted: false, error: false, message: 'Submitting...' });
      setIsSubmitted(false);
      
      // Prepare data for the API call
      const contactData = {
        ...formData,
        source: 'Hero Form - Quick Contact'
      };
      
      // Send the data to our API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Track form submission events
        try {
          // Client-side tracking
          // Track as a schedule event
          await trackSchedule({
            userData: {
              firstName: formData.name.split(' ')[0],
              lastName: formData.name.split(' ').slice(1).join(' '),
              phone: formData.phone
            },
            customData: {
              contentCategory: 'Service Scheduling',
              contentName: formData.service || 'General Service',
              status: 'scheduled'
            }
          });
          
          // Also track as a lead event for conversion tracking
          await trackLead({
            userData: {
              phone: formData.phone
            },
            customData: {
              contentCategory: 'Hero Form Lead',
              contentName: formData.service || 'General Service',
              contentType: 'service_scheduling'
            }
          });
          
          // Server-side tracking (Conversions API)
          // This will work even if client-side tracking is blocked
          await trackServerSchedule({
            appointmentType: formData.service || 'General HVAC Service',
            userData: {
              firstName: formData.name.split(' ')[0],
              lastName: formData.name.split(' ').slice(1).join(' '),
              phone: formData.phone,
              city: formData.location || ''
            },
            value: 149 // Estimated value of scheduled service
          });
          
          // Also track as a lead through server-side tracking
          await trackServerLead({
            formName: 'Hero Contact Form',
            userData: {
              phone: formData.phone,
              firstName: formData.name.split(' ')[0],
              lastName: formData.name.split(' ').slice(1).join(' '),
              city: formData.location || ''
            },
            value: 75 // Estimated lead value
          });
          
          console.log('Facebook conversion events tracked via client and server successfully');
        } catch (trackingError) {
          // Don't let tracking errors affect the user experience
          console.error('Error tracking Facebook conversion event:', trackingError);
        }
        
        // Finish by setting the success state
        setFormStatus({ 
          submitted: true, 
          error: false, 
          message: 'Thank you! We\'ll be in touch shortly.'
        });
        
        // Set submitted state for analytics tracking
        setIsSubmitted(true);
        
        // Reset form to initial state
        setFormData(INITIAL_FORM_STATE);
          
        // Auto-reset after delay
        setTimeout(() => {
          setFormStatus({ submitted: false, error: false, message: '' });
        }, 5000);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        submitted: true,
        error: true,
        message: 'There was an error. Please try again or call us directly.'
      });
    }
  };

  // Show success/error message when form is submitted
  if (formStatus.submitted) {
    const isSuccess = !formStatus.error;
    return (
      <ContactFormTracker
        formLocation="Hero Section"
        formType="quick_contact"
        isSubmission={isSubmitted}
        formData={formData}
        serviceName={formData.service}
      >
        <div className={`bg-navy/50 backdrop-blur-sm rounded-lg p-4 border border-navy-light shadow-lg ${className}`}>
          <div className={`p-3 rounded-lg ${isSuccess ? 'bg-green-800/20 text-green-300' : 'bg-red-dark/20 text-red-300'}`}>
            <p className="font-medium text-sm">{formStatus.message}</p>
            
            {isSuccess && (
              <div className="mt-2">
                <p className="text-xs">Need immediate assistance?</p>
                <a href="tel:3306424822" className="text-sm inline-flex items-center mt-1 text-red hover:underline">
                  <span className="mr-1">📞</span> Call 330-642-HVAC
                </a>
              </div>
            )}
          </div>
        </div>
      </ContactFormTracker>
    );
  }

  return (
    <ContactFormTracker
      formLocation="Hero Section"
      formType="quick_contact"
      isSubmission={isSubmitted}
      formData={formData}
      serviceName={formData.service}
    >
      <div className={`bg-navy/50 backdrop-blur-sm rounded-lg p-4 border border-navy-light shadow-lg ${className}`}>
        <h3 className="text-white font-semibold text-lg mb-3">Schedule Service</h3>
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Name Field */}
          <FormInput
            id="hero-name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          
          {/* Phone Field */}
          <FormInput
            id="hero-phone"
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            required
          />
          
          {/* Service Dropdown */}
          <FormSelect
            id="hero-service"
            name="service"
            label="Service Needed"
            value={formData.service}
            onChange={handleChange}
            options={SERVICES}
            required
          />
          
          {/* Location Dropdown */}
          <FormSelect
            id="hero-location"
            name="location"
            label="Your Location"
            value={formData.location}
            onChange={handleChange}
            options={LOCATIONS}
            required
          />
          
          {/* Submit Button */}
          <Button variant="primary" className="w-full mt-4" type="submit">
            Schedule Now
          </Button>
          <p className="text-xs text-ivory/60 mt-1 text-center">
            Quick response guaranteed
          </p>
        </form>
      </div>
    </ContactFormTracker>
  );
}
