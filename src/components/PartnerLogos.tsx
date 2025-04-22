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
    { name: 'Planet Fitness', logoPath: '/logos/planetf.svg', width: 160, height: 40 },
    { name: 'Velocity', logoPath: '/logos/velocitylogo.svg', width: 140, height: 40 },
    { name: 'Steingass', logoPath: '/logos/steingasslogo.png', width: 150, height: 40 },
    { name: 'Corporate Property', logoPath: '/logos/logo-corporate.50d670.svg', width: 150, height: 40 },
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
      
        {/* Logos scroll container */}
        <div className="relative overflow-hidden py-8">
          {/* Gradient overlay on left side */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-dark-blue/30 to-transparent z-10"></div>
          
          {/* Scrolling marquee */}
          <div className="overflow-hidden py-4">
            <div className="animate-marquee inline-block">
              {allLogos.map((logo, index) => (
                <React.Fragment key={`${logo.name}-${index}`}>
                  {/* Logo item */}
                  <div className="inline-block mx-8 align-middle">
                    <div className="flex items-center justify-center h-16 bg-white bg-opacity-10 px-6 py-4 rounded-lg hover:bg-opacity-20 transition-all">
                      <Image 
                        src={logo.logoPath} 
                        alt={`${logo.name} logo`}
                        width={logo.width}
                        height={logo.height}
                        className="max-h-12 w-auto object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                  
                  {/* Separator between logos, except after the last one */}
                  {index < allLogos.length - 1 && (
                    <div className="inline-block h-6 mx-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Gradient overlay on right side */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-dark-blue/30 to-transparent z-10"></div>
        </div>
      </Container>
    </Section>
  );
}
