'use client';

import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import Button from './ui/Button';

type CTASectionProps = {
  location?: string;
  phoneDisplay?: string;
  phoneNumber?: string;
};

export default function CTASection({ 
  location = 'Northeast Ohio',
  phoneDisplay = '800-555-HVAC',
  phoneNumber = '8005554822'
}: CTASectionProps) {
  // Format location for display - handle any unexpected null values
  const displayLocation = location || 'Northeast Ohio';

  return (
    <Section className="relative overflow-hidden py-16 md:py-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/cta-bg-placeholder.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-navy to-dark-blue opacity-95"></div>
      </div>
      
      {/* Diagonal accent at top */}
      <div className="absolute top-0 left-0 w-full h-8 bg-navy-light clip-diagonal"></div>
      
      <Container className="text-center relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Ready for Professional HVAC Service in {displayLocation}?
        </h2>
        
        <p className="text-ivory/90 text-lg mb-10 max-w-3xl mx-auto">
          Whether you need emergency repairs, routine maintenance, or a completely new system,
          our team of certified technicians is ready to deliver comfort to your home or business.
        </p>
        
        {/* Phone CTA Box */}
        <div className="bg-red bg-opacity-95 p-6 rounded-xl max-w-md mx-auto mb-10 shadow-lg">
          <p className="text-white mb-2">Call us now at</p>
          <a 
            href={`tel:${phoneNumber}`}
            className="text-3xl md:text-4xl font-bold text-white hover:text-ivory transition-colors"
            aria-label={`Call us at ${phoneDisplay}`}
          >
            {phoneDisplay}
          </a>
          <p className="text-white/80 text-sm mt-2">Available 24/7 for emergency service</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <Link 
            href="/schedule" 
            className="flex-1 bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center"
          >
            Schedule Online
          </Link>
          
          <Button 
            href="/free-estimate" 
            variant="outline" 
            className="flex-1"
          >
            Free Estimate
          </Button>
        </div>
        
        <div className="mt-16">
          <p className="text-ivory/90 text-sm">Trusted by homeowners and businesses across {displayLocation}</p>
        </div>
      </Container>
    </Section>
  );
}