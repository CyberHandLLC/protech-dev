/**
 * Server Component version of PartnerLogos
 * This renders the entire partner logos section on the server
 */
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

export default function PartnerLogosServer({ title = "Trusted by Industry-Leading Brands", subtitle = "" }: PartnerLogosProps) {
  const partnerLogos: PartnerLogo[] = [
    { name: 'Velocity', logoPath: '/logos/velocitylogo.svg', width: 160, height: 40 },
    { name: 'Planet Fitness', logoPath: '/logos/planetf.svg', width: 180, height: 60 },
    { name: 'Steingass', logoPath: '/logos/steingasslogo.svg', width: 900, height: 225 },
    { name: 'Corporate Property', logoPath: '/logos/logo-corporate.50d670.svg', width: 160, height: 40 },
  ];
  
  // A static version doesn't need duplicates like the animated version
  return (
    <Section className="py-12 bg-dark-blue/30">
      <Container>
        <SectionHeading 
          title={title}
          subtitle={subtitle}
          centered={true}
          className="mb-12"
        />
      
        {/* Static logo display for server rendering */}
        <div className="relative py-8 max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partnerLogos.map((logo) => (
              <div 
                key={logo.name}
                className="flex items-center justify-center px-6 py-4"
              >
                <Image 
                  src={logo.logoPath} 
                  alt={`${logo.name} logo`}
                  width={logo.width}
                  height={logo.height}
                  className={`w-auto object-contain drop-shadow-lg brightness-150 ${
                    logo.name === 'Planet Fitness' ? 'max-h-24 max-w-[145px]' : 
                    logo.name === 'Steingass' ? 'max-h-36 max-w-[350px]' : 
                    'max-h-15 max-w-[175px]'
                  }`} 
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
