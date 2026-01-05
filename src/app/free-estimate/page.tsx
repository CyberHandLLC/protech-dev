import { Metadata } from 'next';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Free Estimate | ProTech HVAC',
  description: 'Get a free estimate for your HVAC project. Call our AI-powered system for instant information and pricing details for heating, cooling, and air quality services.',
  openGraph: {
    title: 'Free Estimate | ProTech HVAC',
    description: 'Get a free estimate for your HVAC project. Call our AI-powered system for instant information and pricing details.',
    siteName: 'ProTech Heating & Cooling | HVAC Services',
  },
};

export default function FreeEstimatePage() {
  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <Section className="bg-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Get Your Free Estimate
          </h1>
          <p className="text-lg md:text-xl text-ivory/90 mb-6">
            Call our AI-powered system for instant pricing information
          </p>
          
          {/* Main CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="text-6xl md:text-7xl mb-4">📞</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Call Now for Your Free Estimate
            </h2>
            <a 
              href="tel:3306424822" 
              className="inline-block text-4xl md:text-5xl font-bold text-red hover:text-red-dark transition-colors mb-4"
            >
              330-642-HVAC
            </a>
            <p className="text-ivory/80 text-lg mb-6">
              (330-642-4822)
            </p>
            <p className="text-ivory/70 max-w-2xl mx-auto">
              Our AI-powered phone system is available 24/7 to provide you with detailed information about our services, pricing, and availability. Get instant answers to your questions.
            </p>
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
            Why Call for Your Estimate?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Instant Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Instant Information</h3>
              <p className="text-dark-blue-light">
                Get immediate answers about pricing, services, and availability through our AI system
              </p>
            </div>

            {/* 24/7 Availability */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">🕐</div>
              <h3 className="text-xl font-semibold text-navy mb-2">24/7 Availability</h3>
              <p className="text-dark-blue-light">
                Call anytime, day or night. Our AI system is always ready to help
              </p>
            </div>

            {/* Detailed Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Detailed Pricing</h3>
              <p className="text-dark-blue-light">
                Get accurate estimates based on your specific needs and location
              </p>
            </div>

            {/* Expert Guidance */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-navy mb-2">Expert Guidance</h3>
              <p className="text-dark-blue-light">
                Our AI system has comprehensive knowledge of all our services and can guide you to the best solution
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-navy/5 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-navy mb-4 text-center">What to Expect When You Call</h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="text-red font-bold text-xl mr-3">1.</span>
                <p className="text-dark-blue-light">
                  <strong>Describe your needs:</strong> Tell our AI system about your HVAC project or service needs
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-red font-bold text-xl mr-3">2.</span>
                <p className="text-dark-blue-light">
                  <strong>Get instant pricing:</strong> Receive detailed pricing information based on your specific situation
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-red font-bold text-xl mr-3">3.</span>
                <p className="text-dark-blue-light">
                  <strong>Schedule service:</strong> Book an appointment or request a technician visit if needed
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-red font-bold text-xl mr-3">4.</span>
                <p className="text-dark-blue-light">
                  <strong>Ask questions:</strong> Get answers to any questions about our services, warranties, or process
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="tel:3306424822" 
              className="inline-flex items-center justify-center px-8 py-4 bg-red text-white rounded-lg font-bold text-xl hover:bg-red-dark transition-colors shadow-lg"
            >
              <span className="mr-3">📞</span> Call 330-642-HVAC (4822)
            </a>
            <p className="text-dark-blue-light mt-4">
              Available 24/7 • AI-Powered System • Instant Estimates
            </p>
          </div>

          {/* Alternative Option */}
          <div className="mt-12 text-center">
            <p className="text-dark-blue-light mb-4">
              Prefer to schedule online?
            </p>
            <Button href="/schedule" variant="outline">
              Schedule Service Online
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
