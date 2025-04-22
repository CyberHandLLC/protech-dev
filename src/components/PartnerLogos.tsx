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
    { name: 'Velocity', logoPath: '/logos/velocitylogo.svg', width: 160, height: 40 },
    { name: 'Planet Fitness', logoPath: '/logos/planetf.svg', width: 180, height: 60 },
    { name: 'Steingass', logoPath: '/logos/steingasslogo.png', width: 160, height: 40 },
    { name: 'Corporate Property', logoPath: '/logos/logo-corporate.50d670.svg', width: 160, height: 40 },
  ];
  
  // Create enough duplicates to ensure continuous scrolling without reset
  const allLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];

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
          <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-gradient-to-r from-navy to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-gradient-to-l from-navy to-transparent z-10"></div>
          
          {/* Logo track - using two identical containers for continuous loop */}
          <div className="overflow-hidden py-4 relative">
            <div className="inline-flex space-x-8 animate-marquee">
              {allLogos.map((logo, index) => (
                <div 
                  key={`first-${logo.name}-${index}`}
                  className="inline-flex"
                >
                  <div className="h-14 w-36 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className={`w-auto object-contain drop-shadow-lg brightness-150 ${logo.name === 'Planet Fitness' ? 'max-h-12 max-w-[145px]' : 'max-h-10 max-w-[120px]'}`} 
                      priority
                      unoptimized={true}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second copy of the same content to ensure continuous loop */}
            <div className="inline-flex space-x-8 animate-marquee-2" aria-hidden="true">
              {allLogos.map((logo, index) => (
                <div 
                  key={`second-${logo.name}-${index}`}
                  className="inline-flex"
                >
                  <div className="h-14 w-36 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className={`w-auto object-contain drop-shadow-lg brightness-150 ${logo.name === 'Planet Fitness' ? 'max-h-12 max-w-[145px]' : 'max-h-10 max-w-[120px]'}`} 
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
