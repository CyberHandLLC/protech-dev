'use client';

import React from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import Container from './ui/Container';

interface PartnerLogo {
  name: string;
  logo: string;
  alt: string;
  website: string;
}

interface PartnerLogosProps {
  title?: string;
  subtitle?: string;
}

export default function PartnerLogos({ title = "Brands We Partner With", subtitle = "Industry leaders who trust ProTech HVAC for their service needs" }: PartnerLogosProps) {
  const partnerLogos: PartnerLogo[] = [
    { 
      name: 'Tradesmen International', 
      logo: '/images/partners/tradesmen-international.svg', 
      alt: 'Tradesmen International logo', 
      website: 'https://www.tradesmeninternational.com/' 
    },
    { 
      name: 'Planet Fitness', 
      logo: '/images/partners/planet-fitness.svg', 
      alt: 'Planet Fitness logo', 
      website: 'https://www.planetfitness.com/gyms/wooster-oh' 
    },
    { 
      name: 'Steingass Mechanical', 
      logo: '/images/partners/steingass-mechanical.svg', 
      alt: 'Steingass Mechanical logo', 
      website: 'https://steingassmechanical.com/' 
    },
    { 
      name: 'Velocity Mechanical', 
      logo: '/images/partners/velocity-mechanical.svg', 
      alt: 'Velocity Mechanical logo', 
      website: 'https://www.velocity-mechanical.com/' 
    }
  ];

  return (
    <Section className="py-16 sm:py-20 bg-gradient-to-b from-navy to-dark-blue">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">{title}</h2>
          {subtitle && <p className="text-ivory/80 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {partnerLogos.map((partner) => (
            <a 
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center transition-all"
              aria-label={`Visit ${partner.name} website`}
            >
              <div className="relative h-16 w-full mb-4 flex items-center justify-center">
                <PartnerLogo name={partner.name} />
              </div>
              <span className="text-sm text-center text-ivory/80 group-hover:text-ivory transition-colors">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Logo components
function PartnerLogo({ name }: { name: string }) {
  switch(name) {
    case 'Tradesmen International':
      return (
        <svg viewBox="0 0 240 80" className="h-12 w-auto max-w-full opacity-70 group-hover:opacity-100 transition-opacity">
          <path fill="#f6f6f5" d="M39.5 21h162v38h-162z"/>
          <path fill="#1c2442" d="M52 33h9v2h-7v3h6v2h-6v3h7v2h-9V33zm14.3 0h2l6 12h-2.4l-1.2-2.5h-7l-1.1 2.5h-2.3l6-12zm.9 2.5l-2.6 5h5l-2.4-5zm12.3-2.5h5.7c3.3 0 4.6 1.7 4.6 4 0 2.4-1.3 4-4.6 4h-3.7v4h-2V33zm5.6 6c1.7 0 2.6-.8 2.6-2s-.9-2-2.6-2h-3.6v4h3.6zM98 33h2v10h6v2h-8V33zm12 0h2v12h-2V33zm5 0h2l7 8.3V33h2v12h-2l-7-8.3V45h-2V33zm13.3 0h2l6 12h-2.4l-1.2-2.5h-7l-1.1 2.5h-2.3l6-12zm.9 2.5l-2.6 5h5l-2.4-5zm15.3 1.6c-.8-.9-1.8-1.2-3-1.2-2.6 0-4.5 2-4.5 4.5 0 2.6 1.9 4.5 4.5 4.5 1.2 0 2.2-.4 3-1.3v1.6c-.8.5-1.9.7-3 .7-3.5 0-6.5-2.4-6.5-5.6 0-3.1 3-5.5 6.5-5.5 1.2 0 2.3.3 3 .7v1.6zm2.9-4.1h2v10h6v2h-8V33zm16.3 0h2l6 12h-2.4l-1.2-2.5h-7l-1.1 2.5h-2.3l6-12zm.9 2.5l-2.6 5h5l-2.4-5z"/>
        </svg>
      );
    case 'Planet Fitness':
      return (
        <svg viewBox="0 0 240 80" className="h-12 w-auto max-w-full opacity-70 group-hover:opacity-100 transition-opacity">
          <path fill="#c9147e" d="M194 37c-3 0-5.3 2.4-5.3 5.3 0 3 2.4 5.3 5.3 5.3 3 0 5.3-2.4 5.3-5.3 0-3-2.4-5.3-5.3-5.3zm0 7.6c-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3 1.3 0 2.3 1 2.3 2.3 0 1.3-1 2.3-2.3 2.3zM51.5 32h-7.7v16h4.6v-5.3H52c3.7 0 6.2-2.3 6.2-5.4 0-3-2.5-5.3-6.3-5.3v.1h-.4zm.8 7h-3.9v-3.3h3.9c1.2 0 2.2.6 2.2 1.6 0 1-.9 1.7-2.2 1.7zm14-7h-9.7v16h4.6v-5.1h4.6a5.3 5.3 0 0 0 5.6-5.5c0-3-2.3-5.4-5.1-5.4zm-.5 7h-4.6v-3.2h4.6c1 0 1.7.7 1.7 1.6 0 .9-.7 1.6-1.7 1.6zm23.4-7h-5.7c-4.6 0-8.3 3.4-8.3 8s3.7 8 8.3 8h5.7a8 8 0 0 0 8.3-8c0-4.6-3.7-8-8.3-8zm0 12h-5.7a4 4 0 0 1-4-4c0-2.2 1.8-4 4-4h5.7c2.2 0 4 1.8 4 4 0 2.2-1.8 4-4 4zM109 32H98v16h4v-3.8h7c4 0 6.7-2.5 6.7-6.1 0-3.6-2.7-6.1-6.7-6.1zm-.2 8.2h-6.7v-4.2h6.7c1.5 0 2.6.8 2.6 2.1s-1 2.1-2.6 2.1zM126 32h-9.2v16h9.2c4.6 0 8-3.6 8-8s-3.4-8-8-8zm0 12h-4.5v-8h4.5a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4zm34-12h-9.1v16h4v-4h5.2c4 0 6.7-2.3 6.7-6 0-3.8-2.8-6-6.8-6zm-.2 8h-4.9v-4h4.9a2 2 0 0 1 0 4zm27.2-8h-16.4v4h6.2v12h4v-12h6.2v-4z"/>
        </svg>
      );
    case 'Steingass Mechanical':
      return (
        <svg viewBox="0 0 240 80" className="h-12 w-auto max-w-full opacity-70 group-hover:opacity-100 transition-opacity">
          <path fill="#f6f6f5" d="M40 29h160v28H40z"/>
          <path fill="#1c2442" d="M48 38h3.8c2.2 0 3.8 1.6 3.8 3.8v.4c0 2.2-1.6 3.8-3.8 3.8H48V38zm1.6 1.4v5.3h2.2c1.4 0 2.3-1 2.3-2.5v-.4c0-1.5-1-2.5-2.3-2.5h-2.2zm7.3-1.4h1.6v4h4v-4h1.6v8h-1.6v-2.8h-4v2.9h-1.6v-8zm11 1.4h-2.8v-1.3h7.2v1.3h-2.8v6.7h-1.6V39zm5.2-1.3h1.7l2.7 3.8 2.8-3.8h1.7v8h-1.6v-5.7l-2.8 3.6h-.1l-2.7-3.6v5.7h-1.6v-8zm12 0h5.2v1.3h-3.6v2h3.5v1.3h-3.5v2.1h3.6v1.3h-5.2v-8zm12.7 0h1.8l3.9 5.4v-5.4h1.6v8h-1.7l-4-5.5v5.5h-1.6v-8zm12 0h3.4a2.3 2.3 0 0 1 2.5 2.3c0 1-.5 1.7-1.3 2l1.4 3.7h-1.7l-1.2-3.3h-1.6v3.3h-1.6v-8zm3.3 3.4c.7 0 1.1-.4 1.1-1s-.4-1.1-1.1-1.1h-1.8v2.1h1.8zm4.5-3.4h1.6v3l3.3-3h2l-3.5 3 3.6 5h-2l-2.6-3.7-.8.8v3h-1.6v-8zm11.4 0h1.6v8h-1.6v-8zm5.9 0h1.9l2.9 5 1.2 2.3h.1c-.1-.6-.2-2-.2-2.3v-5h1.6v8h-1.9l-2.9-5-1.2-2.2h-.1c.1.6.2 2 .2 2.3v4.9h-1.6v-8zm15 0h2.5c2.7 0 4.5 1.7 4.5 4v.1c0 2.3-1.8 4-4.5 4h-2.5v-8zm2.5 6.7c1.8 0 2.9-1.1 2.9-2.6V42c0-1.5-1-2.6-2.9-2.6h-.9v6.7h.9zm7.6-6.7h1.6v8h-1.6v-8zm5 4.8V42c0-2.3 1.8-4 4.3-4a4 4 0 0 1 3.2 1.5l-1 1a2.8 2.8 0 0 0-2.2-1c-1.5 0-2.6 1.2-2.6 2.6v.1a2.6 2.6 0 0 0 2.8 2.7 3 3 0 0 0 1.9-.7v-1.3h-2v-1.3h3.6v3.2a5 5 0 0 1-3.5 1.3 3.9 3.9 0 0 1-4.3-3.9z"/>
        </svg>
      );
    case 'Velocity Mechanical':
      return (
        <svg viewBox="0 0 240 80" className="h-12 w-auto max-w-full opacity-70 group-hover:opacity-100 transition-opacity">
          <path fill="#f6f6f5" d="M44 20h152v40H44z"/>
          <path fill="#c71f3e" d="M52.3 32.4l5.2 13.7h-4.1l-3-8.3-3.1 8.3h-4l5.3-13.7h3.7zm10.8 0v13.7h-3.8V32.4h3.8zm11.9 0v3.3h-4.2v10.4h-3.8V35.7h-4.2v-3.3h12.2zm13.5 0v3.3h-8v2h7.1v3h-7.1v2h8.2v3.3h-12v-13.7h11.8zm12.8 3.4c-1-1-2.3-1.4-3.5-1.4-1 0-1.9.4-1.9 1.3 0 .8.6 1.1 1.6 1.3l2.5.6c2.8.6 4.5 2 4.5 4.5 0 2.9-2.3 4.4-5.6 4.4-2.4 0-4.7-.8-6.5-2.6l2.2-2.6c1.2 1.1 2.8 1.8 4.3 1.8 1.3 0 2-.5 2-1.3 0-.7-.5-1.1-1.7-1.3l-2.5-.6c-2.8-.6-4.3-2.2-4.3-4.5 0-3 2.4-4.4 5.4-4.4 2.2 0 4.3.7 5.8 2l-2.3 2.8zm15.8-3.4l-5.4 13.7h-3.8L103 32.4h4l2.6 8.2 2.7-8.2h4zM131 37V29h3.8v12.9c0 2.7-1.4 4.4-4.7 4.4-1.8 0-3.3-.5-4.5-1.7l2-2.5c.8.6 1.4.9 2.2.9 1 0 1.2-.7 1.2-1.4v-.7c-.7 1-1.6 1.6-3 1.6-2.8 0-5-2.1-5-5.4v-.1c0-3.2 2.3-5.4 5-5.4 1.4 0 2.4.6 3.1 1.6zm-1 4.5v-.1c0-1.7-1.1-2.9-2.7-2.9-1.5 0-2.7 1.2-2.7 2.9v.1c0 1.7 1.2 2.9 2.7 2.9 1.6 0 2.7-1.2 2.7-2.9zM147.6 37v11h-3.8v-1.8c-.7 1.2-1.8 2-3.4 2-2.7 0-5-2.1-5-5.6V37h3.8v5c0 1.6.8 2.5 2 2.5 1.4 0 2.3-.9 2.3-2.6V37h4.1zm6.3-1.8c1.6 0 2.6.6 3.3 1.6v-1.4h3.8v10.7h-3.8v-1.5c-.7 1-1.8 1.7-3.4 1.7-2.8 0-5.2-2.1-5.2-5.6V42c0-3.4 2.4-5.6 5.3-5.6zm1 9.3c1.7 0 2.7-1.4 2.7-3v-.1c0-1.7-1-3-2.7-3s-2.7 1.3-2.7 3v.2c0 1.6 1 2.9 2.7 2.9zm15.4-9.3c1.6 0 2.7.6 3.3 1.6v-1.4h3.8v10.7h-3.8v-1.5c-.7 1-1.8 1.7-3.3 1.7-2.8 0-5.3-2.1-5.3-5.6V42c0-3.4 2.5-5.6 5.3-5.6zm1 9.3c1.6 0 2.7-1.4 2.7-3v-.1c0-1.7-1-3-2.7-3-1.6 0-2.7 1.3-2.7 3v.2c0 1.6 1 2.9 2.7 2.9zm17-8.2c-1-1-2.3-1.4-3.5-1.4-1 0-1.9.4-1.9 1.3 0 .8.6 1.1 1.6 1.3l2.5.6c2.8.6 4.5 2 4.5 4.5 0 2.9-2.3 4.4-5.6 4.4-2.4 0-4.7-.8-6.5-2.6l2.2-2.6c1.2 1.1 2.8 1.8 4.3 1.8 1.3 0 2-.5 2-1.3 0-.7-.5-1.1-1.7-1.3l-2.5-.6c-2.8-.6-4.3-2.2-4.3-4.5 0-3 2.4-4.4 5.4-4.4 2.2 0 4.3.7 5.8 2l-2.3 2.8z"/>
        </svg>
      );
    default:
      return <span className="text-ivory/70">{name}</span>;
  }
}
