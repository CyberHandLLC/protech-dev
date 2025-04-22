import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import { teamMembers, milestones, coreValues } from '@/data/aboutData';

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
  title: 'About ProTech HVAC | Our Story & Mission',
  description: 'Learn about ProTech HVAC\'s journey to becoming a trusted provider of heating, cooling, and air quality services in Northeast Ohio.',
  keywords: ['HVAC company', 'heating and cooling services', 'ProTech HVAC history', 'HVAC mission'],
};

/**
 * About page component - Server Component
 * Since this page is mostly static content, it can be a server component
 * The client components (MainNavigation, CTASection) are imported and used within this server component
 */
export default function AboutPage() {
  return (
    <PageLayout>
        {/* Hero section with dark navy background */}
        <section className="bg-navy py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
              <span className="text-red-light uppercase text-sm tracking-wider font-medium">About Our Company</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Story</h1>
            <p className="mt-4 text-lg text-ivory/80 max-w-2xl mx-auto">
              From humble beginnings to becoming a trusted name in HVAC services throughout Northeast Ohio.
            </p>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 px-4 bg-navy-light">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-2 border-dark-blue-light pl-6 py-2 group">
                <h2 className="text-3xl font-bold text-white mb-6 group-hover:text-red transition-colors">The ProTech HVAC Story</h2>
                <div className="space-y-4 text-ivory/80">
                  <p>
                    Founded in 2005 by John Williams, ProTech HVAC began as a small operation with just three technicians serving the Akron area. With a vision to provide exceptional heating and cooling services backed by integrity and technical expertise, our company quickly gained a reputation for reliability.
                  </p>
                  <p>
                    As our customer base grew, so did our team of certified professionals. By 2010, we had expanded our service area to include Cleveland and Canton, bringing our quality HVAC solutions to more homes and businesses throughout Northeast Ohio.
                  </p>
                  <p>
                    Today, ProTech HVAC is proud to employ over 25 certified technicians and staff members who share our commitment to excellence. We've maintained our founding principles while embracing new technologies and sustainable practices to better serve our growing customer base.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-dark-blue rounded-xl overflow-hidden w-full max-w-md aspect-video flex items-center justify-center border border-dark-blue-light">
                  <div className="text-ivory/70 text-center p-4">
                    <p className="font-medium">Company Image</p>
                    <p className="text-sm">In a real implementation, this would be an actual photo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision Section */}
        <section className="py-16 px-4 bg-navy">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="group border-l-2 border-dark-blue-light pl-6 py-2 hover:border-red transition-colors relative">
                <div className="absolute -left-[5px] top-10 transform h-2 w-2 rounded-full bg-dark-blue-light group-hover:bg-red transition-colors"></div>
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-red transition-colors">Our Mission</h2>
                <p className="text-ivory/80 mb-6">
                  At ProTech HVAC, our mission is to enhance the comfort, safety, and efficiency of homes and businesses across Northeast Ohio through exceptional HVAC solutions. We are committed to delivering honest service, technical excellence, and sustainable practices in everything we do.
                </p>
                <p className="text-ivory/80">
                  We believe in building lasting relationships with our customers by providing:
                </p>
                <ul className="list-inside space-y-2 mt-2 text-ivory/80">
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Transparent pricing with no hidden fees</span></li>
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Customized solutions tailored to each client's needs</span></li>
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>24/7 emergency service when you need us most</span></li>
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Energy-efficient recommendations that save money and reduce environmental impact</span></li>
                </ul>
              </div>
              <div className="group border-l-2 border-dark-blue-light pl-6 py-2 hover:border-red transition-colors relative">
                <div className="absolute -left-[5px] top-10 transform h-2 w-2 rounded-full bg-dark-blue-light group-hover:bg-red transition-colors"></div>
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-red transition-colors">Our Vision</h2>
                <p className="text-ivory/80 mb-6">
                  We aspire to be the most trusted HVAC service provider in Northeast Ohio, recognized for our technical expertise, exceptional customer service, and commitment to sustainable practices.
                </p>
                <p className="text-ivory/80 mb-2">
                  Our long-term goals are centered around:
                </p>
                <ul className="list-inside space-y-2 text-ivory/80">
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Lead the industry in adopting energy-efficient technologies</span></li>
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Create lasting relationships with customers and communities</span></li>
                  <li className="flex items-start gap-2"><span className="text-red">•</span> <span>Provide growth opportunities for team members</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-4 bg-navy-light">
          <div className="max-w-6xl mx-auto">
            <SectionHeader accentText="Our Team" title="Meet Our Leadership" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-dark-blue p-6 rounded-lg border border-dark-blue-light hover:border-red transition-colors group">
                  <div className="mb-4 aspect-square rounded-full overflow-hidden bg-navy mx-auto w-40 h-40 flex items-center justify-center">
                    <div className="text-ivory/50 text-2xl font-bold">{member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center group-hover:text-red transition-colors">{member.name}</h3>
                  <p className="text-red-light text-center mb-3">{member.position}</p>
                  <p className="text-ivory/80">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Company Timeline */}
        <section className="py-16 px-4 bg-navy">
          <div className="max-w-5xl mx-auto">
            <SectionHeader accentText="Our History" title="Our Journey" />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-dark-blue-light z-0"></div>
              
              {/* Timeline items */}
              <div className="relative z-10">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} group`}
                  >
                    <div className="w-1/2 px-8">
                      <div className={index % 2 === 0 ? 'text-right' : 'text-left'}>
                        <h3 className="text-xl font-semibold text-white group-hover:text-red transition-colors">{milestone.title}</h3>
                        <p className="text-red-light mb-2">{milestone.year}</p>
                        <p className="text-ivory/80">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center text-white font-bold z-10 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Core Values Section */}
        <section className="py-16 md:py-20 px-4 md:px-8 bg-gradient-to-br from-navy to-dark-blue text-white">
          <div className="max-w-6xl mx-auto text-center">
            <SectionHeader accentText="What Drives Us" title="Our Core Values" />
            {/* Adding top margin to compensate for the removed mb-12 */}
            <div className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-dark-blue border border-dark-blue-light hover:border-red transition-colors rounded-xl p-6 group">
                    <div className="text-3xl mb-4 text-red">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red transition-colors">{value.title}</h3>
                    <p className="text-ivory/80">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <CTASection location="Northeast Ohio" />
    </PageLayout>
  );
}