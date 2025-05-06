'use client';

import React, { ReactNode } from 'react';
import ContactPageTracker from './ContactPageTracker';

interface ContactPageWrapperProps {
  children: ReactNode;
}

/**
 * ContactPageWrapper Component
 * 
 * A client component wrapper that adds Facebook tracking to the contact page
 */
export default function ContactPageWrapper({ children }: ContactPageWrapperProps) {
  return (
    <>
      {/* Include the Facebook tracking component */}
      <ContactPageTracker />
      
      {/* Render the page content */}
      {children}
    </>
  );
}
