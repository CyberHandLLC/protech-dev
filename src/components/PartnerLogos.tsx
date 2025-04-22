'use client';

import React from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';

interface PartnerLogo {
  name: string;
  logoPath: string;
  width: number;
  height: number;
}

interface PartnerLogosProps {
  title?: string;
  subtitle?: string;
}

export default function PartnerLogos({ title = "Trusted by Industry-Leading Brands", subtitle = "" }: PartnerLogosProps) {
  // Check if we're in the browser before using window
  const isBrowser = typeof window !== 'undefined';
  
  const partnerLogos: PartnerLogo[] = [
    { name: 'Velocity', logoPath: '/logos/velocitylogo.svg', width: 160, height: 40 },
    { name: 'Planet Fitness', logoPath: '/logos/planetf.svg', width: 160, height: 40 },
    { name: 'Steingass', logoPath: '/logos/steingasslogo.png', width: 160, height: 40 },
    { name: 'Corporate Property', logoPath: '/logos/logo-corporate.50d670.svg', width: 160, height: 40 },
  ];
  
  // Duplicate the array for seamless infinite scrolling
  const allLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <Section className="py-12 bg-dark-blue/30">
      <Container>
        <SectionHeading 
          title={title}
          subtitle={subtitle}
          centered={true}
          className="mb-12"
        />
      
        {/* Logos scroll container with single row */}
        <div className="relative overflow-hidden py-8 max-w-5xl mx-auto bg-white rounded-lg">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Logo track */}
          <div className="overflow-hidden py-4">
            <div className="flex w-max animate-marquee">
              {allLogos.map((logo, index) => (
                <div 
                  key={`${logo.name}-${index}`}
                  className="mx-10 md:mx-20"
                >
                  <div className="h-20 w-48 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className="max-h-12 max-w-[160px] w-auto object-contain" 
                      priority
                      unoptimized={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
