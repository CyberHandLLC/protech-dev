import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';

// Define types for our parameters
type ServicePageParams = {
  params: {
    category: string;
    service: string;
    location: string;
  };
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
  { params }: { params: { category: string; service: string; location: string } }
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
  const locationDisplay = location
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
export default function ServicePage({ params }: ServicePageParams) {
  const { category, service, location } = params;
  
  // Get service data
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if service doesn't exist
  if (!serviceInfo) {
    notFound();
  }

  // Format location for display
  const locationDisplay = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <PageLayout>
      <main>
        {/* Hero section with dark navy background */}
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb navigation */}
            <nav className="text-sm mb-6">
              <ol className="flex flex-wrap items-center space-x-2">
                <li>
                  <Link href="/" className="text-ivory/70 hover:text-red-light transition-colors">
                    Home
                  </Link>
                </li>
                <li><span className="text-ivory/40">/</span></li>
                <li>
                  <Link href="/services" className="text-ivory/70 hover:text-red-light transition-colors">
                    Services
                  </Link>
                </li>
                <li><span className="text-ivory/40">/</span></li>
                <li>
                  <Link href={`/services?category=${category}`} className="text-ivory/70 hover:text-red-light transition-colors">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                </li>
                <li><span className="text-ivory/40">/</span></li>
                <li className="text-red-light">{serviceInfo.title}</li>
              </ol>
            </nav>
            
            {/* Service Title */}
            <div className="mb-8 max-w-3xl">
              <div className="h-1 w-24 bg-red mb-4"></div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {serviceInfo.title} in {locationDisplay}
              </h1>
              <p className="text-xl text-ivory/80 mt-4">
                {serviceInfo.description}
              </p>
            </div>
          </div>
        </section>
        
        {/* Service Content - Two columns */}
        <section className="bg-navy-light py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-ivory/80 mb-8 leading-relaxed text-lg">
                  Trust our experienced technicians to provide reliable {serviceInfo.title.toLowerCase()} in {locationDisplay}.
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
                
                <div className="bg-gradient-to-r from-dark-blue to-dark-blue-light p-6 rounded-xl border border-dark-blue-light/30">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Serving {locationDisplay}
                  </h3>
                  <p className="text-ivory/70">
                    We provide fast, reliable service throughout {locationDisplay} and surrounding areas.
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
        
        <CTASection location={locationDisplay} />
      </main>
    </PageLayout>
  );
}