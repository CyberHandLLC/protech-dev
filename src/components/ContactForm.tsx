'use client';

import { useState } from 'react';
import Button from './ui/Button';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';

type FormField = 'name' | 'email' | 'phone' | 'service' | 'location' | 'message';
type FormData = Record<FormField, string>;

// Option types for dropdowns
type Option = { value: string; label: string };

// Common form components to reduce repetitive code
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
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-dark-blue-light bg-navy rounded-lg focus:ring-2 focus:ring-red focus:border-transparent outline-none text-white"
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
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-dark-blue-light bg-navy rounded-lg focus:ring-2 focus:ring-red focus:border-transparent outline-none appearance-none text-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.7rem_center] bg-[length:0.65em] bg-no-repeat pr-8"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const FormTextarea = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  rows = 4
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-2 border border-dark-blue-light bg-navy rounded-lg focus:ring-2 focus:ring-red focus:border-transparent outline-none resize-none text-white"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// Service options
const SERVICES: Option[] = [
  { value: '', label: 'Select a service' },
  { value: 'AC Repair', label: 'AC Repair' },
  { value: 'Heating Repair', label: 'Heating Repair' },
  { value: 'Seasonal Tune-ups', label: 'Seasonal Tune-ups' },
  { value: 'Preventative Maintenance', label: 'Preventative Maintenance' },
  { value: 'Inspections', label: 'Inspections' },
  { value: 'New Installation', label: 'New Installation' },
  { value: 'Air Quality', label: 'Air Quality' },
  { value: 'Commercial HVAC', label: 'Commercial HVAC' },
  { value: 'Other', label: 'Other' },
];

// Location options
const LOCATIONS: Option[] = [
  { value: '', label: 'Select your location' },
  { value: 'Akron, OH', label: 'Akron, OH' },
  { value: 'Cleveland, OH', label: 'Cleveland, OH' },
  { value: 'Canton, OH', label: 'Canton, OH' },
  { value: 'Other', label: 'Other' },
];

const INITIAL_FORM_STATE: FormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  location: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
  });
  
  // Initialize Facebook conversion tracking (both client-side and server-side)
  const { trackLead, trackContact } = useFacebookEvents();
  const { 
    trackLead: trackServerLead, 
    trackContact: trackServerContact 
  } = useFacebookServerEvents();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show sending status
      setFormStatus({ submitted: true, error: false, message: 'Sending your message...' });
      
      // Prepare data for the API call
      const contactData = {
        ...formData,
        source: 'Contact Page'
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
      
      if (response.ok) {
        // Reset form to initial state
        setFormData(INITIAL_FORM_STATE);
        
        // Facebook conversion tracking
        // Note: Lead and Contact events are handled by FormInteractionTracker
        // This ensures consistent tracking across all forms without duplicates
        try {
          // No additional tracking needed here
          // FormInteractionTracker will fire:
          // - FormCompleted (custom event with form details)
          // - Lead (standard conversion event)
          // - Schedule (standard appointment event)
          
          // Server-side Lead tracking for backup (in case client-side fails)
          await trackServerLead({
            formName: 'Main Contact Form',
            userData: {
              email: formData.email,
              phone: formData.phone,
              firstName: formData.name.split(' ')[0],
              lastName: formData.name.split(' ').slice(1).join(' '),
              city: formData.location || '',
              state: 'OH', // Default state (Ohio)
              zipCode: '' // We don't collect zip code in this form
            },
            value: 100 // Estimated lead value
          });
          
          console.log('Facebook conversion events tracked via client and server successfully');
        } catch (trackingError) {
          // Don't let tracking errors affect the user experience
          console.error('Error tracking Facebook conversion event:', trackingError);
        }
        
        // Success state
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you shortly.'
        });
        
        // Reset form
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
        message: 'There was an error sending your message. Please try again or call us directly.'
      });
    }
  };

  // Show success/error message when form is submitted
  if (formStatus.submitted) {
    const isSuccess = !formStatus.error;
    return (
      <div className="bg-navy rounded-xl p-6 shadow-sm border border-navy-light">
        <div className={`p-4 rounded-lg ${isSuccess ? 'bg-green-800/20 text-green-300' : 'bg-red-dark/20 text-red-300'}`}>
          <p className="font-medium">{formStatus.message}</p>
          
          {isSuccess && (
            <div className="mt-4">
              <p>Need immediate assistance?</p>
              <a href="tel:3306424822" className="inline-flex items-center mt-2 text-red hover:underline">
                <span className="mr-2">📞</span> Call us at 330-642-HVAC
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy rounded-xl p-6 shadow-sm border border-navy-light">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <FormInput
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
        
        {/* Two-column layout for Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Field */}
          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
          
          {/* Phone Field */}
          <FormInput
            id="phone"
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            required
          />
        </div>
        
        {/* Two-column layout for Service and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Dropdown */}
          <FormSelect
            id="service"
            name="service"
            label="Service"
            value={formData.service}
            onChange={handleChange}
            options={SERVICES}
            required
          />
          
          {/* Location Dropdown */}
          <FormSelect
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            options={LOCATIONS}
            required
          />
        </div>
        
        {/* Message Field */}
        <FormTextarea
          id="message"
          name="message"
          label="Message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe what you need help with..."
          required
        />
        
        {/* Submit Button */}
        <Button variant="primary" className="w-full" type="submit">
          Send Message
        </Button>
        <p className="text-xs text-ivory/60 mt-1">
          By submitting this form, you agree to our privacy policy and terms of service.
        </p>
      </form>
    </div>
  );
}