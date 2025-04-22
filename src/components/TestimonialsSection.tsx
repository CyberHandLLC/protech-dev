'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent, memo, useMemo } from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Container from './ui/Container';
import StarRating from './ui/StarRating';

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

// Helper function to convert location to a key for the testimonials object
// This is extracted outside the component to avoid recreating it on each render
function convertToLocationKey(location: string): string {
  if (!location) return '';
  
  try {
    // First, decode any URL-encoded location
    const decodedLocation = decodeURIComponent(location).toLowerCase();
    // Then, replace spaces with hyphens and remove non-alphanumeric characters except hyphens
    return decodedLocation
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '') // Remove non-alphanumeric characters (except hyphens)
      .replace(/\-+/g, '-'); // Replace multiple consecutive hyphens with a single one
  } catch (e) {
    // If there's an error decoding (e.g., location is not URI encoded), use original
    if (process.env.NODE_ENV === 'development') {
      console.error('Error decoding location in TestimonialsSection:', e);
    }
    return location
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-+/g, '-');
  }
}

/**
 * Component that showcases customer testimonials with a carousel interface
 * Displays location-specific reviews when available
 */
function TestimonialsSection({ location }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert location to location key once to avoid redundant calculations
  // This optimization reduces unnecessary processing on every render
  const locationKey = useMemo(() => convertToLocationKey(location), [location]);
  
  // Simulating a data fetch operation - optimized to reduce TBT
  const loadTestimonials = useCallback(async () => {
    // Reduced timeout to improve perceived performance
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Get testimonials for this location or use empty array if none available
    const locationTestimonials = allTestimonials[locationKey] || [];
    
    setTestimonials(locationTestimonials);
    setIsLoading(false);
  }, [locationKey]);
  
  // Effect to load testimonials on mount or when location changes
  useEffect(() => {
    let isMounted = true;
    
    // Reset state when location changes
    setIsLoading(true);
    setActiveIndex(0);
    
    // Load testimonials
    loadTestimonials().then(() => {
      if (!isMounted) return;
    });
    
    return () => {
      isMounted = false;
    };
  }, [location, loadTestimonials]);
  
  // Memoize navigation handlers to prevent recreations on each render
  const handlePrev = useCallback(() => {
    if (testimonials.length <= 1) return;
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }, [testimonials.length]);
  
  const handleNext = useCallback(() => {
    if (testimonials.length <= 1) return;
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  }, [testimonials.length]);
  
  // Handle keyboard navigation for accessibility
  // Optimized to use dependencies properly and avoid unnecessary re-registrations
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [handlePrev, handleNext]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Set up auto-advance (disabled on mobile for better performance)
  useEffect(() => {
    // Only auto-advance if there are multiple testimonials
    if (testimonials.length <= 1) return;
    
    // Don't auto-advance on small screens for better performance and UX
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    
    const intervalId = setInterval(() => {
      handleNext();
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, [handleNext, testimonials.length]);
  
  return (
    <Section className="py-16 md:py-24 bg-gradient-to-b from-navy to-navy-dark text-white relative overflow-hidden">
      {/* Background accent */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-red/10 blur-3xl opacity-30" 
        aria-hidden="true"
      ></div>
      <div 
        className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-red/10 blur-3xl opacity-30" 
        aria-hidden="true"
      ></div>
      
      <Container>
        <SectionHeading
          title="Customer Reviews"
          subtitle={testimonials.length > 0 ? `What our clients in ${location} are saying` : "What our clients are saying"}
          alignment="center"
          textColor="light"
        />
        
        {isLoading ? (
          <TestimonialSkeleton />
        ) : testimonials.length === 0 ? (
          <EmptyTestimonialState />
        ) : (
          <TestimonialCarousel 
            testimonials={testimonials}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
        
        {/* Review platforms - always shown */}
        <ReviewPlatforms platforms={reviewPlatforms} />
      </Container>
    </Section>
  );
}

/**
 * Loading skeleton for testimonials
 */
// Memoized loading skeleton to prevent unnecessary re-renders
const TestimonialSkeleton = memo(function TestimonialSkeleton() {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto animate-pulse"
      aria-busy="true"
      aria-label="Loading testimonials"
    >
      <div className="h-5 bg-white/20 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-white/20 rounded w-3/4 mb-6"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/20 rounded w-3/4"></div>
    </div>
  );
});

/**
 * Empty state when no testimonials are available
 */
// Memoized empty state component
const EmptyTestimonialState = memo(function EmptyTestimonialState() {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center max-w-4xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-white mb-2">No reviews yet!</h3>
      <p className="text-white/70">
        We're working hard to provide exceptional service. Be the first to leave a review!
      </p>
    </div>
  );
});

/**
 * Testimonial carousel component
 */
interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

// Memoized carousel component to prevent unnecessary re-renders
const TestimonialCarousel = memo(function TestimonialCarousel({ 
  testimonials,
  activeIndex,
  setActiveIndex,
  onPrev,
  onNext
}: TestimonialCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Touch event handling - for mobile swipe support
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onNext, onPrev]);
  
  // Using ref to access up-to-date state values in event handlers
  useEffect(() => {
    const currentCarousel = carouselRef.current;
    if (!currentCarousel) return;
    
    // Add passive: true for better performance on mobile
    currentCarousel.addEventListener('touchstart', handleTouchStart as any, { passive: true });
    currentCarousel.addEventListener('touchmove', handleTouchMove as any, { passive: true });
    currentCarousel.addEventListener('touchend', handleTouchEnd as any, { passive: true });
    
    return () => {
      if (!currentCarousel) return;
      currentCarousel.removeEventListener('touchstart', handleTouchStart as any);
      currentCarousel.removeEventListener('touchmove', handleTouchMove as any);
      currentCarousel.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  // Get current active testimonial
  const activeTestimonial = testimonials[activeIndex];
  
  // Early return if no testimonials (though this should be handled by parent)
  if (!activeTestimonial) return null;
  
  return (
    <div
      ref={carouselRef}
      className="relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden mb-12 max-w-6xl mx-auto"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="flex flex-col md:flex-row">
        {/* Testimonial content area */}
        <div className="md:w-2/3 p-6 md:p-8 lg:p-10">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 rounded-full bg-dark-blue-light flex items-center justify-center text-white mr-4">
              <span aria-hidden="true">{activeTestimonial.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{activeTestimonial.name}</h3>
              <p className="text-ivory/70 text-sm">{activeTestimonial.location}</p>
            </div>
          </div>
          
          <div className="mb-2">
            <StarRating rating={activeTestimonial.rating} />
          </div>
          
          <p className="text-white/80 text-sm md:text-base mb-4 italic">
            "{activeTestimonial.text}"
          </p>
          
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-navy-light rounded-full text-white/60">
              {activeTestimonial.service}
            </span>
            <span className="px-3 py-1 bg-navy-light rounded-full text-white/60">
              {activeTestimonial.date}
            </span>
          </div>
          
          {/* Navigation controls for all viewports */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button 
              onClick={onPrev}
              className="w-10 h-10 rounded-full bg-dark-blue-light hover:bg-red/20 flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-red/30 active:bg-red/30"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-ivory/70 min-w-[60px] text-center">{activeIndex + 1} / {testimonials.length}</span>
            
            <button 
              onClick={onNext}
              className="w-10 h-10 rounded-full bg-dark-blue-light hover:bg-red/20 flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-red/30 active:bg-red/30"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
                  onClick={() => setActiveIndex(idx)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${activeIndex === idx ? 'bg-dark-blue' : 'hover:bg-dark-blue/50'}`}
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
  );
});

/**
 * Review platforms component
 */
interface ReviewPlatformsProps {
  platforms: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

// Memoized platforms component to prevent unnecessary re-renders
const ReviewPlatforms = memo(function ReviewPlatforms({ platforms }: ReviewPlatformsProps) {
  return (
    <div className="mt-16 text-center">
      <p className="text-ivory/80 mb-6">
        Check out more customer reviews on these platforms:
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {platforms.map((platform) => (
          <a 
            key={platform.name} 
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform group"
            aria-label={`Read our reviews on ${platform.name}`}
          >
            <div 
              className="w-12 h-12 bg-red/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-red/40 transition-colors"
              aria-hidden="true"
            >
              {platform.icon}
            </div>
            <span className="text-ivory/90 text-sm mt-2">{platform.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
});

// Export the memoized component to prevent unnecessary re-renders
export default memo(TestimonialsSection);
