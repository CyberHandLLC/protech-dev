import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { convertToLocationSlug } from '@/utils/location';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import ServicePageClient from '@/components/services/ServicePageClient';

// Define types for param objects
type ServiceParams = {
  category: string;
  service: string;
  location: string;
};

// Define props expected by the component
type ServicePageProps = {
  params: ServiceParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Service data - in a real app, this would come from a database or API
const serviceData = {
  'residential': {
    'ac-repair': {
      title: 'AC Repair Services',
      description: 'Expert air conditioner repair for all makes and models',
      icon: '❄️',
      details: [
        'Fast, reliable repairs for all AC brands',
        'Emergency service available 24/7',
        'Upfront pricing with no hidden fees',
        'Certified technicians with years of experience',
        'Comprehensive diagnosis and honest recommendations',
      ],
      faqs: [
        {
          question: 'How quickly can you respond to an AC emergency?',
          answer: 'We offer same-day service for most AC emergencies, and our technicians are available 24/7 for urgent repairs.'
        },
        {
          question: 'What are common signs that my AC needs repair?',
          answer: 'Common signs include unusual noises, warm air blowing, poor airflow, frequent cycling, high humidity, water leaks, or strange odors.'
        },
        {
          question: 'Do you provide warranty on AC repairs?',
          answer: 'Yes, all of our repairs come with a satisfaction guarantee and parts warranty to ensure your peace of mind.'
        }
      ]
    },
    'heating-services': {
      title: 'Heating Services',
      description: 'Comprehensive heating repair and maintenance',
      icon: '🔥',
      details: [
        'Furnace repair and maintenance',
        'Heat pump services',
        'Boiler repair and installation',
        'Radiant heating solutions',
        'Emergency heating repairs'
      ],
      faqs: [
        {
          question: 'How often should I service my heating system?',
          answer: 'We recommend annual maintenance before the heating season begins to ensure optimal performance and safety.'
        },
        {
          question: 'What are signs my furnace needs repair?',
          answer: 'Watch for unusual noises, inconsistent heating, higher than normal energy bills, frequent cycling, or a yellow pilot light instead of blue.'
        }
      ]
    }
  }
};

/**
 * Generate metadata for the page based on URL parameters
 */
export async function generateMetadata(
  { params }: { params: ServiceParams }
): Promise<Metadata> {
  const { category, service, location } = params;
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if service doesn't exist
  if (!serviceInfo) {
    return {
      title: 'Service Not Found',
    };
  }

  // Get the user's location from server headers
  const userLocation = getUserLocationFromHeaders();
  
  // Format location for display
  // First decode any URL-encoded characters that might be in the location parameter
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  // Use user's detected location if available and param location is generic
  const finalLocation = location === 'northeast-ohio' ? userLocation.name : locationDisplay;

  return {
    title: `${serviceInfo.title} in ${finalLocation} | ProTech HVAC`,
    description: `${serviceInfo.description} in ${finalLocation}. Professional, reliable service from certified HVAC technicians.`,
    keywords: [service.replace('-', ' '), category, 'HVAC', finalLocation, 'heating and cooling'],
  };
}



/**
 * Service details page component
 * This server component fetches the initial location and passes it to the client component
 */
export default function ServicePage({ params }: ServicePageProps) {
  const { category, service, location } = params;
  
  // Get service info from data
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if the service doesn't exist
  if (!serviceInfo) {
    return notFound();
  }
  
  // Get the user's location from server headers
  const userLocation = getUserLocationFromHeaders();
  
  // Format location for display from URL parameter
  // First decode any URL-encoded characters that might be in the location
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  // Use user's detected location if available and param location is generic
  const serverLocation = location === 'northeast-ohio' ? userLocation.name : locationDisplay;
  
  // Render the client component with the server-provided data
  return (
    <ServicePageClient 
      serviceInfo={serviceInfo} 
      category={category} 
      service={service} 
      locationParam={location}
      serverLocation={serverLocation} 
    />
  );
}