import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { serviceCategories } from '@/data/serviceDataNew';
import ServicePageContentNew from '@/components/services/ServicePageContentNew';
import { getWeatherData } from '@/utils/weatherApi';
import { getLocationById } from '@/utils/locationUtils';
import { getServiceRecommendation } from '@/utils/recommendations';
import { generateServiceMetadata } from '@/utils/metadata';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import { generateCanonicalUrl } from '@/utils/canonical';

// Import the client wrapper component
import ServiceDetailClientWrapper from '../../../../../../../components/services/ServiceDetailClientWrapper';

// Define the type for the page params
interface ServiceDetailPageProps {
  params: {
    category: string;
    system: string;
    serviceType: string;
    item: string;
    location: string;
  };
}

// Generate dynamic metadata based on the service details
export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { category, system, serviceType, item, location } = params;
  
  // Find the specific service info from our data
  const categoryData = serviceCategories.find(cat => cat.id === category);
  if (!categoryData) return { title: 'Service Not Found' };
  
  const systemData = categoryData.systems.find(sys => sys.id === system);
  if (!systemData) return { title: 'Service Not Found' };
  
  const serviceTypeData = systemData.serviceTypes.find(type => type.id === serviceType);
  if (!serviceTypeData) return { title: 'Service Not Found' };
  
  const itemData = serviceTypeData.items.find(i => i.id === item);
  if (!itemData) return { title: 'Service Not Found' };
  
  // Format location name from slug
  const locationName = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
    
  // Generate canonical URL for this service
  const canonicalPath = `/services/${category}/${system}/${serviceType}/${item}/${location}`;
  
  return generateServiceMetadata({
    title: `${itemData.name} ${serviceTypeData.name} in ${locationName} | ProTech HVAC`,
    description: `Professional ${itemData.name} ${serviceTypeData.name.toLowerCase()} services in ${locationName}. Fast, reliable service from certified HVAC technicians at ProTech HVAC.`,
    keywords: [
      `${itemData.name} ${serviceTypeData.name.toLowerCase()}`,
      `${system} services`,
      `${itemData.name} service ${locationName}`,
      `${category} HVAC`,
      'ProTech HVAC'
    ],
    path: canonicalPath,
    imageUrl: `/images/services/${category}.jpg`
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, system, serviceType, item, location } = params;

  permanentRedirect(`/services/${category}/${system}/${serviceType}/${item}/${location}`);
  
  // Find the service data from our nested structure
  const categoryData = serviceCategories.find(cat => cat.id === category);
  if (!categoryData) return notFound();
  
  const systemData = categoryData.systems.find(sys => sys.id === system);
  if (!systemData) return notFound();
  
  const serviceTypeData = systemData.serviceTypes.find(type => type.id === serviceType);
  if (!serviceTypeData) return notFound();
  
  const itemData = serviceTypeData.items.find(i => i.id === item);
  if (!itemData) return notFound();
  
  // Get the user's location from server headers
  const serverLocation = getUserLocationFromHeaders();
  
  // Get the location name from the URL parameter
  const locationName = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
  
  // Get location data for weather and service contextualizing
  const locationId = getUserLocationFromHeaders()?.id || 'ohio';
  
  // Get default coordinates for Akron, OH if location not found
  const defaultCoords = { latitude: 41.0814, longitude: -81.5190 };
  
  // Get coordinates for the specific location
  const locationData = getLocationById(locationId.toLowerCase());
  const coordinates = locationData ? 
    { latitude: locationData.coordinates.lat, longitude: locationData.coordinates.lng } : 
    defaultCoords;

  // Get weather data for this location - to personalize content
  const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
  
  // Get personalized recommended services based on weather, season, etc.
  const recommendedServices = getServiceRecommendation(weatherData, system, serviceType);
  
  // Create the service info object
  const serviceInfo = {
    name: `${itemData.name} ${serviceTypeData.name}`,
    description: `Professional ${itemData.name} ${serviceTypeData.name.toLowerCase()} services for ${categoryData.id === 'residential' ? 'homes' : 'businesses'} in ${locationName}.`,
    system: {
      id: systemData.id,
      name: systemData.name,
      icon: systemData.icon
    },
    serviceType: {
      id: serviceTypeData.id,
      name: serviceTypeData.name,
      icon: serviceTypeData.icon
    },
    item: {
      id: itemData.id,
      name: itemData.name,
      icon: itemData.icon
    },
    categoryId: categoryData.id,
    categoryName: categoryData.name,
    locationName
  };
  
  // Service-specific FAQs - these will be shown in the UI and included in structured data
  const serviceFAQs = [
    {
      question: `How much does ${itemData.name} ${serviceTypeData.name.toLowerCase()} cost in ${locationName}?`,
      answer: `The cost of ${itemData.name} ${serviceTypeData.name.toLowerCase()} varies based on your specific system, the complexity of the job, and any parts required. We provide free estimates and transparent pricing before any work begins.`
    },
    {
      question: `How long does ${itemData.name} ${serviceTypeData.name.toLowerCase()} take?`,
      answer: `Most ${serviceTypeData.name.toLowerCase()} services can be completed within a few hours, but more complex jobs may take longer. Our technicians will provide you with a time estimate before starting work.`
    },
    {
      question: `Do you offer emergency ${itemData.name} ${serviceTypeData.name.toLowerCase()} in ${locationName}?`,
      answer: `Yes, we offer 24/7 emergency ${serviceTypeData.name.toLowerCase()} services throughout ${locationName} and surrounding areas. Our technicians are always on call to help with urgent issues.`
    }
  ];
  
  // Create service URL for structured data
  const serviceUrl = `/services2/${category}/${system}/${serviceType}/${item}/${location}`;

  const weatherRecommendation = getServiceRecommendation(weatherData, system, serviceType);
  
  return (
    <ServiceDetailClientWrapper
      serviceName={`${itemData.name} ${serviceTypeData.name} in ${locationName}`}
      serviceDescription={`Professional ${itemData.name} ${serviceTypeData.name.toLowerCase()} services in ${locationName}. Fast, reliable service from certified HVAC technicians at ProTech HVAC.`}
      serviceUrl={serviceUrl}
      serviceImageUrl={`/images/services/${category}.jpg`}
      serviceArea={locationName}
      faqs={serviceFAQs}
      faqTitle={`Frequently Asked Questions About ${itemData.name} ${serviceTypeData.name}`}
      faqSubtitle={`Get answers to common questions about ${itemData.name} ${serviceTypeData.name.toLowerCase()} in ${locationName}.`}
      mainEntity={`${itemData.name} ${serviceTypeData.name}`}
      showVisibleFAQs={false} // Disable visible FAQs but keep schema data for SEO
    >
      <ServicePageContentNew
        serviceInfo={serviceInfo}
        category={category}
        system={system}
        serviceType={serviceType}
        item={item}
        locationParam={location}
        userLocation={serverLocation}
        isLocating={false}
        weatherData={weatherData}
        weatherRecommendation={weatherRecommendation}
      />
    </ServiceDetailClientWrapper>
  );
}