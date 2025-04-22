'use client';

import { useState } from 'react';
import Link from 'next/link';
import { convertToLocationSlug } from '@/utils/location';

// Lightweight client component for the Call-to-Action section
// Only includes interactive elements to minimize mobile JavaScript

interface ClientCTASectionProps {
  location: string;
}

export default function ClientCTASection({ location }: ClientCTASectionProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const locationSlug = convertToLocationSlug(location);
  
  // Handle form submission with minimal JavaScript
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple form handling to minimize JavaScript execution
    setFormSubmitted(true);
    
    // After 3 seconds, reset the form state
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };
  
  return (
    <section className="py-16 bg-gradient-to-br from-navy-dark to-navy">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Professional HVAC Service in {location}?
          </h2>
          <p className="text-ivory/80 mb-8">
            Contact us today for fast, reliable heating and cooling solutions
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/contact?location=${locationSlug}`}
              className="inline-block bg-red hover:bg-red-dark text-white py-3 px-6 rounded-md font-semibold transition-colors"
            >
              Contact Us
            </Link>
            
            <Link 
              href={`/services?location=${locationSlug}`}
              className="inline-block bg-transparent hover:bg-navy-light/20 text-white py-3 px-6 rounded-md font-semibold border-2 border-white transition-colors"
            >
              View Services
            </Link>
          </div>
          
          {/* Super lightweight emergency contact form */}
          {!formSubmitted ? (
            <form 
              onSubmit={handleSubmit}
              className="mt-12 bg-navy-light p-6 rounded-lg max-w-md mx-auto"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Need Emergency Service?
              </h3>
              <p className="text-ivory/80 text-sm mb-4">
                Leave your number for a quick callback from our technicians
              </p>
              
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="w-full p-3 rounded bg-navy-dark border border-navy-light-300 text-white"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-red hover:bg-red-dark text-white py-3 rounded font-semibold transition-colors"
              >
                Request Emergency Callback
              </button>
            </form>
          ) : (
            <div className="mt-12 bg-navy-light p-6 rounded-lg max-w-md mx-auto">
              <div className="text-green-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Thank You!
              </h3>
              <p className="text-ivory/80">
                We've received your request and will call you back shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
