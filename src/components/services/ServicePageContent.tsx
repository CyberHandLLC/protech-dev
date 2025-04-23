'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';

type ServicePageContentProps = {
  serviceInfo: any;
  category: string;
  service: string;
  locationParam: string;
  userLocation: string;
  isLocating: boolean;
};

/**
 * Service page content component that receives dynamic location information
 * This is a client component that shows service details with location-aware content
 */
export default function ServicePageContent({ 
  serviceInfo,
  category,
  service,
  locationParam,
  userLocation,
  isLocating
}: ServicePageContentProps) {
  
  // Format location for display from either the URL parameter or detected location
  const finalLocation = isLocating ? 
    <span className="animate-pulse">Detecting your location...</span> : 
    userLocation;
    
  // Create breadcrumb path with URL-friendly versions
  const categoryLabel = category === 'residential' ? 'Residential' : 'Commercial';
  
  return (
    <main>
      {/* Hero section with gradient background */}
      <section className="bg-gradient-to-b from-dark-blue to-navy py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-8 text-ivory/70">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="hover:text-ivory inline-flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <Link href="/services" className="hover:text-ivory ml-1 md:ml-2">
                      Services
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <Link href={`/services?category=${category}`} className="hover:text-ivory ml-1 md:ml-2">
                      {categoryLabel}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 md:ml-2 text-ivory/50">
                      {serviceInfo.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Service Title & Description */}
          <div className="mb-8 max-w-3xl">
            <div className="h-1 w-24 bg-red mb-4"></div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {serviceInfo.title} in {finalLocation}
            </h1>
            <p className="text-xl text-ivory/80 mt-4">
              {serviceInfo.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Service Details */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-ivory/80 mb-8 leading-relaxed text-lg">
                Trust our experienced technicians to provide reliable {serviceInfo.title.toLowerCase()} in {finalLocation}.
                We pride ourselves on prompt service, competitive pricing, and quality workmanship for all HVAC needs.
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-4">Our Services Include:</h2>
              <ul className="space-y-3 mb-8">
                {serviceInfo.details.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red flex items-center justify-center mr-3 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-ivory/90">{detail}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gradient-to-r from-dark-blue to-dark-blue-light p-6 rounded-xl border border-dark-blue-light/30">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Serving {finalLocation}
                </h3>
                <p className="text-ivory/70">
                  We provide fast, reliable service throughout {finalLocation} and surrounding areas.
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
      
      <CTASection location={userLocation} />
    </main>
  );
}
