import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import { milestones, coreValues } from '@/data/aboutData';
import AboutPageTracker from '@/components/analytics/AboutPageTracker';

// Helper function for generating section headers with consistent styling
const SectionHeader = ({ accentText, title, centered = true }: { accentText: string; title: string; centered?: boolean }) => (
  <div className={`${centered ? 'text-center' : ''} mb-10`}>
    <div className={`inline-block mb-4`}>
      <div className={`h-1 w-24 bg-red ${centered ? 'mx-auto' : ''} mb-3`}></div>
      <span className="text-red-light uppercase text-sm tracking-wider font-medium">{accentText}</span>
    </div>
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
  </div>
);

/**
 * About page metadata for SEO
 */
export const metadata: Metadata = {
  title: 'About ProTech HVAC | Trusted HVAC Service in Northeast Ohio',
  description: 'Family-owned HVAC service in Northeast Ohio. Professional technicians providing quality heating and cooling solutions with 24/7 emergency availability.',
  keywords: ['ProTech HVAC', 'Northeast Ohio HVAC', 'family owned HVAC', 'Akron HVAC company', 'professional HVAC service', 'heating and cooling services'],
};

/**
 * About page component - Server Component
 * Since this page is mostly static content, it can be a server component
 * The client components (MainNavigation, CTASection) are imported and used within this server component
 */
export default function AboutPage() {
  return (
    <PageLayout>
      <AboutPageTracker>
      {/* Hero section with dark navy background */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
            <span className="text-red-light uppercase text-sm tracking-wider font-medium">About Our Company</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">About ProTech Heating & Cooling</h1>
          <p className="mt-4 text-lg text-ivory/80 max-w-2xl mx-auto">
            Your trusted partner for comprehensive HVAC solutions in Northeast Ohio. Family-owned, professionally operated.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-navy-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-2 border-dark-blue-light pl-6 py-2 group">
              <h2 className="text-3xl font-bold text-white mb-6 group-hover:text-red transition-colors">Our Story</h2>
              <div className="space-y-4 text-ivory/80">
                <p>
                  Leon began his journey in the HVAC industry with a passion for providing top-notch services to close friends and family. Recognizing the broader community's need for quality heating and cooling solutions, he established 'Heating and Cooling'.
                </p>
                <p>
                  With dedication and hard work, the business grew, becoming a trusted name in Orrville, OH and surrounding communities throughout Northeast Ohio.
                </p>
                <p>
                  Today, under Leon's guidance and unwavering commitment to quality, ProTech stands proudly as a leading heating and air conditioning service provider in Wayne, Stark, Summit, Medina County and its surrounding areas.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-dark-blue rounded-xl overflow-hidden w-full max-w-md aspect-video flex items-center justify-center border border-dark-blue-light relative">
                <div className="w-full h-full overflow-hidden rounded-xl relative">
                  <div className="absolute inset-0 bg-navy/20 z-10"></div>
                  <Image
                    src="/images/hvac-technician.jpg"
                    alt="ProTech HVAC Service Team"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-ivory/50 absolute mt-[340px]">
                The ProTech Heating & Cooling Family
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-navy">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block mb-4">
              <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-ivory/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              To provide exceptional HVAC services that enhance the comfort, safety, and energy efficiency of every home and business we serve, while maintaining the highest standards of professionalism, integrity, and customer satisfaction.
            </p>
            <a
              href="tel:3306424822"
              className="bg-red border-2 border-red text-white hover:bg-red-dark px-8 py-3 rounded-lg font-medium transition-all text-center"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>



      {/* Company Highlights Section */}
      <section className="py-16 px-4 bg-navy-light relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-navy opacity-50 z-0"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-navy opacity-30 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeader
            accentText="What Sets Us Apart"
            title="Our Commitment to Excellence"
            centered={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">Expert Technicians</h3>
              </div>
              <p className="text-ivory/70">Our team of experienced technicians brings professional expertise and dedication to every service call.</p>
            </div>

            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">👪</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">Family-Owned</h3>
              </div>
              <p className="text-ivory/70">Proudly serving Northeast Ohio families with personalized care and attention to detail.</p>
            </div>

            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">24/7 Availability</h3>
              </div>
              <p className="text-ivory/70">Emergency HVAC services available around the clock when you need us most.</p>
            </div>

            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">🔧</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">Quality Equipment</h3>
              </div>
              <p className="text-ivory/70">We use only premium, industry-leading brands and parts for lasting reliability.</p>
            </div>

            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">📅</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">Regular Maintenance</h3>
              </div>
              <p className="text-ivory/70">Comprehensive maintenance plans to keep your HVAC system running efficiently.</p>
            </div>

            <div className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-all hover:shadow-lg group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mr-4 group-hover:bg-red transition-colors">
                  <span className="text-2xl text-ivory">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red transition-colors">Personal Touch</h3>
              </div>
              <p className="text-ivory/70">As a family-owned business, we treat every customer like part of our extended family, providing personalized service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection location="Northeast Ohio" />
      </AboutPageTracker>
    </PageLayout>
  );
}