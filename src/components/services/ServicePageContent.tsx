'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import ServicePageClient from '@/components/services/ServicePageClient';
import ServiceFAQs from '@/components/services/ServiceFAQs';
import CTACallout from '@/components/ui/CTACallout';
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

export default function ServicePageContent({
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
  // State for sticky sidebar
  const [stickyNav, setStickyNav] = useState(false);
  
  // Effect to handle sticky nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setStickyNav(scrollPosition > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Generate FAQs based on service, location, and service type
  const faqs = generateFAQs(serviceInfo.system.name, serviceInfo.serviceType.name, 
                           serviceInfo.item.name, serviceInfo.locationName);
  
  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Services', href: '/services' },
    { label: serviceInfo.categoryName, href: `/services?category=${category}` },
    { label: serviceInfo.system.name, href: `/services?category=${category}#${system}` },
    { label: serviceInfo.serviceType.name, href: `/services?category=${category}#${system}-${serviceType}` },
    { label: serviceInfo.item.name, isCurrentPage: true }
  ];
  
  return (
    <PageLayout>
      <main className="bg-white">
        {/* Top navigation bar */}
        <div className={`bg-dark-blue border-b border-dark-blue-light w-full ${stickyNav ? 'sticky top-16 z-20' : ''} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={breadcrumbItems} className="py-3" />
          </div>
        </div>
        
        {/* Hero section with service details */}
        <section className="bg-navy py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-2/3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-red-light text-3xl">{serviceInfo.item.icon}</span>
                  {serviceInfo.name}
                </h1>
                <p className="text-lg text-ivory/90 mb-6">
                  {serviceInfo.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-ivory/70">
                  <span className="bg-dark-blue-light rounded-full px-4 py-1">
                    {serviceInfo.categoryName}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-dark-blue-light rounded-full px-4 py-1">
                    <span>{serviceInfo.system.icon}</span>
                    <span>{serviceInfo.system.name}</span>
                  </span>
                  <span className="bg-dark-blue-light rounded-full px-4 py-1">
                    {serviceInfo.locationName}
                  </span>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-dark-blue rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-red">📞</span> Need help now?
                  </h3>
                  <p className="text-ivory/80 mb-6">Our certified technicians are ready to assist with your {serviceInfo.item.name.toLowerCase()} {serviceInfo.serviceType.name.toLowerCase()}.</p>
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
              <ServicePageClient
                location={serviceInfo.locationName}
                service={serviceInfo.item.name}
                serviceType={serviceInfo.serviceType.name}
                userLocation={userLocation}
                isLocating={isLocating}
                weatherData={weatherData}
                weatherRecommendation={weatherRecommendation}
              />
              
              {/* Service description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">
                  About Our {serviceInfo.item.name} {serviceInfo.serviceType.name}
                </h2>
                
                <div className="prose prose-lg max-w-none">
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
                  
                  {serviceType === 'emergency' && (
                    <>
                      <p>
                        When your {serviceInfo.item.name.toLowerCase()} system fails unexpectedly, our emergency service provides rapid response to restore comfort to your home or business. We understand that HVAC emergencies don't wait for business hours.
                      </p>
                      <ul>
                        <li>24/7 availability for true emergencies</li>
                        <li>Fast response times throughout our service area</li>
                        <li>Fully stocked service vehicles to handle most repairs on-site</li>
                        <li>Fair pricing even for after-hours service</li>
                        <li>Temporary solutions when immediate repair is not possible</li>
                      </ul>
                    </>
                  )}
                  
                  {serviceType === 'solutions' && (
                    <>
                      <p>
                        Improve the air quality in your home or business with our {serviceInfo.item.name.toLowerCase()} solutions. Proper indoor air quality is essential for comfort, health, and well-being, especially for those with allergies or respiratory conditions.
                      </p>
                      <ul>
                        <li>Indoor air quality testing to identify pollutants</li>
                        <li>Custom solutions based on your specific needs</li>
                        <li>Professional installation and setup</li>
                        <li>Integration with existing HVAC systems</li>
                        <li>Maintenance guidance for optimal performance</li>
                      </ul>
                    </>
                  )}
                </div>
              </section>
              
              {/* Why choose us section */}
              <section className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-navy mb-4">
                  Why Choose ProTech HVAC for Your {serviceInfo.item.name} Needs
                </h2>
                
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
                <ServiceFAQs
                  faqs={faqs}
                  service={serviceInfo.item.name}
                  serviceType={serviceInfo.serviceType.name}
                  location={serviceInfo.locationName}
                />
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                {/* Service Request Form */}
                <div className="bg-navy text-white rounded-lg overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Request Service</h3>
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
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-navy mb-4">Related Services</h3>
                  <ul className="space-y-3">
                    {serviceType !== 'maintenance' && (
                      <li>
                        <Link 
                          href={`/services/${category}/${system}/maintenance/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🛠️</span>
                          <span>{serviceInfo.item.name} Maintenance</span>
                        </Link>
                      </li>
                    )}
                    
                    {serviceType !== 'repairs' && (
                      <li>
                        <Link 
                          href={`/services/${category}/${system}/repairs/${item}/${locationParam}`}
                          className="flex items-center text-navy hover:text-red transition-colors"
                        >
                          <span className="text-red mr-2">🔧</span>
                          <span>{serviceInfo.item.name} Repairs</span>
                        </Link>
                      </li>
                    )}
                    
                    {serviceType !== 'installations' && (
                      <li>
                        <Link 
                          href={`/services/${category}/${system}/installations/${item}/${locationParam}`}
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
                          href={`/services/${category}/${system}/inspections/${item}/${locationParam}`}
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
        <CTACallout
          title={`Ready to schedule your ${serviceInfo.item.name} ${serviceInfo.serviceType.name}?`}
          subtitle={`Contact our team today for expert service in ${serviceInfo.locationName} and surrounding areas.`}
          ctaText="Schedule Now"
          ctaLink="/contact"
        />
      </main>
    </PageLayout>
  );
}