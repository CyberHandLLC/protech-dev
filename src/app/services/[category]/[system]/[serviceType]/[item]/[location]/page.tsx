import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { serviceCategories } from '@/data/serviceDataNew';
import ServicePageContentNew from '@/components/services/ServicePageContentNew';
import { getWeatherData } from '@/utils/weatherApi';
import { getLocationById } from '@/utils/locationUtils';
import { getExpandedLocationById } from '@/utils/expandedLocationUtils';
import { getServiceRecommendation } from '@/utils/recommendations';
import { generateServiceMetadata } from '@/utils/metadata';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import { generateCanonicalUrl } from '@/utils/canonical';

// Import the client wrapper component
import ServiceDetailClientWrapper from '../../../../../../../components/services/ServiceDetailClientWrapper';

// Define the type for the page params
interface ServiceDetailPageProps {
  params: Promise<{
    category: string;
    system: string;
    serviceType: string;
    item: string;
    location: string;
  }>;
}

// Generate dynamic metadata based on the service details
// Generate static params for ISR - only Ohio locations
export async function generateStaticParams() {
  const { serviceLocations } = await import('@/utils/locationUtils');
  const { expandedServiceLocations } = await import('@/utils/expandedLocationUtils');
  const { serviceCategories } = await import('@/data/serviceDataNew');
  
  const params: Array<{
    category: string;
    system: string;
    serviceType: string;
    item: string;
    location: string;
  }> = [];
  
  // Combine all Ohio locations
  const allLocations = [
    ...serviceLocations.filter(loc => loc.stateCode === 'OH'),
    ...expandedServiceLocations.filter(loc => loc.stateCode === 'OH'),
    { id: 'northeast-ohio', stateCode: 'OH' } // Add region
  ];
  
  // Generate params for top priority service combinations only (to keep build time reasonable)
  // Focus on most common services: heating maintenance, AC repair, installation
  const priorityServices = [
    { category: 'residential', system: 'heating', serviceType: 'maintenance', items: ['furnaces'] },
    { category: 'residential', system: 'cooling', serviceType: 'repair', items: ['air-conditioners'] },
    { category: 'residential', system: 'heating', serviceType: 'installation', items: ['furnaces'] },
    { category: 'residential', system: 'cooling', serviceType: 'installation', items: ['air-conditioners'] },
  ];
  
  priorityServices.forEach(service => {
    service.items.forEach(item => {
      allLocations.forEach(location => {
        params.push({
          category: service.category,
          system: service.system,
          serviceType: service.serviceType,
          item: item,
          location: location.id
        });
      });
    });
  });
  
  return params;
}

// Enable ISR with revalidation
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow dynamic params not in generateStaticParams

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { category, system, serviceType, item, location } = await params;
  
  // Find the specific service info from our data
  const categoryData = serviceCategories.find(cat => cat.id === category);
  if (!categoryData) return { title: 'Service Not Found' };
  
  const systemData = categoryData.systems.find(sys => sys.id === system);
  if (!systemData) return { title: 'Service Not Found' };
  
  const serviceTypeData = systemData.serviceTypes.find(type => type.id === serviceType);
  if (!serviceTypeData) return { title: 'Service Not Found' };
  
  const itemData = serviceTypeData.items.find(i => i.id === item);
  if (!itemData) return { title: 'Service Not Found' };

  const isValidLocationParam =
    location === 'northeast-ohio' ||
    Boolean(getLocationById(location)) ||
    Boolean(getExpandedLocationById(location));

  const canonicalLocation = isValidLocationParam ? location : 'northeast-ohio';
  
  // Format location name from slug
  const locationName = canonicalLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
    
  // Generate canonical URL for this service
  const canonicalPath = `/services/${category}/${system}/${serviceType}/${item}/${canonicalLocation}`;
  
  const metadata = generateServiceMetadata({
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
  
  return metadata;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, system, serviceType, item, location } = await params;
  
  // Find the service data from our nested structure
  const categoryData = serviceCategories.find(cat => cat.id === category);
  if (!categoryData) return notFound();
  
  const systemData = categoryData.systems.find(sys => sys.id === system);
  if (!systemData) return notFound();
  
  const serviceTypeData = systemData.serviceTypes.find(type => type.id === serviceType);
  if (!serviceTypeData) return notFound();
  
  const itemData = serviceTypeData.items.find(i => i.id === item);
  if (!itemData) return notFound();

  // CRITICAL SEO FIX: Only allow Ohio locations (Fix #1 from original plan)
  // Reject out-of-service-area pages with 404 to prevent Google indexing thousands of invalid pages
  const isValidLocationParam =
    location === 'northeast-ohio' ||
    Boolean(getLocationById(location)) ||
    Boolean(getExpandedLocationById(location));

  if (!isValidLocationParam) {
    // Invalid location format - redirect to default
    permanentRedirect(`/services/${category}/${system}/${serviceType}/${item}/northeast-ohio`);
  }

  // Check if location is in Ohio - reject all out-of-state locations
  if (location !== 'northeast-ohio') {
    const standardLocation = getLocationById(location);
    const expandedLocation = getExpandedLocationById(location);
    const locationData = standardLocation || expandedLocation;
    
    // If we have location data and it's NOT Ohio, return 404
    if (locationData && locationData.stateCode !== 'OH') {
      return notFound();
    }
    
    // Additional check: if location slug doesn't end with '-oh', it's likely out of state
    if (!location.endsWith('-oh') && location !== 'northeast-ohio') {
      return notFound();
    }
  }
  
  // Get the user's location from server headers
  const serverLocation = await getUserLocationFromHeaders();
  
  // Get the location name from the URL parameter
  const locationName = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Oh$/, 'OH');
  
  // Get location data for weather and service contextualizing
  const locationId = serverLocation.id || 'ohio';
  
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
  const weatherRecommendation = getServiceRecommendation(weatherData, system, serviceType);
  
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
  
  // Generate comprehensive FAQs - combining service-specific and general HVAC FAQs
  // This prevents duplicate FAQPage schemas by having only one FAQ array
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
    },
    // Add general HVAC FAQs
    {
      question: `How often should I have my HVAC system serviced?`,
      answer: `We recommend having your system professionally serviced twice a year: once before the cooling season and once before the heating season. Regular maintenance extends the life of your system and improves efficiency.`
    },
    {
      question: `How long do HVAC systems typically last?`,
      answer: `With proper maintenance, air conditioners and heat pumps typically last 10-15 years, while furnaces can last 15-20 years. Regular maintenance is key to maximizing your system's lifespan.`
    },
    {
      question: `What size HVAC system do I need for my home?`,
      answer: `The right size depends on several factors including your home's square footage, insulation, window efficiency, and local climate. Our professional technicians can perform a load calculation to determine the perfect size for your needs.`
    },
    {
      question: `How can I improve my indoor air quality?`,
      answer: `You can improve indoor air quality by regularly changing air filters, using air purifiers, installing UV lights in your HVAC system, maintaining proper humidity levels, and scheduling regular duct cleaning.`
    },
    {
      question: `Do you offer emergency HVAC services?`,
      answer: `Yes, we offer 24/7 emergency HVAC services throughout Northeast Ohio. Our technicians are always on call to help with urgent heating and cooling issues.`
    }
  ];
  
  // Create service URL for structured data
  const serviceUrl = `/services/${category}/${system}/${serviceType}/${item}/${location}`;
  
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
      showVisibleFAQs={false} // Keep FAQs in schema but not visible on the page
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
