'use client';

import { ReactNode } from 'react';
import ContentViewTracker from '@/components/analytics/ContentViewTracker';

/**
 * AboutPageTracker Component
 * 
 * Client component that wraps the About page content and adds analytics tracking
 */
export default function AboutPageTracker({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Track about page view with enhanced data */}
      <ContentViewTracker
        contentName="About ProTech HVAC"
        contentType="about_page"
        contentCategory="Company Information"
        additionalData={{
          page_section: 'full_page',
          company_focus: 'family_owned'
        }}
      />
      {children}
    </>
  );
}
