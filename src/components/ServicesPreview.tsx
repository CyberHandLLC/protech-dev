// Server Component - no 'use client' directive
import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import { convertToLocationSlug } from '@/utils/location';
import { ServiceLocation } from '@/utils/locationUtils';

// Import the client-side interactive components
import ClientServicesNav from './client/ClientServicesNav';

// Props type that accepts both string and ServiceLocation object
interface ServicesPreviewProps {
  location?: string | ServiceLocation;
}

/**
 * Services Preview Component - TRUE SERVER COMPONENT
 * 
 * This properly implements the Next.js App Router pattern for Server Components:
 * 1. No 'use client' directive so it runs on the server
 * 2. Only interactive elements are client components
 * 3. Static content renders on the server
 * 4. Minimal JavaScript for optimal mobile TBT
 */
export default function ServicesPreview({ location }: ServicesPreviewProps) {
  // Server-side processing of location - zero client JS
  let displayLocation = 'Northeast Ohio';
  let locationSlug = 'northeast-ohio';
  
  // Process location on the server
  if (location) {
    if (typeof location === 'string' && location.trim() !== '') {
      displayLocation = location;
    } else if (typeof location === 'object' && location.name) {
      displayLocation = location.name;
    }
    
    // Create location slug - on the server
    locationSlug = convertToLocationSlug(displayLocation);
    
    // Format display location - handle URL encoding
    try {
      displayLocation = decodeURIComponent(displayLocation);
    } catch (e) {
      // Keep original if decode fails
    }
  }
  
  // Rendered entirely on the server
  return (
    <Section className="py-16 bg-navy">
      <Container>
        {/* Static content - server rendered */}
        <SectionHeading
          title="Our Services"
          subtitle={`Expert HVAC solutions in ${displayLocation}`}
          centered={true}
          className="text-white"
        />
        
        {/* Client component boundary - ONLY for interactive elements */}
        <ClientServicesNav locationSlug={locationSlug} />
      </Container>
    </Section>
  );
}
