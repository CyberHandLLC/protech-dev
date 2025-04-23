'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import useLocationDetection from '@/hooks/useLocationDetection';
import { ServiceLocation } from '@/utils/locationUtils';
import { convertToLocationSlug } from '@/utils/location';

// Types from the original page
type ServiceParams = {
  category: string;
  service: string;
  location: string;
};

type ServiceInfo = {
  title: string;
  description: string;
  icon: string;
  details: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

type ServiceDetailsContentProps = {
  params: ServiceParams;
  serviceInfo: ServiceInfo;
  // Server-detected location
  serverLocation: ServiceLocation;
  // Formatted location from URL parameters for display fallback
  urlLocationDisplay: string;
};

export default function ServiceDetailsContent({ 
  params, 
  serviceInfo, 
  serverLocation,
  urlLocationDisplay
}: ServiceDetailsContentProps) {
  const { category, service, location } = params;
  
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // Initialize with server location
  const [locationState, setLocationState] = useState({
    displayName: serverLocation?.name || urlLocationDisplay,
    locationId: serverLocation?.id || location,
    isLoading: false
  });

  // Update location when client-side location is detected
  useEffect(() => {
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        processLocation();
      }, { timeout: 2000 });
    } else {
      // Fallback
      setTimeout(processLocation, 200);
    }
    
    function processLocation() {
      // If client-side location detected, use it unless we have server location
      if (clientLocation && !serverLocation?.name) {
        let locationName = clientLocation;
        try {
          locationName = decodeURIComponent(clientLocation);
        } catch (e) {
          console.error('Error decoding location:', e);
        }
        
        const locationId = convertToLocationSlug(clientLocation);
        
        setLocationState({
          displayName: locationName,
          locationId: locationId,
          isLoading: false
        });
      } else {
        // Otherwise keep using server or URL-based location
        setLocationState({
          displayName: serverLocation?.name || urlLocationDisplay,
          locationId: serverLocation?.id || location,
          isLoading: false
        });
      }
    }
  }, [clientLocation, isLocating, serverLocation, urlLocationDisplay, location]);

  return (
    <PageLayout>
      <main>
        {/* Page intro */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full px-4">
                {/* Breadcrumb navigation */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link href="/" className="text-ivory/70 hover:text-red-light">
                        Home
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-ivory/40" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <Link 
                          href={`/services?category=${category}`}
                          className="ml-1 text-ivory/70 hover:text-red-light md:ml-2"
                        >
                          {category === 'residential' ? 'Residential Services' : 'Commercial Services'}
                        </Link>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-ivory/40" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 text-ivory/50 md:ml-2">{serviceInfo.title}</span>
                      </div>
                    </li>
                  </ol>
                </nav>
            
                <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
                  <span className="text-3xl mr-3">{serviceInfo.icon}</span>
                  {serviceInfo.title} in {isLocating ? 
                    <span className="animate-pulse">Detecting location...</span> : 
                    locationState.displayName}
                </h1>
                <p className="text-xl text-ivory/80 mt-4">
                  {serviceInfo.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12 px-4 bg-navy-light">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-ivory/80 mb-8 leading-relaxed text-lg">
                  Trust our experienced technicians to provide reliable {serviceInfo.title.toLowerCase()} in {locationState.displayName}.
                  We pride ourselves on prompt service, competitive pricing, and quality workmanship for all HVAC needs.
                </p>
                
                <h2 className="text-2xl font-bold text-white mb-6">
                  Our {serviceInfo.title} Include:
                </h2>
                
                <ul className="space-y-4 mb-10">
                  {serviceInfo.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red mr-3 text-xl">✓</span>
                      <span className="text-ivory/90">{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex flex-wrap">
                  <span className="text-ivory/70 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Servicing {locationState.displayName} and surrounding areas
                  </span>
                </div>
                
                <div className="bg-dark-blue p-6 rounded-xl mb-12">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Serving {locationState.displayName}
                  </h3>
                  <p className="text-ivory/70">
                    We provide fast, reliable service throughout {locationState.displayName} and surrounding areas.
                    Our technicians are familiar with the unique HVAC needs of homes and businesses in the Northeast Ohio area.
                  </p>
                </div>
              </div>
              
              <div>
                {/* Service Image */}
                <div className="bg-dark-blue rounded-xl h-64 flex items-center justify-center mb-8 overflow-hidden border border-dark-blue-light/30">
                  <div className="text-5xl">{serviceInfo.icon}</div>
                </div>
                
                {/* Quote Form */}
                <div className="bg-dark-blue p-6 rounded-xl border border-dark-blue-light/30">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Get a Free Quote
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-ivory/80 mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-navy border border-dark-blue-light/50 rounded-lg p-3 text-white focus:border-red-light focus:outline-none focus:ring-1 focus:ring-red-light/50" 
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/80 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full bg-navy border border-dark-blue-light/50 rounded-lg p-3 text-white focus:border-red-light focus:outline-none focus:ring-1 focus:ring-red-light/50" 
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/80 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-navy border border-dark-blue-light/50 rounded-lg p-3 text-white focus:border-red-light focus:outline-none focus:ring-1 focus:ring-red-light/50" 
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/80 mb-2">Service Needed</label>
                      <select className="w-full bg-navy border border-dark-blue-light/50 rounded-lg p-3 text-white focus:border-red-light focus:outline-none focus:ring-1 focus:ring-red-light/50">
                        <option value={service}>{serviceInfo.title}</option>
                        <option value="emergency">Emergency Service</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-red hover:bg-red-light text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 mt-2"
                    >
                      Request Quote
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-navy py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-1 w-24 bg-red mx-auto mb-4"></div>
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-6">
              {serviceInfo.faqs.map((faq: any, index: number) => (
                <div key={index} className="bg-dark-blue p-6 rounded-xl border border-dark-blue-light/30">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-ivory/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <CTASection location={locationState.displayName} />
      </main>
    </PageLayout>
  );
}
