import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import PageLayout from '@/components/PageLayout';
import CTASection from '@/components/CTASection';
import SectionHeading from '@/components/ui/SectionHeading';
// Import both standard and expanded location utilities
import { getLocationById } from '@/utils/locationUtils';
import { 
  getExpandedLocationById, 
  getCountyFromSlug, 
  formatSlugToName,
  expandedServiceLocations 
} from '@/utils/expandedLocationUtils';
import { getWeatherData, type WeatherData } from '@/utils/weatherUtils';
import { generateLocationMetadata } from '@/utils/metadata';
import { generateCanonicalUrl } from '@/utils/canonical';
import { serviceCategories } from '@/data/serviceDataNew';

// Import the client wrapper component for SEO
import ServicesPageClientWrapper from '../../../../components/services/ServicesPageClientWrapper';

interface LocationPageProps {
  params: {
    location: string;
  };
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location } = params;
  
  // Check if this is an expanded location
  const expandedLocation = getExpandedLocationById(location);
  
  // Format location name from slug or use expanded location data
  const locationName = expandedLocation ? 
    `${expandedLocation.name}, ${expandedLocation.stateCode}` : 
    formatSlugToName(location);
  
  // Get county information for better SEO
  const countyName = expandedLocation?.county || getCountyFromSlug(location);
  
  // Generate canonical URL for this location
  const canonicalPath = `/services/locations/${location}`;
  
  // Generate uniquely tailored metadata for this location
  const metadata = generateLocationMetadata(location, locationName, {
    canonical: generateCanonicalUrl(canonicalPath),
    description: `Professional HVAC services in ${locationName} and throughout ${countyName}. ProTech HVAC provides expert heating, cooling, and air quality solutions for homes and businesses.`,
    keywords: [`HVAC ${locationName}`, `heating repair ${locationName}`, `air conditioning ${locationName}`, `${locationName} HVAC company`, `${countyName} HVAC services`]
  });
  
  return metadata;
}

export default async function LocationServicesPage({ params }: LocationPageProps) {
  const { location } = params;
  
  // Try both standard and expanded location data
  const standardLocation = getLocationById(location);
  const expandedLocation = getExpandedLocationById(location);
  
  // If neither database has this location, show 404
  if (!standardLocation && !expandedLocation) return notFound();
  
  // Use whichever location data we found (preference to standard)
  const locationInfo = standardLocation || expandedLocation;
  
  // Format location name consistently
  const locationName = locationInfo ? 
    `${locationInfo.name}` : 
    formatSlugToName(location).replace(', OH', '');
  
  // Get location coordinates for weather data
  const coordinates = locationInfo?.coordinates || { lat: 41.0814, lng: -81.5190 }; // Default to Akron
  
  // Get current date for seasonal content
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isSummer = currentMonth >= 4 && currentMonth <= 9; // May through October
  
  // Get real-time weather data - makes each page unique
  const weatherData = await getWeatherData(coordinates.lat, coordinates.lng);
  
  // Determine season-specific HVAC concerns
  const seasonalConcerns = isSummer ? [
    'AC efficiency in high humidity',
    'Proper system sizing for peak summer temperatures',
    'Indoor air quality during allergy season',
    'Reduced cooling costs during summer months'
  ] : [
    'Furnace safety and carbon monoxide prevention',
    'Even heating throughout your home or business',
    'Improved energy efficiency during cold months',
    'Proper humidity control for winter comfort'
  ];
  
  // Generate weather-specific HVAC tips
  const weatherTips = weatherData ? generateWeatherSpecificTips(weatherData, locationName) : [];
  
  // Get county info - important for local relevance
  const countyName = locationInfo?.county || getCountyFromSlug(location) || 'Northeast Ohio';
  
  // Generate unique, location-specific FAQs incorporating local weather
  const locationFAQs = [
    {
      question: `What HVAC services does ProTech offer in ${locationName}, OH?`,
      answer: `ProTech HVAC offers a complete range of heating, cooling, and air quality services in ${locationName}, OH, including ${isSummer ? 'air conditioning repair and maintenance' : 'heating system repair and furnace maintenance'}, HVAC installations, and 24/7 emergency services. Our certified technicians serve both residential and commercial customers throughout ${locationName} and surrounding areas in ${countyName}.`
    },
    {
      question: `How can ${locationName} residents prepare their HVAC systems for ${isSummer ? 'summer' : 'winter'}?`,
      answer: `${locationName} residents should prepare for ${isSummer ? 'summer' : 'winter'} by scheduling a professional HVAC tune-up with ProTech. ${isSummer ? 'With local summer temperatures averaging ' + Math.round(weatherData?.temp || 75) + '°F and humidity levels often high, ensuring your air conditioning system is clean and efficient is essential.' : 'With local winter conditions typically bringing temperatures around 20-30°F, having your heating system professionally inspected prevents unexpected breakdowns when you need heat most.'} We recommend changing filters, clearing debris from outdoor units, and addressing any unusual noises or performance issues before the season peaks.`
    },
    {
      question: `What are common HVAC problems in ${locationName}, OH homes?`,
      answer: `${locationName} homes commonly experience ${weatherData?.temp > 75 ? 'cooling issues due to the current warm temperatures around ' + Math.round(weatherData?.temp) + '°F' : 'heating challenges during colder periods'}. Specific problems include ${isSummer ? 'refrigerant leaks, clogged condensate drains, and compressor issues affecting cooling efficiency' : 'pilot light issues, inadequate heating in older homes, and furnace short cycling'}, particularly in ${locationName}'s ${countyName} climate and housing styles. ProTech technicians are familiar with these local challenges and provide targeted solutions for ${locationName} residents.`
    },
    {
      question: `Does ProTech provide seasonal maintenance plans for ${locationName} customers?`,
      answer: `Yes, we offer seasonal maintenance plans specifically designed for ${locationName}, OH residents. Our plans include bi-annual system inspections tailored to ${countyName}'s climate patterns, priority service during peak seasons, and discounted repairs. ${locationName} customers appreciate our proactive approach that keeps systems running efficiently year-round while extending equipment life.`
    }
  ];

  // Helper function to generate weather-specific HVAC tips
  function generateWeatherSpecificTips(weather: any, locationName: string) {
    const temp = weather?.temp || 70;
    const humidity = weather?.humidity || 50;
    const conditions = weather?.description || 'clear';
    
    const tips = [];
    
    // Temperature-based tips
    if (temp > 80) {
      tips.push(`With temperatures around ${Math.round(temp)}°F in ${locationName} today, ensure your AC filters are clean for optimal cooling efficiency.`);
    } else if (temp < 40) {
      tips.push(`${locationName}'s current temperature of ${Math.round(temp)}°F means your heating system needs to be in top condition to maintain comfort.`);
    }
    
    // Humidity-based tips
    if (humidity > 60) {
      tips.push(`${locationName}'s current humidity level of ${humidity}% might make your home feel warmer. Your AC needs to work efficiently to remove excess moisture.`);
    } else if (humidity < 30) {
      tips.push(`The current low humidity of ${humidity}% in ${locationName} might cause dry air issues. Consider a whole-home humidifier for better comfort.`);
    }
    
    // Weather condition tips
    if (conditions.includes('rain') || conditions.includes('thunderstorm')) {
      tips.push(`During rainy conditions in ${locationName}, check that your outdoor HVAC unit is clear of debris that might wash into it.`);
    } else if (conditions.includes('snow')) {
      tips.push(`With snow in ${locationName}, ensure your outdoor heating unit is clear of snow and ice for safe, efficient operation.`);
    } else if (conditions.includes('clear') && temp > 75) {
      tips.push(`Clear, sunny days in ${locationName} can heat up your home quickly. Ensure your AC is tuned up for peak efficiency.`);
    }
    
    return tips;
  }
  
  return (
    <PageLayout>
      <ServicesPageClientWrapper
        faqs={locationFAQs}
        title={`HVAC Services in ${locationName}, OH`}
        subtitle={`ProTech HVAC provides professional heating and cooling services throughout ${locationName} and ${countyName}`}
        mainEntity={`HVAC Services in ${locationName}, OH`}
      >
        <div className="bg-navy">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <SectionHeading
              accentText="ProTech HVAC"
              title={`Professional HVAC Services in ${locationName}, OH`}
              subtitle={`Trusted heating and cooling solutions for ${locationName} residents and businesses in ${countyName}`}
              size="lg"
              centered
            />
          </div>
        </div>
        
        {/* Weather-specific banner - creates unique content for SEO */}
        {weatherData && (
          <div className="bg-navy-darker py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center text-ivory">
                <div className="mr-3 text-xl">
                  {weatherData.description.includes('rain') && '🌧️'}
                  {weatherData.description.includes('cloud') && '☁️'}
                  {weatherData.description.includes('clear') && '☀️'}
                  {weatherData.description.includes('snow') && '❄️'}
                  {!weatherData.description.includes('rain') && 
                   !weatherData.description.includes('cloud') && 
                   !weatherData.description.includes('clear') && 
                   !weatherData.description.includes('snow') && '🌡️'}
                </div>
                <div>
                  <span className="font-semibold">Current conditions in {locationName}:</span> {Math.round(weatherData.temp)}°F, {weatherData.description} • 
                  <span className="text-red-light font-medium ml-2">
                    {weatherData.temp > 75 ? 'Time for AC maintenance?' : weatherData.temp < 50 ? 'Heating system ready?' : 'Perfect time for HVAC tune-up!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Location-specific content */}
        <div className="bg-navy-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-navy rounded-xl p-8 shadow-lg border border-navy-light">
              <h2 className="text-2xl font-bold text-white mb-4">
                Serving {locationName}, OH and All of {countyName}
              </h2>
              
              {/* Weather-specific HVAC tips - dynamic content unique to each page/visit */}
              {weatherTips.length > 0 && (
                <div className="mt-4 mb-6 bg-navy-darker p-4 rounded-lg border border-navy-light">
                  <h3 className="text-lg font-semibold text-red mb-2">
                    Today's {locationName} HVAC Tip:
                  </h3>
                  <p className="text-ivory">{weatherTips[0]}</p>
                </div>
              )}
              
              {/* Seasonal-specific content */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-red mb-3">
                  {isSummer ? 'Summer' : 'Winter'} HVAC Priorities for {locationName} Residents
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {seasonalConcerns.map((concern, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red mr-2 mt-1">✓</span>
                      <span className="text-ivory">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-red mb-4">
                    Residential HVAC in {locationName}
                  </h3>
                  
                  <ul className="space-y-3 text-ivory">
                    {serviceCategories
                      .find(cat => cat.id === 'residential')?.systems
                      .slice(0, 5)
                      .map(system => (
                        <li key={system.id} className="flex items-center">
                          <span className="text-red mr-2">✓</span>
                          <span>{system.name} {system.id === 'cooling' && weatherData?.temp > 75 ? '(High Priority Now)' : system.id === 'heating' && weatherData?.temp < 50 ? '(High Priority Now)' : ''}</span>
                        </li>
                      ))}
                    <li className="flex items-center">
                      <span className="text-red mr-2">✓</span>
                      <span>24/7 Emergency Services in {locationName}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-red mb-4">
                    Commercial Solutions for {locationName} Businesses
                  </h3>
                  
                  <ul className="space-y-3 text-ivory">
                    {serviceCategories
                      .find(cat => cat.id === 'commercial')?.systems
                      .slice(0, 5)
                      .map(system => (
                        <li key={system.id} className="flex items-center">
                          <span className="text-red mr-2">✓</span>
                          <span>{system.name} {system.id === 'cooling' && weatherData?.temp > 75 ? '(High Priority Now)' : system.id === 'heating' && weatherData?.temp < 50 ? '(High Priority Now)' : ''}</span>
                        </li>
                      ))}
                    <li className="flex items-center">
                      <span className="text-red mr-2">✓</span>
                      <span>{locationName}-Specific Maintenance Plans</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="text-ivory">
                  ProTech HVAC has been proudly serving {locationName}, OH since 2018, providing reliable heating, cooling, and air quality solutions to local homeowners and businesses. Our team of certified technicians is familiar with the unique HVAC challenges faced by {locationName} residents throughout {countyName}'s changing seasons, from humid summers to frigid winters. We understand the specific needs of {locationName} properties and deliver personalized service for optimal indoor comfort.
                </p>
                
                <div className="mt-8 flex justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red hover:bg-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red transition-colors"
                  >
                    Schedule Service in {locationName}, OH
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CTASection location={locationName} />
      </ServicesPageClientWrapper>
    </PageLayout>
  );
}
