import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serviceCategories } from '@/data/serviceDataNew';
import ServicePageContentNew from '@/components/services/ServicePageContentNew';
import { getWeatherData } from '@/utils/weatherApi';
import { getServiceRecommendation } from '@/utils/recommendations';
import { generateServiceMetadata } from '@/utils/metadata';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';

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
  
  return generateServiceMetadata({
    title: `${itemData.name} ${serviceTypeData.name} in ${locationName} | ProTech HVAC`,
    description: `Professional ${itemData.name} ${serviceTypeData.name.toLowerCase()} services in ${locationName}. Fast, reliable service from certified HVAC technicians at ProTech HVAC.`,
    keywords: [
      `${itemData.name} ${serviceTypeData.name.toLowerCase()}`,
      `${system} services`,
      `${itemData.name} service ${locationName}`,
      `${category} HVAC`,
      'ProTech HVAC'
    ]
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, system, serviceType, item, location } = params;
  
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
  
  // Get weather data for this location to provide context-aware service recommendations
  const weatherData = await getWeatherData(location);
  
  // Get service recommendations based on weather conditions
  const weatherRecommendation = getServiceRecommendation(
    weatherData,
    system,
    serviceType
  );
  
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
  
  return (
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
  );
}