import Link from 'next/link';

interface CTACalloutProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function CTACallout({ title, subtitle, ctaText, ctaLink }: CTACalloutProps) {
  return (
    <section className="bg-navy py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-red mb-3 mx-auto"></div>
            <span className="text-red-light uppercase text-sm tracking-wider font-medium">
              ProTech HVAC Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-ivory/80 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <Link
            href={ctaLink}
            className="inline-block bg-red hover:bg-red-dark text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}