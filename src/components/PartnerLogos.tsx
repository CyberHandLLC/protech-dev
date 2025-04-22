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
  const partnerLogos: PartnerLogo[] = [
    { name: 'Velocity', logoPath: '/logos/velocitylogo.svg', width: 120, height: 40 },
    { name: 'Planet Fitness', logoPath: '/logos/planetf.svg', width: 120, height: 40 },
    { name: 'Steingass', logoPath: '/logos/steingasslogo.png', width: 120, height: 40 },
    { name: 'Corporate Property', logoPath: '/logos/logo-corporate.50d670.svg', width: 120, height: 40 },
  ];
  
  // Duplicate the array for seamless infinite scrolling (3 sets for longer scroll)
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
        <div className="relative overflow-hidden py-8 max-w-5xl mx-auto">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-gradient-to-r from-dark-blue/30 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-gradient-to-l from-dark-blue/30 to-transparent z-10"></div>
          
          {/* Logo track */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee">
              {allLogos.map((logo, index) => (
                <div 
                  key={`${logo.name}-${index}`}
                  className="mx-8 md:mx-16"
                >
                  <div className="h-10 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className="h-7 w-auto object-contain" 
                      style={{ filter: 'brightness(0) invert(1)' }}
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
