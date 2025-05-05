'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';

export default function WhyChooseUs() {
  // Features highlighting why customers should choose this HVAC company
  const features = [
    {
      icon: '/icons/experienced.svg',
      title: 'Experienced Professionals',
      description: 'Skilled technicians with extensive training and hands-on experience.'
    },
    {
      icon: '/icons/fast-response.svg',
      title: 'Fast Response',
      description: 'Quick service when you need it most, especially in emergencies.'
    },
    {
      icon: '/icons/guaranteed.svg',
      title: 'Guaranteed Work',
      description: '100% satisfaction guarantee on all our services.'
    },
    {
      icon: '/icons/licensed.svg',
      title: 'Licensed & Insured',
      description: 'Full protection and peace of mind with every service call.'
    },
    {
      icon: '/icons/availability.svg',
      title: '24/7 Availability',
      description: 'Round-the-clock service for emergency situations.'
    },
    {
      icon: '/icons/pricing.svg',
      title: 'Upfront Pricing',
      description: 'No hidden fees or surprise costs - transparent pricing.'
    }
  ];

  // Create refs for animation when elements come into view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Section padding="py-20 px-4 md:px-8" bgColor="navy">
      <Container maxWidth="xl">
        <SectionHeading
          title="Why Choose ProTech HVAC"
          subtitle="With decades of experience and a commitment to excellence, we provide unmatched heating and cooling services for your home or business."
          centered
          className="mb-12"
        />
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
        >
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`relative transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="pl-6 border-l-4 border-red h-full flex flex-col relative before:absolute before:content-[''] before:w-4 before:h-4 before:rounded-full before:bg-red before:left-[-10px] before:top-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red/10 p-2.5 flex items-center justify-center mr-3">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-full h-full object-contain filter brightness-0 invert opacity-80"
                      onError={(e) => {
                        // Fallback to text emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.textContent = ['💼', '⚡', '💯', '🛡️', '⏰', '💰'][index];
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-ivory/80 ml-15">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-24 relative">
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red/50 to-transparent" style={{ maxWidth: '90%', margin: '0 auto', left: '5%', right: '5%' }}></div>
          <div className="pt-16 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '24/7', label: 'Emergency Service' },
              { number: '<60m', label: 'Average Response Time' },
              { number: '100%', label: 'Customer Satisfaction' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${600 + (index * 100)}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-red mb-2">
                  {stat.number}
                </div>
                <p className="text-white text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red/50 to-transparent" style={{ maxWidth: '90%', margin: '0 auto', left: '5%', right: '5%' }}></div>
        </div>
      </Container>
    </Section>
  );
}