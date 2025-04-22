// Server Component - no 'use client' directive
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';

/**
 * WhyChooseUs Section - TRUE SERVER COMPONENT
 * 
 * This static content doesn't need interactivity, so it can be fully 
 * rendered on the server to optimize mobile TBT
 */
export default function WhyChooseUsSection() {
  // Content is static and defined server-side
  const reasons = [
    {
      id: 'experience',
      title: 'Experienced Technicians',
      description: 'Our certified technicians have years of experience solving HVAC challenges.',
      icon: '👨‍🔧'
    },
    {
      id: 'quality',
      title: 'Quality Guarantee',
      description: 'We stand behind our work with industry-leading warranties and guarantees.',
      icon: '✓'
    },
    {
      id: 'responsive',
      title: '24/7 Emergency Service',
      description: 'We\'re always available when you need us most, day or night.',
      icon: '🕒'
    },
    {
      id: 'value',
      title: 'Fair & Transparent Pricing',
      description: 'No hidden fees or surprise costs. We provide upfront pricing every time.',
      icon: '💲'
    }
  ];
  
  // Rendered entirely on the server
  return (
    <Section className="py-16 bg-navy-dark">
      <Container>
        {/* Static content - server rendered */}
        <SectionHeading
          title="Why Choose ProTech HVAC"
          subtitle="We're committed to providing exceptional service and value"
          centered={true}
          className="text-white"
        />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div key={reason.id} className="bg-navy p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-red/20 flex items-center justify-center mb-4 text-2xl">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-ivory/70">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
