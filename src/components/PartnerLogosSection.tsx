// Server Component - no 'use client' directive
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';

// Props interface
interface PartnerLogosSectionProps {
  title: string;
  subtitle: string;
}

/**
 * PartnerLogos Section - TRUE SERVER COMPONENT
 * 
 * This static content doesn't need interactivity, so it can be fully 
 * rendered on the server to optimize mobile TBT
 */
export default function PartnerLogosSection({ title, subtitle }: PartnerLogosSectionProps) {
  // Content is static and defined server-side
  const partnerLogos = [
    {
      id: 'carrier',
      name: 'Carrier',
      logo: '🏭',
      description: 'Premium heating and cooling systems'
    },
    {
      id: 'trane',
      name: 'Trane',
      logo: '❄️',
      description: 'High-efficiency HVAC solutions'
    },
    {
      id: 'lennox',
      name: 'Lennox',
      logo: '🔥',
      description: 'Innovative climate control technology'
    },
    {
      id: 'rheem',
      name: 'Rheem',
      logo: '🌡️',
      description: 'Reliable heating and cooling products'
    },
    {
      id: 'goodman',
      name: 'Goodman',
      logo: '💨',
      description: 'Value-focused HVAC systems'
    },
    {
      id: 'york',
      name: 'York',
      logo: '⚙️',
      description: 'Durable commercial and residential units'
    }
  ];
  
  // Rendered entirely on the server
  return (
    <Section className="py-16 bg-navy">
      <Container>
        {/* Static content - server rendered */}
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered={true}
          className="text-white"
        />
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partnerLogos.map((partner) => (
            <div 
              key={partner.id} 
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center mb-4 text-3xl">
                {partner.logo}
              </div>
              <h3 className="text-white font-medium">
                {partner.name}
              </h3>
              <p className="text-ivory/70 text-sm">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
