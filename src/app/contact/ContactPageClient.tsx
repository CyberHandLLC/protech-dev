'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';

// Now it's safe to use dynamic imports with ssr: false in this client component
const ContactPageWrapper = dynamic(() => import('@/components/contact/ContactPageWrapper'), {
  ssr: false
});

interface ContactPageClientProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for the contact page
 * This component handles the dynamic imports with ssr: false
 */
export default function ContactPageClient({ children }: ContactPageClientProps) {
  return (
    <PageLayout className="bg-navy">
      <ContactPageWrapper>
        {children}
      </ContactPageWrapper>
    </PageLayout>
  );
}
