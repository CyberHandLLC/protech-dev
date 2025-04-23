'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';

// Gallery images
const galleryImages = [
  {
    src: '/images/gallary/470206469_122180231108171081_5605909263614525403_n.jpg',
    alt: 'HVAC installation by ProTech team',
    caption: 'Professional installation services'
  },
  {
    src: '/images/gallary/470581320_122181166838171081_843631698186197585_n.jpg',
    alt: 'Air conditioning unit installation',
    caption: 'Cooling system setup'
  },
  {
    src: '/images/gallary/471159238_122181167066171081_6181477744577409864_n.jpg',
    alt: 'HVAC maintenance work',
    caption: 'Regular maintenance service'
  },
  {
    src: '/images/gallary/474879251_122187356834171081_618857565482603761_n.jpg',
    alt: 'Heating system repair',
    caption: 'Expert heating solutions'
  },
  {
    src: '/images/gallary/475981915_122188599194171081_1825584246602341072_n.jpg',
    alt: 'Commercial HVAC project',
    caption: 'Commercial grade installations'
  },
  {
    src: '/images/gallary/a-photorealistic-image-depicting-a-technician-in-a-we.jpg',
    alt: 'HVAC technician working',
    caption: 'Our certified technicians'
  }
];

function ImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Only enable transitions after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <section className="py-16 bg-navy" aria-label="Our Work Gallery">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
          Our <span className="text-ivory">Quality Work</span>
        </h2>
        <p className="text-white/90 text-center mb-12 max-w-2xl mx-auto">
          Take a look at some of our recent heating and cooling installation and service projects.
          Our experienced technicians deliver high-quality solutions for residential and commercial properties.
        </p>
        
        <div className="relative h-64 sm:h-96 md:h-[32rem] mx-auto rounded-lg overflow-hidden shadow-xl mb-8">
          {/* Main gallery image */}
          {galleryImages.map((image, index) => (
            <div 
              key={image.src} 
              className={`absolute inset-0 transition-opacity duration-1000 ${isClient ? (activeIndex === index ? 'opacity-100' : 'opacity-0') : (index === 0 ? 'opacity-100' : 'opacity-0')}`}
            >
              <Image 
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-navy/30"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-navy/70 p-4">
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Thumbnail navigation */}
        <div className="flex justify-center gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${activeIndex === index ? 'bg-red' : 'bg-gray-400'}`}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ImageGallery);
