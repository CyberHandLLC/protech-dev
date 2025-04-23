'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Container from './ui/Container';
import StarRating from './ui/StarRating';

/**
 * Review data structure from API
 */
interface ReviewData {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  service: string;
  date: string;
  source: string;
}

interface ReviewsApiResponse {
  reviews: ReviewData[];
  businessName: string;
  averageRating: number;
  totalReviews: number;
  error?: string;
}

/**
 * Props for the testimonials section
 */
interface TestimonialsSectionApiProps {
  /** Location to filter testimonials - optional since API now handles this */
  location?: string;
}

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
 * Component that showcases real customer testimonials from Google Places API with a carousel interface
 */
export default function TestimonialsSectionApi({ location }: TestimonialsSectionApiProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<ReviewData[]>([]);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'ProTech HVAC',
    averageRating: 0,
    totalReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/reviews');
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data: ReviewsApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Update state with reviews and business info
        setTestimonials(data.reviews);
        setBusinessInfo({
          name: data.businessName,
          averageRating: data.averageRating,
          totalReviews: data.totalReviews
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Unable to load reviews. Please try again later.');
        setIsLoading(false);
      }
    }
    
    fetchReviews();
  }, []);

  // Navigation functions for the carousel
  const goToNext = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Keyboard event handler for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <Section className="bg-navy py-16">
      <Container>
        <SectionHeading
          title="Customer Testimonials"
          subtitle={`See what our customers are saying about our HVAC services. We have a ${businessInfo.averageRating.toFixed(1)}/5 rating from ${businessInfo.totalReviews} reviews.`}
          centered
        />
        
        <div className="mt-10 relative">
          {isLoading ? (
            // Loading skeleton
            <TestimonialSkeleton />
          ) : error ? (
            // Error state
            <div className="bg-navy shadow-xl rounded-xl overflow-hidden border border-red/20 p-8 text-center">
              <p className="text-red mb-2">⚠️</p>
              <p className="text-white text-lg mb-4">Oops! Something went wrong</p>
              <p className="text-ivory/70">{error}</p>
            </div>
          ) : testimonials.length === 0 ? (
            // Empty state
            <EmptyTestimonialState />
          ) : (
            // Testimonial carousel
            <TestimonialCarousel
              testimonials={testimonials}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onPrev={goToPrev}
              onNext={goToNext}
            />
          )}
        </div>
        
        {/* Review Platforms */}
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
    <div className="bg-navy shadow-lg rounded-xl overflow-hidden border border-dark-blue-light/30 flex flex-col md:flex-row animate-pulse">
      <div className="md:w-2/3 p-6 sm:p-10">
        <div className="h-6 bg-dark-blue-light/50 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-dark-blue-light/50 rounded w-1/4 mb-8"></div>
        <div className="h-4 bg-dark-blue-light/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-dark-blue-light/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-dark-blue-light/50 rounded w-2/3 mb-8"></div>
        <div className="h-8 bg-dark-blue-light/50 rounded w-1/4"></div>
      </div>
      <div className="hidden md:block md:w-1/3 bg-dark-blue/50 border-l border-dark-blue-light/30">
        <div className="p-6">
          <div className="h-4 bg-dark-blue-light/50 rounded w-1/2 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 p-4 bg-dark-blue-light/20 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-dark-blue-light/50 rounded-full mr-3"></div>
                <div className="w-3/4">
                  <div className="h-4 bg-dark-blue-light/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark-blue-light/50 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-dark-blue-light/50 rounded w-full mb-1"></div>
              <div className="h-3 bg-dark-blue-light/50 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state when no testimonials are available
 */
function EmptyTestimonialState() {
  return (
    <div className="bg-navy shadow-lg rounded-xl overflow-hidden border border-dark-blue-light/30 p-8 text-center">
      <div className="text-ivory/50 text-5xl mb-4">🔍</div>
      <h3 className="text-white text-xl font-medium mb-2">No Reviews Yet</h3>
      <p className="text-ivory/70">We're working hard to collect customer reviews for this location. Check back soon!</p>
    </div>
  );
}

/**
 * Testimonial carousel component
 */
interface TestimonialCarouselProps {
  testimonials: ReviewData[];
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
  // Refs for touch events
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;
  
  /**
   * Handle touch events
   */
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Get the current testimonial
  const currentTestimonial = testimonials[activeIndex];
  
  // Format date
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div
      className="bg-navy shadow-lg rounded-xl overflow-hidden border border-dark-blue-light/30 flex flex-col md:flex-row"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      {/* Main testimonial display */}
      <div className="md:w-2/3 p-6 sm:p-10 flex flex-col h-full">
        <div className="mb-8 flex items-center">
          {/* Avatar or initials */}
          <div className="mr-4 relative">
            {currentTestimonial.avatar ? (
              <Image 
                src={currentTestimonial.avatar} 
                alt={`${currentTestimonial.name}'s avatar`} 
                width={48} 
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-dark-blue-light flex items-center justify-center text-white text-lg">
                {currentTestimonial.name.charAt(0)}
              </div>
            )}
            
            {/* Source indicator badge */}
            <div className="absolute -bottom-1 -right-1 bg-red text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {currentTestimonial.source === 'google' ? 'G' : 'R'}
            </div>
          </div>
          
          {/* Customer info */}
          <div>
            <h3 className="font-semibold text-white text-lg">{currentTestimonial.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-ivory/60">
              <span>{currentTestimonial.location}</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span>{formatDate(currentTestimonial.date)}</span>
            </div>
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="mb-4">
          <StarRating rating={currentTestimonial.rating} />
        </div>
        
        {/* Review text */}
        <div className="mb-8 flex-grow">
          <p className="text-ivory/80 text-lg leading-relaxed">
            "{currentTestimonial.text}"
          </p>
        </div>
        
        {/* Service type */}
        <div className="mb-6 mt-auto">
          <span className="inline-block bg-dark-blue-light px-4 py-1 rounded-full text-ivory/90 text-sm">
            {currentTestimonial.service}
          </span>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between items-center pt-4 border-t border-dark-blue-light/30">
          <div className="text-ivory/70 text-sm">
            Review {activeIndex + 1} of {testimonials.length}
          </div>
          
          <div className="flex items-center gap-2">
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
                  {item.avatar ? (
                    <Image 
                      src={item.avatar} 
                      alt={`${item.name}'s avatar`} 
                      width={40} 
                      height={40}
                      className="rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-dark-blue-light flex items-center justify-center text-white mr-3">
                      <span>{item.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="font-medium text-white truncate">{item.name}</h4>
                    <div className="flex items-center text-sm">
                      <StarRating rating={item.rating} />
                      <span className="ml-2 text-ivory/60 text-xs">
                        {item.date.split('-')[0]}
                      </span>
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
  );
}

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
