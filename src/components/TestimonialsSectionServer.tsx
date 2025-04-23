/** 
 * Server Component version of TestimonialsSection
 * Renders the testimonials section statically to reduce TBT
 */

// Import basic components to ensure proper rendering
import Image from 'next/image';
import Link from 'next/link';

// Import UI components needed for rendering
import Section from './ui/Section';
import Container from './ui/Container';
import SectionHeading from './ui/SectionHeading';
import StarRating from './ui/StarRating';

// Define testimonial data structure
type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  avatar?: string;
};

// Props for the component
type TestimonialsSectionProps = {
  location: string;
};

// Sample testimonials data for different locations
const testimonials: Record<string, Testimonial[]> = {
  'akron-oh': [
    {
      id: 1,
      name: 'John Smith',
      location: 'Akron, OH',
      rating: 5,
      text: 'The technician arrived promptly and fixed our AC in no time. Great service!',
      service: 'AC Repair',
      date: '2025-03-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      location: 'Akron, OH',
      rating: 5,
      text: 'We had our entire HVAC system replaced by ProTech, and the experience was outstanding.',
      service: 'System Replacement',
      date: '2025-02-20'
    }
  ],
  'cleveland-oh': [
    {
      id: 3,
      name: 'Emily Chen',
      location: 'Cleveland, OH',
      rating: 5,
      text: 'I called ProTech for an emergency repair when my heat went out during a cold snap.',
      service: 'Emergency Service',
      date: '2025-02-05'
    }
  ]
};

// Format date helper function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}

// Main component
export default function TestimonialsSectionServer({ location }: TestimonialsSectionProps) {
  // Get location-specific testimonials
  const locationKey = String(location || 'cleveland-oh');
  const locationTestimonials = testimonials[locationKey] || testimonials['cleveland-oh'] || [];
  
  // If no testimonials, show placeholder
  if (locationTestimonials.length === 0) {
    return (
      <div className="py-16 bg-dark-blue">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Customer Testimonials</h2>
            <p className="text-ivory/80 max-w-3xl mx-auto">See what our customers are saying about our services</p>
          </div>
          <div className="py-12 text-center text-ivory/70">
            No testimonials available for this area yet.
          </div>
        </div>
      </div>
    );
  }
  
  // Display featured testimonial
  const featuredTestimonial = locationTestimonials[0];
  
  return (
    <div className="py-16 bg-dark-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Customer Testimonials</h2>
          <p className="text-ivory/80 max-w-3xl mx-auto">See what our customers are saying about our services</p>
        </div>
        
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
                  
                  <blockquote className="text-ivory font-light text-lg italic relative pl-6">
                    {featuredTestimonial.text}
                  </blockquote>
                </div>
                
                {/* Static navigation */}
                <div className="flex items-center justify-center mt-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white opacity-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    
                    <span className="text-ivory/70 min-w-[60px] text-center">1 / {locationTestimonials.length}</span>
                    
                    <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white opacity-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Link to more testimonials */}
                <div className="text-center text-ivory/50 text-sm mt-6">
                  <Link href={`/testimonials?location=${locationKey}`} className="text-red hover:text-red-light">
                    View all {locationTestimonials.length} testimonials →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Testimonial sidebar - desktop only */}
            <div className="hidden md:block md:w-1/3 bg-dark-blue/50 border-l border-dark-blue-light/30">
              <div className="p-6 h-full overflow-auto">
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4 font-medium">Customer Stories</h3>
                
                <div className="space-y-3">
                  {locationTestimonials.map((item, idx) => (
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
                      <p className="text-ivory/70 text-sm mt-2">{item.text.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}