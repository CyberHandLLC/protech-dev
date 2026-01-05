import { Metadata } from 'next';
import HeroContactForm from '@/components/HeroContactForm';
import Section from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Schedule Service | ProTech HVAC',
  description: 'Schedule your HVAC service appointment online. Fast, convenient scheduling for heating, cooling, and air quality services in Northeast Ohio.',
  openGraph: {
    title: 'Schedule Service | ProTech HVAC',
    description: 'Schedule your HVAC service appointment online. Fast, convenient scheduling for heating, cooling, and air quality services in Northeast Ohio.',
    siteName: 'ProTech Heating & Cooling | HVAC Services',
  },
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <Section className="bg-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Schedule Your Service
          </h1>
          <p className="text-lg md:text-xl text-ivory/90 mb-2">
            Fast, convenient online scheduling for all your HVAC needs
          </p>
          <p className="text-ivory/70">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <HeroContactForm />
        </div>
      </Section>

      {/* Additional Information */}
      <Section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Response */}
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Quick Response</h3>
              <p className="text-dark-blue-light">
                We respond to all service requests within 24 hours
              </p>
            </div>

            {/* Flexible Scheduling */}
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Flexible Scheduling</h3>
              <p className="text-dark-blue-light">
                We work around your schedule with convenient appointment times
              </p>
            </div>

            {/* Expert Service */}
            <div className="text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Expert Service</h3>
              <p className="text-dark-blue-light">
                Certified technicians with years of experience
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 p-6 bg-navy/5 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-navy mb-2">Need Immediate Assistance?</h3>
            <p className="text-dark-blue-light mb-4">
              For emergency service, call us directly
            </p>
            <a 
              href="tel:3306424822" 
              className="inline-flex items-center justify-center px-6 py-3 bg-red text-white rounded-lg font-medium hover:bg-red-dark transition-colors"
            >
              <span className="mr-2">📞</span> Call 330-642-HVAC (4822)
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
