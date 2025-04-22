'use client';

import { memo } from 'react';
import Link from 'next/link';

type ContactSectionProps = {
  location?: string;
};

/**
 * Contact section component - optimized for mobile performance
 * Simplified with static HTML to reduce JavaScript execution
 */
function ContactSection({ location = 'Cleveland' }: ContactSectionProps) {
  return (
    <section className="py-16 bg-navy-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
          Get in Touch with Our {location} Team
        </h2>
        
        <div className="max-w-lg mx-auto text-center text-white/80 mb-12">
          <p className="mb-4">
            We're ready to provide exceptional HVAC service for your home or business.
            Contact us today to schedule service or request a free estimate.
          </p>
          
          <p>
            Our team of certified technicians serves {location} and surrounding areas
            with prompt, reliable service.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/contact"
            className="inline-block bg-red hover:bg-red-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Contact Us Now
          </Link>
        </div>
      </div>
    </section>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ContactSection);
