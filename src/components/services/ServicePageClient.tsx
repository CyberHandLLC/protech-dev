'use client';

import React, { useEffect, useState } from 'react';
import useLocationDetection from '@/hooks/useLocationDetection';
import ServicePageContent from './ServicePageContent';
import PageLayout from '@/components/PageLayout';
import { getWeatherRecommendation } from '@/utils/dynamicContent';
import type { WeatherData } from '@/utils/weatherApi';

type ServicePageClientProps = {
  serviceInfo: any;
  category: string;
  service: string;
  locationParam: string;
  serverLocation: string;
};

/**
 * Client component wrapper for service details page
 * Handles client-side location detection and updates
 */
export default function ServicePageClient({ 
  serviceInfo,
  category,
  service,
  locationParam,
  serverLocation
}: ServicePageClientProps) {
  const { userLocation, isLocating, error } = useLocationDetection();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherRecommendation, setWeatherRecommendation] = useState('');
  
  // Use server-provided location as a starting value
  const [finalLocation, setFinalLocation] = useState(serverLocation);
  
  // Update with client-side location detection result when available
  useEffect(() => {
    if (userLocation && locationParam === 'northeast-ohio') {
      setFinalLocation(userLocation);
    }
  }, [userLocation, locationParam]);
  
  // Fetch weather data when location is available
  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const { weatherData, recommendation } = await getWeatherRecommendation(locationParam, service);
        setWeatherData(weatherData);
        setWeatherRecommendation(recommendation);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
    
    if (!isLocating) {
      fetchWeatherData();
    }
  }, [locationParam, service, isLocating]);

  // Wrap in PageLayout at the client component level
  return (
    <PageLayout>
      <ServicePageContent 
        serviceInfo={serviceInfo} 
        category={category} 
        service={service} 
        locationParam={locationParam}
        userLocation={finalLocation} 
        isLocating={isLocating}
        weatherData={weatherData}
        weatherRecommendation={weatherRecommendation}
      />
    </PageLayout>
  );
}
