'use client';

import Link from 'next/link';
import Section from './ui/Section';
import Container from './ui/Container';
import Button from './ui/Button';
import PhoneCallTracker from './analytics/PhoneCallTracker';

type CTASectionProps = {
  location?: string;
  phoneDisplay?: string;
  phoneNumber?: string;
};

export default function CTASection({ 
  location = 'Northeast Ohio',
  phoneDisplay = '330-642-HVAC',
  phoneNumber = '3306424822'
}: CTASectionProps) {
  // Validate the provided location
  if (!location || location === '') {
    console.error('No location provided to CTASection, using Northeast Ohio as fallback');
  }
  
  // Format location for display and decode any URL-encoded characters
  let displayLocation = location || 'Northeast Ohio';
  
  // Try to decode URL-encoded characters (like %20 for spaces)
  try {
    displayLocation = decodeURIComponent(displayLocation);
  } catch (e) {
    console.error('Error decoding location in CTASection:', e);
    // Keep original if decoding fails
  }
  
  // Log the location being used for debugging
  console.log('CTASection using location:', { originalLocation: location, displayLocation });

  return (
    <Section className="relative overflow-hidden py-16 md:py-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/cta-bg-placeholder.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-navy opacity-95"></div>
      </div>
      
      {/* Diagonal accent at top */}
      <div className="absolute top-0 left-0 w-full h-8 clip-diagonal"></div>
      
      <Container className="text-center relative z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
          Ready for Professional HVAC Service in {displayLocation}?
        </h2>
        
        <p className="text-ivory/90 text-base sm:text-lg mb-6 sm:mb-10 max-w-3xl mx-auto px-4 sm:px-0">
          Whether you need emergency repairs, routine maintenance, or a completely new system,
          our team of certified technicians is ready to deliver comfort to your home or business.
        </p>
        
        {/* Phone CTA Box */}
        <div className="bg-red bg-opacity-95 p-4 sm:p-6 rounded-xl max-w-md mx-auto mb-6 sm:mb-10 shadow-lg">
          <div className="flex flex-col items-center">
            <p className="text-white mb-1 sm:mb-2 text-sm sm:text-base">Call us now at</p>
            <PhoneCallTracker
              phoneNumber={phoneNumber}
              displayNumber={phoneDisplay}
              source={`CTA Section - ${displayLocation}`}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white hover:text-ivory transition-colors"
            >
              {phoneDisplay}
            </PhoneCallTracker>
            <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">Available 24/7 for emergency service</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="max-w-lg mx-auto px-4 sm:px-0">
          {/* Mobile layout - grid buttons */}
          <div className="grid grid-cols-2 gap-3 sm:hidden mb-3">
            <Link 
              href="/schedule" 
              className="bg-white text-navy hover:bg-ivory px-4 py-3 rounded-lg font-medium transition-colors text-center text-sm"
            >
              Schedule Online
            </Link>
            
            <Button 
              href="/free-estimate" 
              variant="outline" 
              className="text-sm py-3"
            >
              Free Estimate
            </Button>
          </div>
          
          {/* Desktop layout - horizontal row */}
          <div className="hidden sm:flex sm:flex-row justify-center gap-4">
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
        </div>
        
        <div className="mt-10 sm:mt-16">
          <p className="text-ivory/90 text-xs sm:text-sm px-4 sm:px-0">Trusted by homeowners and businesses across {displayLocation}</p>
        </div>
      </Container>
    </Section>
  );
}