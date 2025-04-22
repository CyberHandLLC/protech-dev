import React from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import PageLayout from '@/components/PageLayout';
import type { Metadata } from 'next';

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
  const officeLocations = [
    {
      name: 'Akron Office (Main)',
      address: '123 Main Street, Akron, OH 44301',
      phone: '330-555-4822',
      email: 'info@protechheatingandcooling.net',
      hours: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed (Emergency Service Available)'
      ]
    },
    {
      name: 'Cleveland Office',
      address: '456 Euclid Avenue, Cleveland, OH 44101',
      phone: '216-555-4822',
      email: 'cleveland@protechheatingandcooling.net',
      hours: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed (Emergency Service Available)'
      ]
    },
    {
      name: 'Canton Office',
      address: '789 Market Ave, Canton, OH 44702',
      phone: '330-555-4823',
      email: 'canton@protechheatingandcooling.net',
      hours: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed (Emergency Service Available)'
      ]
    }
  ];

  return (
    <PageLayout>
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
                <span className="mr-2">📞</span> Call Now: 800-555-HVAC
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
      
      {/* Contact Form and Locations */}
      <section className="py-16 px-4 md:px-8 bg-navy-light" id="contact-form">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-dark-blue rounded-xl p-8 border border-dark-blue-light">
            <div className="mb-6">
              <div className="h-1 w-16 bg-red mb-3"></div>
              <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
            </div>
            <ContactForm />
          </div>
            
            {/* Office Locations */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="h-1 w-16 bg-red mb-3"></div>
              <h2 className="text-2xl font-bold text-white">Our Locations</h2>
            </div>
            
            <div className="space-y-6">
              {officeLocations.map((office, index) => (
                <div key={index} className="bg-dark-blue rounded-xl p-6 border border-dark-blue-light hover:border-red transition-colors group border-l-4 border-l-red">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red transition-colors">{office.name}</h3>
                  <address className="not-italic mb-4 text-ivory/80">
                    {office.address}<br />
                    <a href={`tel:${office.phone.replace(/-/g, '')}`} className="text-ivory/90 hover:text-red-light">{office.phone}</a><br />
                    <a href={`mailto:${office.email}`} className="text-ivory/90 hover:text-red-light">{office.email}</a>
                  </address>
                  <div className="border-t border-dark-blue-light pt-4">
                    <h4 className="text-white font-medium mb-2">Business Hours:</h4>
                    <ul className="text-ivory/80 space-y-1">
                      {office.hours.map((hour, idx) => (
                        <li key={idx}>{hour}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 px-4 md:px-8 bg-navy">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            accentText="Service Areas" 
            title="Find Us" 
          />
          <div className="bg-dark-blue h-[400px] rounded-xl flex items-center justify-center border border-dark-blue-light">
            {/* This would be a proper map in a real implementation */}
            <p className="text-ivory/80">Interactive Map Would Be Placed Here</p>
          </div>
          <div className="text-center mt-6">
            <p className="text-ivory/80">
              We proudly serve Akron, Cleveland, Canton, and surrounding areas in Northeast Ohio.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-navy">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            accentText="Questions & Answers" 
            title="Frequently Asked Questions" 
          />
          
          <div className="space-y-4">
            {[
              {
                question: 'How quickly can you respond to service requests?',
                answer: 'For emergency service, we typically respond within 1-2 hours. For standard service requests, we can usually schedule an appointment within 24-48 hours, depending on the season and current demand.'
              },
              {
                question: 'Do you provide free estimates?',
                answer: 'Yes, we provide free estimates for new system installations and replacements. For repairs, there is a standard diagnostic fee that gets applied toward the cost of repairs if you choose to proceed.'
              },
              {
                question: 'What areas do you service?',
                answer: 'We provide service throughout Northeast Ohio, including Akron, Cleveland, Canton, and surrounding communities. Contact us to confirm if your location is within our service area.'
              },
              {
                question: 'Do you offer financing options?',
                answer: 'Yes, we offer flexible financing options for system replacements and major repairs. Our team can help you understand the available plans and find one that fits your budget.'
              },
            ].map((faq, index) => (
              <div key={index} className="border border-dark-blue-light bg-dark-blue rounded-lg overflow-hidden group">
                <details className="group/details">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-white group-hover:text-red transition-colors">
                    <span>{faq.question}</span>
                    <span className="transition-transform group-open/details:rotate-180 text-red">▼</span>
                  </summary>
                  <div className="p-5 border-t border-dark-blue-light">
                    <p className="text-ivory/80">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-navy to-dark-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">
            Ready to Experience ProTech Quality?
          </h2>
          <p className="text-ivory/90 mb-8 max-w-2xl mx-auto">
            Our team of certified technicians is just a call or click away. Contact us today for all your heating and cooling needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:8005554822" 
              className="bg-red text-white hover:bg-red-dark transition-colors px-8 py-4 rounded-lg font-medium"
            >
              Call: 800-555-HVAC
            </a>
            <Link 
              href="#contact-form" 
              className="bg-white/20 text-ivory hover:bg-white/30 transition-colors px-8 py-4 rounded-lg font-medium border border-white/40"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}