/**
 * Server Component version of HeroSection
 * Pre-renders the entire hero section with static weather data
 */
import Link from 'next/link';

type HeroSectionProps = {
  location: string;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
  // Optional weather data that can be provided by the server
  temperature?: number;
  weatherIcon?: string;
};

export default function HeroSectionServer({ 
  location,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC',
  temperature = 75,
  weatherIcon = '⛅'
}: HeroSectionProps) {
  // We're guaranteed to have a valid location since it's coming from the server
  const displayLocation = location || 'Northeast Ohio';
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy py-20 sm:py-0" aria-label="Hero Section">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div 
          className="w-full h-full bg-[url('/hero-placeholder.jpg')] bg-cover bg-center"
          role="img"
          aria-label="HVAC service background image"
        >
          <div className="absolute inset-0 bg-navy opacity-95"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-0">
        <div className="max-w-3xl mx-auto md:mx-0">
          <span className="inline-block bg-teal-500/20 backdrop-blur-sm text-ivory px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Trusted HVAC Services in {displayLocation}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Expert Heating & <span className="text-ivory">Cooling Solutions</span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl">
            Professional HVAC services tailored to your comfort needs. From emergency repairs to routine maintenance, our certified technicians deliver reliable solutions.
          </p>
          
          <div className="mb-8">
            {/* Static Weather Display component */}
            <div className="bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 rounded-lg inline-flex items-center justify-center text-center sm:text-left w-full sm:w-auto"
                aria-live="polite">
              <span className="text-xl sm:text-2xl mr-2 sm:mr-3" aria-hidden="true">{weatherIcon}</span>
              <div>
                <span className="text-white text-xs sm:text-sm">Current Weather in {displayLocation}</span>
                <p className="text-white font-bold text-xl">{temperature}°F</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 animate-fadeIn animate-delay-150">
            {/* Mobile-only buttons (stacked) */}
            <div className="flex flex-col gap-3 sm:hidden">
              <Link href="/services" className="bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Explore Services
              </Link>
              <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center">
                Contact Us
              </Link>
              <a 
                href={`tel:${emergencyPhone}`}
                className="text-white hover:text-yellow-300 flex justify-center items-center transition-colors text-sm py-2 border border-white/20 rounded-lg"
                aria-label={`Call us at ${emergencyPhoneDisplay}`}
              >
                <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
              </a>
            </div>
            
            {/* Desktop layout (horizontal) */}
            <div className="hidden sm:flex sm:flex-row sm:gap-4 sm:w-auto">
              <Link href="/services" className="bg-white text-navy hover:bg-ivory px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Explore Services
              </Link>
              <Link href="/contact" className="bg-red border-2 border-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center">
                Contact Us
              </Link>
              <a 
                href={`tel:${emergencyPhone}`}
                className="text-white hover:text-yellow-300 flex justify-start items-center transition-colors py-3"
                aria-label={`Call us at ${emergencyPhoneDisplay}`}
              >
                <span className="mr-2" aria-hidden="true">📞</span> {emergencyPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emergency badge */}
      <div className="absolute bottom-4 sm:bottom-8 right-0 left-0 sm:left-auto sm:right-8 z-20 flex justify-center sm:block">
        <Link 
          href="/emergency-service"
          className="group flex items-center bg-red rounded-full px-4 sm:px-5 py-2 sm:py-3 shadow-lg hover:bg-red-dark transition-colors"
          aria-label="24/7 Emergency Service"
        >
          <span className="text-xl sm:text-2xl mr-2" aria-hidden="true">🚨</span>
          <div>
            <p className="text-white font-bold leading-tight text-sm sm:text-base">24/7 Emergency</p>
            <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">Fast Response</p>
          </div>
        </Link>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block" aria-hidden="true">
        <div className="w-6 sm:w-8 h-10 sm:h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
          <div className="w-1 h-3 bg-white/80 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
