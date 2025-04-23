'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Container from './ui/Container';
import StarRating from './ui/StarRating';
import { Testimonial, ReviewPlatform } from '@/types/reviews';
import { fetchReviewsByLocation, fetchTopReviews } from '@/services/reviewsApi';
import { convertToLocationSlug } from '@/utils/location';

/**
 * Review platforms for the company
 */
const reviewPlatforms: ReviewPlatform[] = [
  { name: 'Google', url: 'https://google.com/maps', icon: 'G' },
  { name: 'Yelp', url: 'https://yelp.com', icon: 'Y' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'F' },
  { name: 'BBB', url: 'https://bbb.org', icon: 'B' }
];

// Define fallback reviews in case API fails
const fallbackTestimonials: Testimonial[] = [
  {
    id: 999,
    name: 'Satisfied Customer',
    location: 'Local Area',
    rating: 5,
    text: 'ProTech HVAC provides excellent service and quality work. We highly recommend their team for all your heating and cooling needs.',
    service: 'HVAC Service',
    date: new Date().toISOString().split('T')[0]
  }
];

/**
 * Component that showcases customer testimonials with a carousel interface
 * Fetches real reviews from API based on location
 */
export default function TestimonialsSectionApi({ location }: { location: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch testimonials based on location
  useEffect(() => {
    async function loadReviews() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert the location to a slug format for API
        const locationSlug = convertToLocationSlug(location);
        
        // Try to get location-specific reviews
        let reviews = await fetchReviewsByLocation(locationSlug);
        
        // If no location-specific reviews, get top reviews instead
        if (!reviews || reviews.length === 0) {
          reviews = await fetchTopReviews(5);
        }
        
        // If we still have no reviews, use fallback
        if (!reviews || reviews.length === 0) {
          reviews = fallbackTestimonials;
        }
        
        setTestimonials(reviews);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Unable to load reviews. Please try again later.');
        setTestimonials(fallbackTestimonials);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadReviews();
  }, [location]);
  
  // Navigation functions
  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);
  
  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);
  
  return (
    <Section className="bg-navy border-t border-dark-blue/50">
      <Container className="py-16">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Read reviews from real customers in your area"
          centered
        />
        
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <TestimonialSkeleton />
          ) : testimonials.length > 0 ? (
            <TestimonialCarousel
              testimonials={testimonials}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          ) : (
            <EmptyTestimonialState />
          )}
        </div>
        
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
    <div className="bg-dark-blue border border-dark-blue-light/30 rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="md:flex">
        <div className="p-8 md:p-10 md:w-2/3 space-y-6">
          <div className="w-32 h-6 bg-dark-blue-light/50 rounded"></div>
          <div className="w-3/4 h-4 bg-dark-blue-light/50 rounded"></div>
          <div className="w-full h-32 bg-dark-blue-light/50 rounded"></div>
          <div className="w-1/2 h-4 bg-dark-blue-light/50 rounded"></div>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-dark-blue-light/50 rounded-full"></div>
            <div className="w-32 h-10 bg-dark-blue-light/50 rounded"></div>
          </div>
        </div>
        <div className="hidden md:block md:w-1/3 bg-dark-blue/50 h-80"></div>
      </div>
    </div>
  );
}

/**
 * Empty state when no testimonials are available
 */
function EmptyTestimonialState() {
  return (
    <div className="bg-dark-blue border border-dark-blue-light/30 rounded-xl overflow-hidden shadow-lg p-8 text-center">
      <div className="text-6xl mb-4">✨</div>
      <h3 className="text-xl text-white font-medium mb-2">Be Our First Reviewer!</h3>
      <p className="text-ivory/70 mb-6">We'd love to hear about your experience with our services.</p>
      <a href="#contact" className="inline-block bg-red hover:bg-red-dark text-white px-6 py-3 rounded-lg transition-colors">
        Leave a Review
      </a>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Handle touch events
  const handleTouchStart = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    // Save the initial touch position
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    
    // Add non-passive touch listeners for better performance
    containerRef.current.style.transition = 'none';
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;
    
    // Track the current touch position
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out';
    }
    
    // Calculate swipe distance
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    // Handle swipe based on direction
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
    
    // Reset touch tracking
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  if (testimonials.length === 0) {
    return <EmptyTestimonialState />;
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Get current testimonial
  const currentTestimonial = testimonials[activeIndex];
  
  return (
    <div 
      className="bg-dark-blue border border-dark-blue-light/30 rounded-xl overflow-hidden shadow-lg"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="md:flex">
        <div className="p-8 md:p-10 md:w-2/3">
          {/* Dynamic content for current testimonial */}
          <div className="mb-6">
            <div className="flex mb-4">
              <StarRating rating={currentTestimonial.rating} />
              <span className="ml-2 text-ivory/60">
                {formatDate(currentTestimonial.date)}
              </span>
            </div>
            
            <blockquote className="text-ivory/90 italic relative">
              <span className="text-red text-4xl absolute -top-4 -left-2" aria-hidden="true">"</span>
              <p className="ml-5 relative z-10">
                {currentTestimonial.text}
              </p>
              <span className="text-red text-4xl absolute -bottom-10 right-0" aria-hidden="true">"</span>
            </blockquote>
          </div>
          
          <div className="mt-12 flex items-center justify-between">
            <div className="flex items-center">
              {currentTestimonial.avatar ? (
                <Image 
                  src={currentTestimonial.avatar} 
                  alt={`${currentTestimonial.name}'s profile picture`}
                  width={48} 
                  height={48} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-dark-blue-light flex items-center justify-center text-white mr-4">
                  <span>{currentTestimonial.name.charAt(0)}</span>
                </div>
              )}
              
              <div>
                <p className="font-bold text-white">{currentTestimonial.name}</p>
                <p className="text-ivory/60 text-sm flex items-center">
                  <span className="mr-2" aria-hidden="true">📍</span>
                  <span>{currentTestimonial.location}</span>
                </p>
                <p className="text-ivory/60 text-sm mt-1">
                  <span className="text-red font-medium">{currentTestimonial.service}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
                        alt={`${item.name}'s profile picture`}
                        width={40} 
                        height={40} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
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
                        <span className="ml-2 text-ivory/60 text-xs">{formatDate(item.date).split(',')[0]}</span>
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

/**
 * Review platforms component
 */
function ReviewPlatforms({ platforms }: { platforms: ReviewPlatform[] }) {
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
