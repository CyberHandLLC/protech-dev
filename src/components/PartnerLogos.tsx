'use client';

import React from 'react';

interface PartnerLogo {
  name: string;
  color: string;
}

interface PartnerLogosProps {
  title?: string;
  subtitle?: string;
}

export default function PartnerLogos({ title = "Trusted by Industry-Leading Brands", subtitle = "" }: PartnerLogosProps) {
  const partnerLogos: PartnerLogo[] = [
    { name: 'Carrier', color: '#6B7280' },
    { name: 'Trane', color: '#6B7280' },
    { name: 'Lennox', color: '#6B7280' },
    { name: 'York', color: '#6B7280' },
    { name: 'Goodman', color: '#6B7280' },
    { name: 'Rheem', color: '#6B7280' },
    { name: 'Bryant', color: '#6B7280' },
    { name: 'Amana', color: '#6B7280' },
    { name: 'Daikin', color: '#6B7280' },
    { name: 'Ruud', color: '#6B7280' },
  ];
  
  // Duplicate the array for seamless infinite scrolling
  const allLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="py-8 px-4 bg-transparent my-8">
      <div className="container mx-auto mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{title}</h2>
      </div>
      
      {/* Logos scroll container */}
      <div className="relative overflow-hidden">
        {/* Gradient overlay on left side */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-navy to-transparent z-10"></div>
        
        {/* Scrolling marquee */}
        <div className="overflow-hidden whitespace-nowrap py-4">
          <div className="animate-marquee inline-block">
            {allLogos.map((logo, index) => (
              <React.Fragment key={`${logo.name}-${index}`}>
                {/* Logo item */}
                <div className="inline-block mx-4">
                  <div className="flex items-center justify-center h-8">
                    <span className="text-ivory/70 text-lg font-light">{logo.name}</span>
                  </div>
                </div>
                
                {/* Dotted separator between logos, except after the last one */}
                {index < allLogos.length - 1 && (
                  <div className="inline-block h-6 border-l border-dashed border-dark-blue-light mx-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Gradient overlay on right side */}
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-navy to-transparent z-10"></div>
      </div>
    </section>
  );
}
