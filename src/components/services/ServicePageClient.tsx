'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getLocationFromCoordinates } from '@/utils/location';
import useLocationDetection from '@/hooks/useLocationDetection';

interface ServicePageClientProps {
  location: string;
  service: string;
  serviceType: string;
  userLocation: any;
  isLocating: boolean;
  weatherData: any;
  weatherRecommendation: any;
}

export default function ServicePageClient({
  location,
  service,
  serviceType,
  userLocation: serverLocation,
  isLocating: serverIsLocating,
  weatherData: serverWeatherData,
  weatherRecommendation: serverRecommendation
}: ServicePageClientProps) {
  const [clientWeatherData, setClientWeatherData] = useState(serverWeatherData);
  const [clientRecommendation, setClientRecommendation] = useState(serverRecommendation);
  
  // Use client-side hook for location detection as backup
  const { 
    userLocation: clientLocation, 
    coordinates, 
    isLocating: clientIsLocating, 
    error 
  } = useLocationDetection();
  
  // Only fetch client-side weather if server-side data is not available
  useEffect(() => {
    const fetchClientWeather = async () => {
      // Only fetch if we have coordinates and server didn't provide weather data
      if (coordinates && !serverWeatherData) {
        try {
          // Get location name from coordinates
          const locationName = await getLocationFromCoordinates(coordinates.latitude, coordinates.longitude);
          
          // Fetch weather data for this location
          const response = await fetch(`/api/weather?location=${encodeURIComponent(locationName)}`);
          if (response.ok) {
            const data = await response.json();
            setClientWeatherData(data);
            
            // Also fetch recommendations based on this weather data
            const recResponse = await fetch(
              `/api/recommendations?weather=${data.condition}&temp=${data.temperature}&service=${service}&serviceType=${serviceType}`
            );
            if (recResponse.ok) {
              const recData = await recResponse.json();
              setClientRecommendation(recData);
            }
          }
        } catch (error) {
          console.error('Error fetching client-side weather data:', error);
        }
      }
    };
    
    fetchClientWeather();
  }, [coordinates, serverWeatherData, service, serviceType]);
  
  // Use server data if available, otherwise fall back to client data
  const weatherData = serverWeatherData || clientWeatherData;
  const recommendation = serverRecommendation || clientRecommendation;
  const isLocating = serverIsLocating || clientIsLocating;
  
  // If still loading or no data, show a loading state
  if (isLocating || !weatherData) {
    return (
      <section className="mb-8 bg-gray-100 p-4 rounded-lg animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        </div>
      </section>
    );
  }
  
  // When we have weather data, show the recommendation
  return (
    <section className="mb-8">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-navy flex items-center">
              <span className="text-red mr-2">📊</span>
              Service Recommendation
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              Based on current conditions in {location}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
            {weatherData.icon && (
              <Image
                src={`/images/weather/${weatherData.icon}.svg`}
                alt={weatherData.condition}
                width={32}
                height={32}
              />
            )}
            <div>
              <span className="font-medium">{weatherData.temperature}°F</span>
              <span className="text-gray-500 text-sm ml-2">{weatherData.condition}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-navy mb-2 flex items-center">
            <span className="text-blue-500 mr-2">💡</span>
            Pro Tip for Your {service}
          </h4>
          <p className="text-gray-700">
            {recommendation?.message || 
             `With current temperatures at ${weatherData.temperature}°F and ${weatherData.condition.toLowerCase()} conditions, 
             now is an ideal time for your ${service.toLowerCase()} ${serviceType.toLowerCase()} to ensure optimal performance.`}
          </p>
          
          {recommendation?.tip && (
            <div className="mt-3 text-sm text-gray-600 bg-white p-3 rounded">
              <strong>Maintenance Tip:</strong> {recommendation.tip}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}