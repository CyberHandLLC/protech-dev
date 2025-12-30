import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { convertToLocationSlug } from '@/utils/location';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import ServicePageClient from '@/components/services/ServicePageClient';
import { getLocationData } from '@/data/locationData';
import { 
  generateLocationIntro,
  generateLocalizedFaqs,
  generateLocalBusinessSchema,
  generateLocationSpecificDetails,
  generateMetaDescription
} from '@/utils/dynamicContent';
import { serviceCategories } from '@/data/serviceData';

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

// Generation of metadata with improved SEO
export async function generateMetadata({ params, searchParams }: ServicePageProps): Promise<Metadata> {
  const { category, service, location } = params;
  const serviceType = searchParams?.serviceType as string | undefined;
  
  let serviceTitle = '';
  let serviceDescription = '';
  
  // Find the service category
  const serviceCategory = serviceCategories.find(cat => cat.id === category);
  if (!serviceCategory) {
    return { 
      title: 'Service Not Found',
      description: 'The requested service information could not be found.' 
    };
  }
  
  // Find the service (subcategory)
  const serviceInfo = serviceCategory.services.find(svc => svc.id === service);
  if (!serviceInfo) {
    return { 
      title: 'Service Not Found',
      description: 'The requested service information could not be found.' 
    };
  }
  
  // If service type is provided, find the specific service type
  if (serviceType && serviceInfo.subServices) {
    const specificService = serviceInfo.subServices.find(sub => sub.id === serviceType);
    if (specificService) {
      serviceTitle = specificService.name;
      serviceDescription = `${specificService.name} services for your ${category === 'residential' ? 'home' : 'business'}`;
    }
  }
  
  // If no service type or not found, use service info
  if (!serviceTitle) {
    serviceTitle = serviceInfo.name;
    serviceDescription = serviceInfo.description || `Professional ${serviceInfo.name.toLowerCase()} services tailored to your needs`;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate optimized meta description
  const metaDescription = generateMetaDescription(location, service, serviceType, serviceTitle);
  
  return {
    title: `${serviceTitle} in ${locationDisplay} | ProTech HVAC`,
    description: metaDescription,
    // Additional metadata for rich search results
    keywords: [serviceTitle, 'HVAC', 'heating', 'cooling', location, category],
    openGraph: {
      title: `${serviceTitle} in ${locationDisplay} | Professional HVAC Services`,
      description: metaDescription,
      type: 'website',
      locale: 'en_US',
    }
  };
}

/**
 * Service Detail Page Component
 * Enhanced to handle both service and service type URLs through query parameters
 */
export default function ServicePage({ params, searchParams }: ServicePageProps) {
  const { category, service, location } = params;
  const serviceType = searchParams?.serviceType as string | undefined;
  
  // Get the server-side user location (from middleware)
  const userLocation = getUserLocationFromHeaders();
  
  // Find the service category
  const serviceCategory = serviceCategories.find(cat => cat.id === category);
  if (!serviceCategory) {
    notFound();
  }
  
  // Find the service (subcategory)
  const serviceInfo = serviceCategory.services.find(svc => svc.id === service);
  if (!serviceInfo) {
    notFound();
  }
  
  // If service type is provided, find the specific service type
  let finalServiceInfo = { ...serviceInfo };
  if (serviceType && serviceInfo.subServices) {
    const specificService = serviceInfo.subServices.find(sub => sub.id === serviceType);
    if (specificService) {
      finalServiceInfo = {
        ...finalServiceInfo,
        title: specificService.name,
        id: specificService.id,
        icon: specificService.icon,
        description: `${specificService.name} services for your ${category === 'residential' ? 'home' : 'business'}`
      };
    }
  }
  
  // Extract location from URL parameter
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
  
  // Get location data
  const locationData = getLocationData(location);
  
  // Create service details based on what we've determined above
  const serviceId = serviceType || service;
  
  // Create a dynamically enhanced version of the service info
  const enhancedServiceInfo = {
    ...finalServiceInfo,
    // Add a location-specific introduction paragraph
    locationIntro: generateLocationIntro(location, serviceId, finalServiceInfo.title),
    // Create location-specific details
    details: [
      `Professional ${finalServiceInfo.title.toLowerCase()} in ${locationDisplay}`,
      `Experienced technicians with extensive ${finalServiceInfo.title.toLowerCase()} expertise`,
      `Fast, reliable service throughout ${locationDisplay} and surrounding areas`,
      `Competitive pricing with upfront quotes`,
      `Satisfaction guaranteed`
    ],
    // Create location-specific FAQs by combining standard FAQs with location-specific ones
    faqs: [
      {
        question: `How quickly can you provide ${finalServiceInfo.title.toLowerCase()} service in ${locationDisplay}?`,
        answer: `We typically offer same-day or next-day service for ${finalServiceInfo.title.toLowerCase()} requests in ${locationDisplay} and surrounding areas. Emergency services are available 24/7.`
      },
      {
        question: `Do you offer warranties on ${finalServiceInfo.title.toLowerCase()}?`,
        answer: `Yes, all our ${finalServiceInfo.title.toLowerCase()} services come with a satisfaction guarantee and warranty protection. The specific terms depend on the service provided.`
      }
    ],
    // Add structured data for SEO
    structuredData: generateLocalBusinessSchema(
      serviceId, 
      finalServiceInfo.title, 
      locationData.name, 
      locationData.coordinates, 
      `https://protech-ohio.com/services/${category}/${service}/${location}${serviceType ? `?serviceType=${serviceType}` : ''}`
    )
  };
  
  // Render the client component with the server-provided data
  return (
    <>
      {/* Add schema.org structured data for SEO */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: enhancedServiceInfo.structuredData }}
      />
      
      <ServicePageClient 
        serviceInfo={enhancedServiceInfo} 
        category={category} 
        service={service}
        serviceType={serviceType}
        locationParam={location}
        serverLocation={serverLocation} 
      />
    </>
  );
}