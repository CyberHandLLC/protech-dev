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
    { name: 'Steingass', logoPath: '/logos/steingasslogo.svg', width: 900, height: 225 },
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
          {/* Gradient overlays - slightly reduced on mobile */}
          <div className="absolute left-0 top-0 h-full w-16 md:w-28 bg-gradient-to-r from-navy to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-16 md:w-28 bg-gradient-to-l from-navy to-transparent z-10"></div>
          
          {/* Logo track - using two identical containers for continuous loop */}
          <div className="overflow-hidden py-4 relative">
            {/* First copy - adjust spacing on mobile */}
            <div className="flex space-x-4 md:space-x-8 animate-marquee whitespace-nowrap">
              {allLogos.map((logo, index) => (
                <div 
                  key={`first-${logo.name}-${index}`}
                  className="inline-block flex-shrink-0"
                >
                  <div className="h-16 md:h-20 w-32 md:w-48 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className={`w-auto h-auto object-contain drop-shadow-lg brightness-150 
                        ${logo.name === 'Planet Fitness' 
                          ? 'max-h-14 md:max-h-24 max-w-[100px] md:max-w-[145px]' 
                          : logo.name === 'Steingass' 
                            ? 'max-h-24 md:max-h-36 max-w-[200px] md:max-w-[350px]' 
                            : 'max-h-12 md:max-h-15 max-w-[120px] md:max-w-[175px]'}`}
                      priority={index < 5} // Only prioritize loading the first few
                      unoptimized={true}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second copy - identical setup for continuous scrolling */}
            <div className="flex space-x-4 md:space-x-8 animate-marquee-2 whitespace-nowrap" aria-hidden="true">
              {allLogos.map((logo, index) => (
                <div 
                  key={`second-${logo.name}-${index}`}
                  className="inline-block flex-shrink-0"
                >
                  <div className="h-16 md:h-20 w-32 md:w-48 flex items-center justify-center">
                    <Image 
                      src={logo.logoPath} 
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className={`w-auto h-auto object-contain drop-shadow-lg brightness-150 
                        ${logo.name === 'Planet Fitness' 
                          ? 'max-h-14 md:max-h-24 max-w-[100px] md:max-w-[145px]' 
                          : logo.name === 'Steingass' 
                            ? 'max-h-24 md:max-h-36 max-w-[200px] md:max-w-[350px]' 
                            : 'max-h-12 md:max-h-15 max-w-[120px] md:max-w-[175px]'}`}
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
