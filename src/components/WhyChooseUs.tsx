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
      icon: '💼',
      title: 'Experienced Professionals',
      description: 'Skilled technicians with extensive training and hands-on experience.',
      delay: '0'
    },
    {
      icon: '⚡',
      title: 'Fast Response',
      description: 'Quick service when you need it most, especially in emergencies.',
      delay: '100'
    },
    {
      icon: '💯',
      title: 'Guaranteed Work',
      description: '100% satisfaction guarantee on all our services.',
      delay: '200'
    },
    {
      icon: '🛡️',
      title: 'Licensed & Insured',
      description: 'Full protection and peace of mind with every service call.',
      delay: '300'
    },
    {
      icon: '⏰',
      title: '24/7 Availability',
      description: 'Round-the-clock service for emergency situations.',
      delay: '400'
    },
    {
      icon: '💰',
      title: 'Upfront Pricing',
      description: 'No hidden fees or surprise costs - transparent pricing.',
      delay: '500'
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
          className="mb-16"
        />
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className={`transition-all duration-700 ${
                inView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red to-teal flex items-center justify-center text-2xl text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-ivory/80">{feature.description}</p>
            </Card>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '20+', label: 'Years of Experience' },
            { number: '10,000+', label: 'Completed Projects' },
            { number: '99%', label: 'Customer Satisfaction' }
          ].map((stat) => (
            <div 
              key={stat.label}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-red mb-2">
                {stat.number}
              </div>
              <p className="text-white text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}