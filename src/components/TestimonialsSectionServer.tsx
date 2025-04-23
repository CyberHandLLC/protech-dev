/**
 * Server Component version of TestimonialsSection
 * Displays a static testimonial section prerendered on the server
 */
import Image from 'next/image';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Container from './ui/Container';
import StarRating from './ui/StarRating';
import Link from 'next/link';

/**
 * Customer testimonial data structure
 */
interface Testimonial {
  /** Unique identifier */
  id: number;
  /** Customer's name */
  name: string;
  /** Customer's location */
  location: string;
  /** Star rating (1-5) */
  rating: number;
  /** Testimonial content */
  text: string;
  /** Optional avatar image */
  avatar?: string;
  /** Type of service received */
  service: string;
  /** Date of review (ISO format) */
  date: string;
}

/**
 * Props for the testimonials section
 */
interface TestimonialsSectionProps {
  /** Location to display location-specific testimonials */
  location: string;
}

/**
 * Location-based testimonials database
 * In a real app, these would be fetched from an API or database
 */
const allTestimonials: Record<string, Testimonial[]> = {
  'akron-oh': [
    {
      id: 1,
      name: 'John Smith',
      location: 'Akron, OH',
      rating: 5,
      text: 'The technician arrived promptly and fixed our AC in no time. Great service, fair pricing, and professional staff. Highly recommend!',
      service: 'AC Repair',
      date: '2025-03-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      location: 'Akron, OH',
      rating: 5,
      text: 'We had our entire HVAC system replaced by ProTech, and the experience was outstanding from start to finish. The team was knowledgeable, clean, and respectful of our home.',
      service: 'System Replacement',
      date: '2025-02-20'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      location: 'Akron, OH',
      rating: 4,
      text: 'ProTech has been maintaining our heating system for years. They always provide excellent service and helpful advice to keep our system running efficiently.',
      service: 'Seasonal Tune-ups',
      date: '2025-01-12'
    },
  ],
  'cleveland-oh': [
    {
      id: 4,
      name: 'Emily Chen',
      location: 'Cleveland, OH',
      rating: 5,
      text: 'I called ProTech for an emergency repair when my heat went out during a cold snap. They were at my home within two hours and fixed the issue quickly. Exceptional service!',
      service: 'Emergency Service',
      date: '2025-02-05'
    },
    {
      id: 5,
      name: 'David Wilson',
      location: 'Cleveland, OH',
      rating: 5,
      text: 'The team installed new high-efficiency air filters that have drastically improved our indoor air quality. Our allergies are much better, and the service was professional and informative.',
      service: 'Air Quality',
      date: '2025-03-22'
    },
  ],
  'canton-oh': [
    {
      id: 6,
      name: 'Jessica Martinez',
      location: 'Canton, OH',
      rating: 5,
      text: 'ProTech helped us select and install the perfect size HVAC system for our new home. Their knowledge and attention to detail were impressive.',
      service: 'Installation',
      date: '2025-01-30'
    },
    {
      id: 7,
      name: 'Robert Taylor',
      location: 'Canton, OH',
      rating: 4,
      text: 'Reliable maintenance service that keeps our system running smoothly. The technicians are always friendly and take the time to answer all my questions.',
      service: 'Preventative Maintenance',
      date: '2025-03-05'
    },
  ]
};

/**
 * Review platforms for the company
 */
const reviewPlatforms = [
  { name: 'Google', url: 'https://google.com/maps', icon: 'G' },
  { name: 'Yelp', url: 'https://yelp.com', icon: 'Y' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'F' },
  { name: 'BBB', url: 'https://bbb.org', icon: 'B' }
];

/**
 * Server Component that displays testimonials statically
 * Shows the first testimonial from the relevant location
 */
export default function TestimonialsSectionServer({ location }: TestimonialsSectionProps) {
  // Get testimonials for this location (or use default testimonials)
  const testimonials = allTestimonials[location] || 
                      allTestimonials['cleveland-oh'] || 
                      Object.values(allTestimonials)[0];
  
  // If no testimonials available, show empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <Section className="py-16 bg-dark-blue">
        <Container>
          <SectionHeading
            title="Customer Testimonials"
            subtitle="See what our customers are saying about our services"
            color="light"
          />
          <div className="py-12 text-center text-ivory/70">
            No testimonials available for this area yet.
          </div>
        </Container>
      </Section>
    );
  }
  
  // Show featured testimonial (first one)
  const featuredTestimonial = testimonials[0];
  
  return (
    <Section className="py-16 bg-dark-blue">
      <Container>
        <SectionHeading
          title="Customer Testimonials"
          subtitle="See what our customers are saying about our services"
          color="light"
        />
        
        <div className="mt-12 bg-gradient-to-br from-dark-blue-light/30 to-navy/50 rounded-xl overflow-hidden border border-dark-blue-light/30 shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Main testimonial display */}
            <div className="md:w-2/3 p-6 sm:p-10">
              <div className="relative">
                {/* Featured testimonial */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-dark-blue-light flex items-center justify-center text-white mr-4">
                      <span>{featuredTestimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{featuredTestimonial.name}</h3>
                      <p className="text-ivory/60 text-sm">{featuredTestimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <StarRating rating={featuredTestimonial.rating} />
                    <p className="text-ivory/80 mt-1 text-sm">{featuredTestimonial.service} • {formatDate(featuredTestimonial.date)}</p>
                  </div>
                  
                  <blockquote className="text-ivory font-light text-lg italic relative pl-6 before:content-['"'] before:absolute before:left-0 before:top-0 before:text-3xl before:text-red/70">
                    {featuredTestimonial.text}
                  </blockquote>
                </div>
                
                {/* Static navigation buttons showing total count */}
                <div className="flex items-center justify-center mt-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white opacity-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    
                    <span className="text-ivory/70 min-w-[60px] text-center">1 / {testimonials.length}</span>
                    
                    <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white opacity-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Add a note about interactivity */}
                <div className="text-center text-ivory/50 text-sm mt-6">
                  <Link href={`/testimonials?location=${location}`} className="text-red hover:text-red-light">
                    View all {testimonials.length} testimonials →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Testimonial thumbnails sidebar - desktop only */}
            <div className="hidden md:block md:w-1/3 bg-dark-blue/50 border-l border-dark-blue-light/30">
              <div className="p-6 h-full overflow-auto">
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4 font-medium">Customer Stories</h3>
                
                <div className="space-y-3">
                  {testimonials.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg ${idx === 0 ? 'bg-dark-blue' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white mr-3">
                          <span>{item.name.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-medium text-white truncate">{item.name}</h4>
                          <div className="flex items-center text-sm">
                            <StarRating rating={item.rating} />
                            <span className="ml-2 text-ivory/60 text-xs">{item.date.split('-')[0]}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-ivory/70 text-sm mt-2 line-clamp-2">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Review platforms section */}
        <div className="mt-16 text-center">
          <p className="text-ivory/80 mb-6">
            Check out more customer reviews on these platforms:
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {reviewPlatforms.map((platform) => (
              <a 
                key={platform.name} 
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                aria-label={`Read our reviews on ${platform.name}`}
              >
                <div 
                  className="w-12 h-12 bg-red/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  aria-hidden="true"
                >
                  {platform.icon}
                </div>
                <span className="text-ivory/90 text-sm mt-2">{platform.name}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}
