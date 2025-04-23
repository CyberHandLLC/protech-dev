'use client';

import { useState } from 'react';
import Button from './ui/Button';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Set submitting state
      setFormStatus({ submitted: false, error: false, message: 'Submitting...' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success state
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Thank you! We\'ll contact you shortly to confirm your appointment.'
      });
      
      // Reset form
      setFormData(INITIAL_FORM_STATE);
      
      // Auto-reset after delay
      setTimeout(() => {
        setFormStatus({ submitted: false, error: false, message: '' });
      }, 5000);
      
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
      <div className={`bg-navy/50 backdrop-blur-sm rounded-lg p-4 border border-navy-light shadow-lg ${className}`}>
        <div className={`p-3 rounded-lg ${isSuccess ? 'bg-green-800/20 text-green-300' : 'bg-red-dark/20 text-red-300'}`}>
          <p className="font-medium text-sm">{formStatus.message}</p>
          
          {isSuccess && (
            <div className="mt-2">
              <p className="text-xs">Need immediate assistance?</p>
              <a href="tel:8005554822" className="text-sm inline-flex items-center mt-1 text-red hover:underline">
                <span className="mr-1">📞</span> Call 800-555-HVAC
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
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
  );
}
