'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
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

/**
 * Component that showcases customer testimonials with a carousel interface
 * Displays location-specific reviews when available
 */
export default function TestimonialsSection({ location }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format location for testimonial lookup - handle URL encoding
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  const locationKey = decodedLocation.toLowerCase().replace(/\s+/g, '-') + '-oh';
  
  // Simulate fetching testimonials from the database
  useEffect(() => {
    const loadTestimonials = () => {
      setIsLoading(true);
      
      // Reset index when location changes
      setActiveIndex(0);
      
      // Simulate API delay
      setTimeout(() => {
        // Get location-specific testimonials or use a default set
        const locationTestimonials = allTestimonials[locationKey] || 
          allTestimonials['akron-oh'] || 
          Object.values(allTestimonials)[0] || 
          [];
          
        setTestimonials(locationTestimonials);
        setIsLoading(false);
      }, 500);
    };
    
    loadTestimonials();
  }, [locationKey]);
  
  const handlePrev = useCallback(() => {
    if (testimonials.length <= 1) return;
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }, [testimonials.length]);
  
  const handleNext = useCallback(() => {
    setActiveIndex(current => 
      current === testimonials.length - 1 ? 0 : current + 1
    );
  }, [testimonials.length]);
  
  // Set up key and touch navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);
  
  // Set up auto-advance (disabled on mobile for better performance)
  useEffect(() => {
    // Only auto-advance if we have multiple testimonials and aren't on mobile
    if (testimonials.length > 1 && window.innerWidth >= 768) {
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }
  }, [handleNext, testimonials.length]);
  
  return (
    <Section className="bg-gradient-to-br from-navy to-dark-blue">
      <Container>
        <SectionHeading 
          title="What Our Customers Say"
          subtitle={`Read reviews from real customers in ${decodedLocation} who have experienced our exceptional service firsthand.`}
          centered={true}
          className="mb-8 sm:mb-12"
        />
        
        {isLoading ? (
          <TestimonialSkeleton />
        ) : (
          <div className="max-w-5xl mx-auto">
            <TestimonialCarousel
              testimonials={testimonials}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        )}
        
        <ReviewPlatforms platforms={reviewPlatforms} />
      </Container>
    </Section>
  );
}

/**
 * Loading skeleton for testimonials
 */
function TestimonialSkeleton() {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto animate-pulse"
      aria-label="Loading testimonials"
      role="status"
    >
      <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-white/20 rounded w-1/3 mb-8"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-3"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-3"></div>
      <div className="h-4 bg-white/20 rounded w-4/5 mb-8"></div>
      <div className="h-10 bg-white/20 rounded w-1/3 mx-auto"></div>
      <span className="sr-only">Loading testimonials...</span>
    </div>
  );
}

/**
 * Empty state when no testimonials are available
 */
function EmptyTestimonialState() {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center max-w-4xl mx-auto"
      role="status"
    >
      <p className="text-white text-lg">
        We're collecting testimonials for this location. Check back soon!
      </p>
    </div>
  );
}

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

function TestimonialCarousel({ 
  testimonials,
  activeIndex,
  setActiveIndex,
  onPrev,
  onNext
}: TestimonialCarouselProps) {
  // For touch/swipe detection
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<number>(0);
  
  // Minimum swipe distance (in px) and timing variables
  const minSwipeDistance = 30;
  const swipeTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Handle touch events
  const handleTouchStart = (e: TouchEvent) => {
    // Prevent default behavior to ensure smooth swiping
    if (testimonials.length > 1) {
      e.preventDefault();
    }
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsSwiping(true);
    setSwipeDirection(0);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping || touchStart === null) return;
    
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    
    // Calculate and set current swipe direction for visual feedback
    const currentDirection = touchStart - currentX;
    setSwipeDirection(currentDirection);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
    setSwipeDirection(0);
    
    // Clear any pending timeouts
    if (swipeTimeout.current) {
      clearTimeout(swipeTimeout.current);
      swipeTimeout.current = null;
    }
  };
  
  if (!testimonials || testimonials.length === 0) {
    return <EmptyTestimonialState />;
  }

  return (
    <div className="relative bg-gradient-to-b from-dark-blue to-navy rounded-xl overflow-hidden max-w-full">
      {/* Main featured testimonial */}
      <div className="md:flex min-h-[400px]">
        {/* Large Featured Testimonial */}
        <div className="md:w-2/3 p-6 md:p-10 relative overflow-hidden">
          <div 
            className="relative min-h-[330px] md:min-h-auto"
            style={{ touchAction: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-300 ${index === activeIndex ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-16 absolute inset-0 pointer-events-none'}`}
                style={{
                  transform: index === activeIndex && swipeDirection !== 0 ? 
                    `translateX(${-swipeDirection * 0.15}px)` : undefined
                }}
                role="tabpanel"
                id={`testimonial-${index}`}
                aria-labelledby={`testimonial-tab-${index}`}
              >
              {/* Red accent line */}
              <div className="h-1 w-24 bg-gradient-to-r from-red to-red-dark mb-8"></div>
              
              {/* Service badge */}
              <div className="inline-block bg-dark-blue-light/50 rounded-full px-3 py-1 text-xs text-ivory/90 mb-6">
                {testimonial.service}
              </div>
              
              {/* Testimonial text */}
              <div className="relative">
                {/* Large quote mark as background */}
                <div className="absolute -left-2 -top-6 text-8xl text-red/10 pointer-events-none select-none" aria-hidden="true">“</div>
                
                <p className="text-ivory text-lg md:text-xl leading-relaxed mb-8 relative z-10">
                  {testimonial.text}
                </p>
              </div>
              
              {/* Divider */}
              <div className="h-px w-12 bg-dark-blue-light mb-6"></div>
              
              {/* Customer info */}
              <div className="flex items-center">
                {/* Avatar in attractive circle with glow */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-light to-dark-blue flex items-center justify-center text-white mr-5 border-2 border-red/10 shadow-lg shadow-red/5">
                  {testimonial.avatar ? (
                    <Image 
                      src={testimonial.avatar} 
                      alt={`${testimonial.name}'s avatar`} 
                      width={56} 
                      height={56} 
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xl font-semibold">{testimonial.name.charAt(0)}</span>
                  )}
                </div>
                
                <div>
                  <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                  <p className="text-ivory/70">{testimonial.location}</p>
                  <div className="mt-1">
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
          
          {/* Navigation for mobile */}
          <div className="md:hidden mt-6 flex items-center justify-center gap-4">
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
}

// Using the shared StarRating component from ui/StarRating.tsx

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

function ReviewPlatforms({ platforms }: ReviewPlatformsProps) {
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
}