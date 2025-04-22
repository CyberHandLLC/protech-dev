'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Client testimonials component - lightweight with minimal JavaScript
// Only the carousel/slider functionality needs client JS
interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  location: string;
  rating: number;
}

interface ClientTestimonialsProps {
  location: string;
}

export default function ClientTestimonials({ location }: ClientTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Filter testimonials by location if needed
  const testimonials: Testimonial[] = [
    {
      id: '1',
      author: 'John Smith',
      role: 'Homeowner',
      content: 'ProTech HVAC saved us during a heatwave when our AC stopped working. Their technician was professional, quick, and solved our issue in one visit.',
      location: 'Akron',
      rating: 5
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      role: 'Business Owner',
      content: 'We\'ve been using ProTech for our commercial HVAC needs for years. Their maintenance plans are fantastic and their team is always responsive.',
      location: 'Cleveland',
      rating: 5
    },
    {
      id: '3',
      author: 'Michael Rodriguez',
      role: 'Homeowner',
      content: 'After getting quotes from several companies, ProTech offered the best value and most comprehensive service for our new furnace installation.',
      location: 'Canton',
      rating: 4
    }
  ];
  
  // Only run auto rotation on client-side to prevent hydration issues
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);
  
  // Pause auto rotation on hover/focus
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);
  
  // Handle manual navigation
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };
  
  return (
    <section 
      className="py-16 bg-navy-light"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-ivory/80 max-w-2xl mx-auto">
            Read testimonials from satisfied customers in {location}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Current testimonial */}
          <div className="bg-navy-dark p-6 md:p-8 rounded-lg shadow-lg mb-6">
            <div className="flex items-center mb-4">
              {/* Star rating */}
              <div className="flex mr-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-400'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <blockquote className="text-ivory text-lg mb-6">
              "{testimonials[activeIndex].content}"
            </blockquote>
            
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-12 h-12 bg-red rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[activeIndex].author.charAt(0)}
                </div>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {testimonials[activeIndex].author}
                </p>
                <p className="text-ivory/70 text-sm">
                  {testimonials[activeIndex].role}, {testimonials[activeIndex].location}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 
                  ${index === activeIndex ? 'bg-red' : 'bg-navy-light-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
