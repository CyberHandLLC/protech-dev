'use client';

import { ReactNode } from 'react';
import ContentViewTracker from '@/components/analytics/ContentViewTracker';

/**
 * ContactPageTracker Component
 * 
 * Client component that wraps the Contact page content and adds analytics tracking
 */
export default function ContactPageTracker({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Track contact page view with enhanced data */}
      <ContentViewTracker
        contentName="Contact ProTech HVAC"
        contentType="contact_page"
        contentCategory="Lead Generation"
        additionalData={{
          page_section: 'full_page',
          intent: 'contact_request'
        }}
      />
      {children}
    </>
  );
}
