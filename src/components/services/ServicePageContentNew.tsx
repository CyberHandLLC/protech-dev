'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import { generateFAQs } from '@/utils/faqs';
import PageLayout from '@/components/PageLayout';

interface ServiceInfo {
  name: string;
  description: string;
  system: {
    id: string;
    name: string;
    icon: string;
  };
  serviceType: {
    id: string;
    name: string;
    icon: string;
  };
  item: {
    id: string;
    name: string;
    icon: string;
  };
  categoryId: string;
  categoryName: string;
  locationName: string;
}

interface ServicePageContentProps {
  serviceInfo: ServiceInfo;
  category: string;
  system: string;
  serviceType: string;
  item: string;
  locationParam: string;
  userLocation: any;
  isLocating: boolean;
  weatherData: any;
  weatherRecommendation: any;
}

export default function ServicePageContentNew({
  serviceInfo,
  category,
  system,
  serviceType,
  item,
  locationParam,
  userLocation,
  isLocating,
  weatherData,
  weatherRecommendation
}: ServicePageContentProps) {
  // Generate FAQs based on service, location, and service type
  const faqs = generateFAQs(serviceInfo.system.name, serviceInfo.serviceType.name, 
                           serviceInfo.item.name, serviceInfo.locationName);
  
  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Services', href: '/services2' },
    { label: serviceInfo.categoryName, href: `/services2?category=${category}` },
    { label: serviceInfo.system.name, href: `/services2?category=${category}#${system}` },
    { label: serviceInfo.serviceType.name, href: `/services2?category=${category}#${system}-${serviceType}` },
    { label: serviceInfo.item.name, isCurrentPage: true }
  ];
  
  return (
    <PageLayout>
      <main className="bg-white">
        {/* Breadcrumb navigation bar */}
        <div className="bg-dark-blue border-b border-dark-blue-light w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={breadcrumbItems} className="py-3" />
          </div>
        </div>
        
        {/* Hero section with service details */}
        <section className="bg-navy py-12 pb-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="md:w-2/3">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {serviceInfo.item.name} {serviceInfo.serviceType.name}
                </h1>
                <p className="text-lg text-ivory/80 mb-4">
                  Professional {serviceInfo.item.name.toLowerCase()} {serviceInfo.serviceType.name.toLowerCase()} services for homes in {serviceInfo.locationName}.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                  <span className="bg-dark-blue rounded-md px-4 py-1 text-ivory">
                    {serviceInfo.categoryName} Services
                  </span>
                  <span className="bg-dark-blue rounded-md px-4 py-1 text-ivory inline-flex items-center gap-1">
                    <span>{serviceInfo.system.icon}</span>
                    <span>{serviceInfo.system.name}</span>
                  </span>
                  <span className="bg-dark-blue rounded-md px-4 py-1 text-ivory">
                    {serviceInfo.locationName}
                  </span>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-dark-blue rounded-lg p-6 shadow-lg border border-navy-light">
                  <p className="text-ivory/90 mb-2 text-sm">
                    Our certified technicians are ready to assist with your {serviceInfo.item.name.toLowerCase()} {serviceInfo.serviceType.name.toLowerCase()}.
                  </p>
                  <a href="tel:330-555-1234" className="block w-full bg-red hover:bg-red-dark text-white font-bold py-3 px-4 rounded text-center transition-colors">
                    Call (330) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content column */}
            <div className="lg:w-2/3">
              {/* Weather-based recommendation */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <div className="text-blue-500 mr-2 flex-shrink-0 pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-navy mb-1">Service Recommendation</h3>
                    <p className="text-sm text-gray-500 mb-2">Based on current conditions in {serviceInfo.locationName}</p>
                    <div className="flex items-center gap-3 mb-3">
                      {weatherData.icon && (
                        <img src={`/images/weather/${weatherData.icon}.svg`} alt={weatherData.condition} width={30} height={30} />
                      )}
                      <div>
                        <span className="font-medium">{weatherData.temperature}°F</span>
                        <span className="text-gray-500 text-sm ml-2">{weatherData.condition}</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-blue-100">
                      <div className="flex items-start">
                        <div className="text-blue-500 mr-2 flex-shrink-0 pt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-navy mb-1">Pro Tip for Your {serviceInfo.item.name}</div>
                          <p className="text-sm text-gray-700">
                            {weatherRecommendation?.message || 
                              `With current temperatures at ${weatherData.temperature}°F, your cooling system is likely running constantly. A maintenance check now can help prevent breakdowns during this hot weather.`}
                          </p>
                          {weatherRecommendation?.tip && (
                            <p className="text-xs text-gray-600 mt-2">
                              <span className="font-semibold">Maintenance Tip:</span> {weatherRecommendation.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Service description */}
              <section className="mb-12">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-navy border-b-2 border-red pb-2 inline-block">
                    About Our {serviceInfo.item.name} {serviceInfo.serviceType.name}
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none prose-headings:text-navy prose-p:text-gray-700 prose-a:text-red prose-a:no-underline hover:prose-a:text-red-dark">
                  <p>
                    ProTech HVAC provides professional {serviceInfo.item.name.toLowerCase()} {serviceInfo.serviceType.name.toLowerCase()} services in {serviceInfo.locationName} and surrounding areas. Our certified technicians use the latest equipment and follow industry best practices to ensure your {system} system operates at peak efficiency.
                  </p>
                  
                  {serviceType === 'maintenance' && (
                    <>
                      <p>
                        Regular maintenance of your {serviceInfo.item.name.toLowerCase()} is crucial for optimal performance and energy efficiency. Our comprehensive maintenance service includes thorough inspection, cleaning, and tuning to prevent costly breakdowns and extend the lifespan of your equipment.
                      </p>
                      <ul>
                        <li>Complete system inspection and testing</li>
                        <li>Filter replacement and cleaning of key components</li>
                        <li>Lubrication of moving parts to reduce friction</li>
                        <li>Calibration of thermostat and controls</li>
                        <li>Safety check for potential issues</li>
                      </ul>
                    </>
                  )}
                  
                  {serviceType === 'repairs' && (
                    <>
                      <p>
                        When your {serviceInfo.item.name.toLowerCase()} system breaks down, you need fast, reliable repair service. Our technicians are trained to diagnose and fix issues quickly, minimizing discomfort and disruption to your daily routine.
                      </p>
                      <ul>
                        <li>Comprehensive diagnostic to identify the root cause</li>
                        <li>Transparent pricing with no hidden fees</li>
                        <li>Quality replacement parts with warranty</li>
                        <li>Post-repair testing to ensure proper operation</li>
                        <li>Recommendations to prevent future issues</li>
                      </ul>
                    </>
                  )}
                  
                  {serviceType === 'installations' && (
                    <>
                      <p>
                        Installing a new {serviceInfo.item.name.toLowerCase()} system is a significant investment that requires proper planning and execution. Our installation services ensure your new system operates efficiently and reliably for years to come.
                      </p>
                      <ul>
                        <li>Comprehensive assessment of your space and needs</li>
                        <li>Expert recommendations on system size and features</li>
                        <li>Professional installation following manufacturer specifications</li>
                        <li>Thorough testing and commissioning</li>
                        <li>Complete user training on system operation</li>
                      </ul>
                    </>
                  )}
                  
                  {serviceType === 'inspections' && (
                    <>
                      <p>
                        Regular inspections of your {serviceInfo.item.name.toLowerCase()} system can identify potential problems before they lead to costly repairs or system failure. Our detailed inspections provide peace of mind and help maintain optimal performance.
                      </p>
                      <ul>
                        <li>Visual inspection of all components</li>
                        <li>Performance testing and efficiency evaluation</li>
                        <li>Safety check for potential hazards</li>
                        <li>Detailed report of findings with recommendations</li>
                        <li>Maintenance suggestions to improve performance</li>
                      </ul>
                    </>
                  )}
                </div>
              </section>
              
              {/* Why choose us section */}
              <section className="mb-12 bg-gray-100 p-6 rounded-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-navy border-b-2 border-red pb-2 inline-block">
                    Why Choose ProTech HVAC for Your {serviceInfo.item.name} Needs
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="text-red text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="font-semibold text-navy">Certified Technicians</h3>
                      <p className="text-gray-600">Our team is NATE-certified and regularly trained on the latest techniques.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-red text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="font-semibold text-navy">100% Satisfaction Guarantee</h3>
                      <p className="text-gray-600">We're not happy until you're completely satisfied with our work.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-red text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="font-semibold text-navy">Transparent Pricing</h3>
                      <p className="text-gray-600">No hidden fees or surprise charges. We provide detailed estimates upfront.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-red text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="font-semibold text-navy">Fast Response Times</h3>
                      <p className="text-gray-600">We respect your time and schedule service at your convenience.</p>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* FAQs Section */}
              {faqs.length > 0 && (
                <section className="mb-12">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy border-b-2 border-red pb-2 inline-block">
                      Frequently Asked Questions About {serviceInfo.item.name} {serviceInfo.serviceType.name} in {serviceInfo.locationName}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {faqs.slice(0, 2).map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="w-full text-left px-6 py-4 flex justify-between items-center bg-white text-navy hover:bg-gray-50"
                        >
                          <span className="font-medium text-lg">{faq.question}</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-6">
                {/* Service Request Form */}
                <div className="bg-navy text-white rounded-lg overflow-hidden">
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-3 mt-1">Request Service</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-ivory mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 rounded bg-dark-blue border border-dark-blue-light text-white focus:outline-none focus:ring-2 focus:ring-red"
                          placeholder="John Smith"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-ivory mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-2 rounded bg-dark-blue border border-dark-blue-light text-white focus:outline-none focus:ring-2 focus:ring-red"
                          placeholder="(330) 555-1234"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-ivory mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 rounded bg-dark-blue border border-dark-blue-light text-white focus:outline-none focus:ring-2 focus:ring-red"
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-ivory mb-1">
                          Service Needed
                        </label>
                        <div className="bg-dark-blue border border-dark-blue-light rounded px-4 py-2 text-ivory/90">
                          {serviceInfo.item.name} {serviceInfo.serviceType.name}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-ivory mb-1">
                          Additional Details
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-2 rounded bg-dark-blue border border-dark-blue-light text-white focus:outline-none focus:ring-2 focus:ring-red"
                          placeholder="Please share any details about your service needs..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-red hover:bg-red-dark text-white font-bold py-3 px-4 rounded text-center transition-colors"
                      >
                        Schedule Service
                      </button>
                    </form>
                  </div>
                </div>
                
                {/* Related Services */}
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-navy border-b-2 border-red pb-2 inline-block">Related Services</h3>
                  </div>
                  <ul className="space-y-3">
                    {serviceType !== 'repairs' && (
                      <li>
                        <Link 
                          href={`/services2/${category}/${system}/repairs/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🔧</span>
                          <span>{serviceInfo.item.name} Repairs</span>
                        </Link>
                      </li>
                    )}
                    
                    {serviceType !== 'maintenance' && (
                      <li>
                        <Link 
                          href={`/services2/${category}/${system}/maintenance/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🛠️</span>
                          <span>{serviceInfo.item.name} Maintenance</span>
                        </Link>
                      </li>
                    )}
                    
                    {serviceType !== 'installations' && (
                      <li>
                        <Link 
                          href={`/services2/${category}/${system}/installations/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🏠</span>
                          <span>{serviceInfo.item.name} Installation</span>
                        </Link>
                      </li>
                    )}
                    
                    {serviceType !== 'inspections' && (
                      <li>
                        <Link 
                          href={`/services2/${category}/${system}/inspections/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🔍</span>
                          <span>{serviceInfo.item.name} Inspection</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Customer Testimonial */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <Image 
                        src="/images/testimonial-avatar.jpg" 
                        alt="Customer" 
                        width={50} 
                        height={50}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy">Jennifer K.</h4>
                      <p className="text-sm text-gray-500">{serviceInfo.locationName}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex text-yellow-400">
                    {'★★★★★'.split('').map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 italic">
                    "ProTech provided excellent service for our {serviceInfo.item.name.toLowerCase()} {serviceInfo.serviceType.name.toLowerCase()}. 
                    The technician was knowledgeable, professional, and completed the job quickly. 
                    I highly recommend their services!"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-navy text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-2 uppercase text-red-light text-sm tracking-wide font-medium">PROTECH HVAC SERVICES</div>
            <h2 className="text-3xl font-bold mb-4">Ready to schedule your {serviceInfo.item.name} {serviceInfo.serviceType.name}?</h2>
            <p className="text-lg text-ivory/80 mb-8 max-w-3xl mx-auto">Contact our team today for expert service in {serviceInfo.locationName} and surrounding areas.</p>
            <a 
              href="/contact" 
              className="inline-block bg-red hover:bg-red-dark text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              Schedule Now
            </a>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}