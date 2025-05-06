import React from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import PageLayout from '@/components/PageLayout';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for client-side tracking component
const ContactPageWrapper = dynamic(() => import('@/components/contact/ContactPageWrapper'), {
  ssr: false
});

// Helper function for generating section headers with consistent styling
const SectionHeader = ({ accentText, title, subtitle, centered = true }: { accentText: string; title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`${centered ? 'text-center' : ''} mb-${subtitle ? '12' : '8'}`}>
    <div className={`inline-block mb-4`}>
      <div className={`h-1 w-24 bg-red ${centered ? 'mx-auto' : ''} mb-3`}></div>
      <span className="text-red-light uppercase text-sm tracking-wider font-medium">{accentText}</span>
    </div>
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    {subtitle && <p className="text-ivory/80 max-w-3xl mx-auto">{subtitle}</p>}
  </div>
);

export const metadata: Metadata = {
  title: 'Contact ProTech HVAC | Request Service or Get a Quote',
  description: 'Contact ProTech HVAC for all your heating and cooling needs. Schedule service, request a quote, or get emergency HVAC assistance in Northeast Ohio.',
  keywords: ['HVAC contact', 'heating and cooling service', 'schedule HVAC service', 'HVAC quote', 'ProTech HVAC contact'],
};

export default function ContactPage() {
  const businessHours = [
    'Monday - Friday: 8:00 AM - 6:00 PM',
    'Saturday: 9:00 AM - 2:00 PM',
    'Sunday: Closed (Emergency Service Available)'
  ];

  return (
    <PageLayout>
      <ContactPageWrapper>
        {/* Hero section with dark navy background */}
        <section className="bg-navy py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
            <span className="text-red-light uppercase text-sm tracking-wider font-medium">Get in Touch</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="mt-4 text-lg text-ivory/80 max-w-2xl mx-auto">
            Reach out for expert HVAC service, quotes, or any questions about your heating and cooling needs.
          </p>
        </div>
      </section>
      
      {/* Contact Options Section */}
      <section className="py-12 px-4 md:px-8 bg-navy text-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            accentText="Our Services" 
            title="How Can We Help You?" 
            subtitle="Whether you need emergency service, want to schedule maintenance, or just have questions about our services, our team is ready to assist you." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emergency Service */}
            <div className="bg-dark-blue rounded-xl p-6 text-center hover:border-red transition-colors border border-dark-blue-light group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red to-red-dark flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl text-white">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red transition-colors">Emergency Service</h3>
              <p className="text-ivory/80 mb-4">
                Available 24/7 for urgent heating and cooling issues. Fast response times throughout Northeast Ohio.
              </p>
              <a 
                href="tel:8005554822" 
                className="inline-flex items-center justify-center w-full py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition-colors"
              >
                <span className="mr-2">📞</span> Call Now: 330-642-HVAC
              </a>
            </div>
            
            {/* Schedule Service */}
            <div className="bg-dark-blue rounded-xl p-6 text-center hover:shadow-md transition-all border border-dark-blue-light">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red to-red-dark flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Schedule Service</h3>
              <p className="text-ivory/80 mb-4">
                Book an appointment for maintenance, repairs, or system evaluations at your convenience.
              </p>
              <Link 
                href="/schedule" 
                className="inline-flex items-center justify-center w-full py-3 bg-dark-blue text-white rounded-lg font-medium hover:bg-dark-blue/90 transition-colors"
              >
                <span className="mr-2">🗓️</span> Schedule Online
              </Link>
            </div>
            
            {/* Get a Quote */}
            <div className="bg-dark-blue rounded-xl p-6 text-center hover:shadow-md transition-all border border-dark-blue-light">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red to-red-dark flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Get a Quote</h3>
              <p className="text-ivory/80 mb-4">
                Request a detailed quote for system replacements, installations, or major repairs.
              </p>
              <a 
                href="#contact-form" 
                className="inline-flex items-center justify-center w-full py-3 bg-dark-blue text-white rounded-lg font-medium hover:bg-dark-blue/90 transition-colors"
              >
                <span className="mr-2">📝</span> Request a Quote
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form and Business Hours Section */}
      <section className="py-12 px-4 md:px-8 bg-navy-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="h-1 w-16 bg-red mb-3"></div>
              <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
              <p className="text-ivory/80 mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            
            <ContactForm />
          </div>
            
          {/* Business Hours and Contact Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="h-1 w-16 bg-red mb-3"></div>
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-dark-blue rounded-xl p-6 border border-dark-blue-light hover:border-red transition-colors group border-l-4 border-l-red">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red transition-colors">ProTech Heating & Cooling</h3>
                <address className="not-italic mb-4 text-ivory/80">
                  <a href="tel:8005554822" className="text-ivory/90 hover:text-red-light">800-555-HVAC (4822)</a><br />
                  <a href="mailto:info@protechheatingandcooling.net" className="text-ivory/90 hover:text-red-light">info@protechheatingandcooling.net</a>
                </address>
                <div className="border-t border-dark-blue-light pt-4">
                  <h4 className="text-white font-medium mb-2">Business Hours:</h4>
                  <ul className="text-ivory/80 space-y-1">
                    {businessHours.map((hour, idx) => (
                      <li key={idx}>{hour}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Areas Section */}
      <section className="py-12 px-4 md:px-8 bg-navy">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            accentText="Service Areas" 
            title="Areas We Serve" 
          />
          <div className="bg-dark-blue rounded-xl p-8 border border-dark-blue-light text-center">
            <p className="text-xl text-ivory/90 mb-4">
              We proudly provide HVAC services throughout Northeast Ohio
            </p>
            <p className="text-ivory/80 mb-6">
              Our service area includes the greater Cleveland, Akron, and Canton regions, along with all surrounding communities.
            </p>
            <div className="inline-flex items-center justify-center">
              <a 
                href="tel:8005554822" 
                className="bg-red text-white hover:bg-red-dark px-6 py-3 rounded-lg font-medium transition-all text-center inline-flex items-center"
              >
                <span className="mr-2">📞</span> Call for Service Availability
              </a>
            </div>
          </div>
        </section>
      </ContactPageWrapper>
    </PageLayout>
  );
}