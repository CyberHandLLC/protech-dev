import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import { convertToLocationSlug } from '@/utils/location';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';

// Define types for param objects
type ServiceParams = {
  category: string;
  service: string;
  location: string;
};

// Define props expected by the component
type ServicePageProps = {
  params: ServiceParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Service data - in a real app, this would come from a database or API
const serviceData = {
  'residential': {
    'ac-repair': {
      title: 'AC Repair Services',
      description: 'Expert air conditioner repair for all makes and models',
      icon: '❄️',
      details: [
        'Fast, reliable repairs for all AC brands',
        'Emergency service available 24/7',
        'Upfront pricing with no hidden fees',
        'Certified technicians with years of experience',
        'Comprehensive diagnosis and honest recommendations',
      ],
      faqs: [
        {
          question: 'How quickly can you respond to an AC emergency?',
          answer: 'We offer same-day service for most AC emergencies, and our technicians are available 24/7 for urgent repairs.'
        },
        {
          question: 'What are common signs that my AC needs repair?',
          answer: 'Common signs include unusual noises, warm air blowing, poor airflow, frequent cycling, high humidity, water leaks, or strange odors.'
        },
        {
          question: 'Do you provide warranty on AC repairs?',
          answer: 'Yes, all of our repairs come with a satisfaction guarantee and parts warranty to ensure your peace of mind.'
        }
      ]
    },
    'heating-services': {
      title: 'Heating Services',
      description: 'Comprehensive heating repair and maintenance',
      icon: '🔥',
      details: [
        'Furnace repair and maintenance',
        'Heat pump services',
        'Boiler repair and installation',
        'Radiant heating solutions',
        'Emergency heating repairs'
      ],
      faqs: [
        {
          question: 'How often should I service my heating system?',
          answer: 'We recommend annual maintenance before the heating season begins to ensure optimal performance and safety.'
        },
        {
          question: 'What are signs my furnace needs repair?',
          answer: 'Watch for unusual noises, inconsistent heating, higher than normal energy bills, frequent cycling, or a yellow pilot light instead of blue.'
        }
      ]
    }
  }
};

/**
 * Generate metadata for the page based on URL parameters
 */
export async function generateMetadata(
  { params }: { params: ServiceParams }
): Promise<Metadata> {
  const { category, service, location } = params;
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if service doesn't exist
  if (!serviceInfo) {
    return {
      title: 'Service Not Found',
    };
  }

  // Format location for display
  // First decode any URL-encoded characters that might be in the location
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${serviceInfo.title} in ${locationDisplay} | ProTech HVAC`,
    description: `${serviceInfo.description} in ${locationDisplay}. Professional, reliable service from certified HVAC technicians.`,
    keywords: [service.replace('-', ' '), category, 'HVAC', locationDisplay, 'heating and cooling'],
  };
}

/**
 * Service details page component
 * This is a server component as it primarily displays static content
 */
export default function ServicePage({ params }: ServicePageProps) {
  const { category, service, location } = params;
  
  // Get the user's detected location from server headers
  const userDetectedLocation = getUserLocationFromHeaders();
  
  // Get service data
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if service doesn't exist
  if (!serviceInfo) {
    notFound();
  }

  // Format location for display
  // First decode any URL-encoded characters that might be in the location
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Use the user's detected location name if available
  const actualLocationDisplay = userDetectedLocation?.name || locationDisplay;

  return (
    <PageLayout>
      <main>
        {/* Hero section with dark navy background */}
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
                  {serviceInfo.title} in {actualLocationDisplay}
                </h1>
                <p className="text-xl text-ivory/80 mt-4">
                  {serviceInfo.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Service Content - Two columns */}
        <section className="bg-navy-light py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-ivory/80 mb-8 leading-relaxed text-lg">
                  Trust our experienced technicians to provide reliable {serviceInfo.title.toLowerCase()} in {actualLocationDisplay}.
                  We pride ourselves on prompt service, competitive pricing, and quality workmanship for all HVAC needs.
                </p>
                
                <h3 className="text-2xl font-bold text-white mb-6">
                  Our {serviceInfo.title} Include:
                </h3>
                
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
                    Servicing {(userDetectedLocation?.name || locationDisplay)} and surrounding areas
                  </span>
                </div>
                <div className="bg-dark-blue p-6 rounded-xl mb-12">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Serving {(userDetectedLocation?.name || locationDisplay)}
                  </h3>
                  <p className="text-ivory/70">
                    We provide fast, reliable service throughout {(userDetectedLocation?.name || locationDisplay)} and surrounding areas.
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
        
        <CTASection location={userDetectedLocation?.name || locationDisplay} />
      </main>
    </PageLayout>
  );
}