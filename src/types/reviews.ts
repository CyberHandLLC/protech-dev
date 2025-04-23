/**
 * Types for reviews and testimonials
 */

/**
 * Customer testimonial data structure
 */
export interface Testimonial {
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
export interface TestimonialsSectionProps {
  /** Location to display location-specific testimonials */
  location: string;
}

/**
 * Review platform information
 */
export interface ReviewPlatform {
  /** Platform name (e.g., Google, Yelp) */
  name: string;
  /** URL to the company's profile on this platform */
  url: string;
  /** Icon representation (letter or emoji) */
  icon: string;
}
