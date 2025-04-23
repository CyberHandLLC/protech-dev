'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Container from './ui/Container';
import StarRating from './ui/StarRating';

/**
 * Real review data structure
 */
interface Review {
  /** Unique identifier */
  id: number;
  /** Customer's name */
  name: string;
  /** Customer's location */
  location: string;
  /** Star rating (1-5) */
  rating: number;
  /** Review content */
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
interface TestimonialsSectionApiProps {
  /** Location to display in the section title */
  location: string;
}

/**
 * Review platforms for the company
 */
const reviewPlatforms = [
  { name: 'Google', url: 'https://search.google.com/local/reviews?placeid=ChIJXwWa3Gg3N4gR18IWw-UDM_M', icon: 'G' },
  { name: 'Yelp', url: 'https://yelp.com', icon: 'Y' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'F' },
  { name: 'BBB', url: 'https://bbb.org', icon: 'B' }
];

/**
 * Fallback testimonials in case API fails
 */
const fallbackTestimonials: Review[] = [
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
    location: 'Cleveland, OH',
    rating: 4,
    text: 'ProTech has been maintaining our heating system for years. They always provide excellent service and helpful advice to keep our system running efficiently.',
    service: 'Seasonal Tune-ups',
    date: '2025-01-12'
  }
];

/**
 * Component that showcases customer testimonials with real reviews from Google
 * Maintains the same design as the static testimonials component
 */
export default function TestimonialsSectionApi({ location }: TestimonialsSectionApiProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placeRating, setPlaceRating] = useState(0);
  
  // Touch handling
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  
  // Fetch reviews from our API endpoint
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.success) {
          setReviews(data.reviews);
          setPlaceRating(data.placeRating);
        } else {
          console.error('Failed to fetch reviews:', data.error);
          setReviews(fallbackTestimonials);
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews(fallbackTestimonials);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReviews();
  }, []);

  // Navigation functions
  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  }, [reviews.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  }, [reviews.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  }, [goToPrev, goToNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset active index when reviews change
  useEffect(() => {
    setActiveIndex(0);
  }, [reviews]);

  // When loading, show skeletons
  if (loading) {
    return (
      <Section className="bg-navy py-16">
        <Container>
          <SectionHeading 
            title="What Our Customers Say"
            subtitle={`Hear directly from our satisfied customers in ${location}`}
            centered
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(null).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  // When there are no reviews, show empty state
  if (reviews.length === 0 && !loading) {
    return <EmptyTestimonialState />;
  }

  // Main content: show testimonial carousel
  return (
    <Section className="bg-navy py-16">
      <Container>
        <SectionHeading 
          title="What Our Customers Say"
          subtitle={`Hear directly from our satisfied customers in ${location}`}
          centered
        />
        
        <TestimonialCarousel 
          testimonials={reviews}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onPrev={goToPrev}
          onNext={goToNext}
        />
        
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
    <div className="bg-dark-blue rounded-xl border border-dark-blue-light/30 animate-pulse">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-dark-blue-light"></div>
          <div className="flex-1">
            <div className="h-4 bg-dark-blue-light rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-dark-blue-light rounded w-1/3"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-dark-blue-light rounded"></div>
          <div className="h-3 bg-dark-blue-light rounded"></div>
          <div className="h-3 bg-dark-blue-light rounded w-4/5"></div>
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
    <Section className="bg-navy py-16">
      <Container>
        <SectionHeading 
          title="What Our Customers Say"
          subtitle="We're working on collecting more reviews from our satisfied customers"
          centered
        />
        <div className="bg-dark-blue rounded-xl border border-dark-blue-light/30 p-8 text-center max-w-2xl mx-auto mt-8">
          <p className="text-ivory/70">No reviews available at this time. Check back soon!</p>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Testimonial carousel component
 */
interface TestimonialCarouselProps {
  testimonials: Review[];
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Handle touch events
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    
    // Optional: add a visual feedback for the swipe
    if (carouselRef.current) {
      const swipeDelta = touchEndX.current - touchStartX.current;
      const maxSwipe = 100; // Max pixels to swipe
      const transformPercentage = Math.min(Math.abs(swipeDelta) / maxSwipe, 1) * Math.sign(swipeDelta) * 5;
      
      carouselRef.current.style.transform = `translateX(${transformPercentage}%)`;
    }
  };
  
  const handleTouchEnd = () => {
    if (carouselRef.current) {
      // Reset the transform
      carouselRef.current.style.transform = '';
      
      // Detect swipe direction
      const swipeDelta = touchEndX.current - touchStartX.current;
      const minSwipeDistance = 50; // Minimum distance to consider it a swipe
      
      if (Math.abs(swipeDelta) > minSwipeDistance) {
        if (swipeDelta > 0) {
          // Swipe right -> show previous
          onPrev();
        } else {
          // Swipe left -> show next
          onNext();
        }
      }
    }
  };
  
  const testimonial = testimonials[activeIndex];
  const serviceName = testimonial.service;
  const formattedDate = testimonial.date;
  
  return (
    <div className="bg-dark-blue rounded-xl overflow-hidden border border-dark-blue-light/30 mt-8 mb-12">
      <div className="md:flex">
        {/* Main content area - takes 2/3 width on desktop */}
        <div 
          className="md:w-2/3 p-6 md:p-10"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Tag for service type */}
          <div className="inline-block bg-navy-light px-3 py-1 rounded-full text-xs text-ivory/80 mb-6">
            {serviceName}
          </div>
          
          {/* Testimonial text */}
          <div className="mb-8">
            <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-6">
              "{testimonial.text}"
            </blockquote>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                {testimonial.avatar ? (
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-dark-blue-light text-white flex items-center justify-center text-lg font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-ivory/70 text-sm">{testimonial.location}</p>
                <div className="flex items-center mt-1">
                  <StarRating rating={testimonial.rating} />
                  <span className="ml-2 text-ivory/60 text-xs">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls - centered for all screen sizes */}
          <div className="flex items-center justify-center gap-2">
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
