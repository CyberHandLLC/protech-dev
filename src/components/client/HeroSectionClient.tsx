'use client';

import React, { useState, useEffect } from 'react';
import { ServiceLocation } from '@/utils/locationUtils';
import useLocationDetection from '@/hooks/useLocationDetection';
import { useLocation } from '@/contexts/LocationContext';
import LocationPrompt from '../LocationPrompt';
import ClientWeatherDisplay from './ClientWeatherDisplay';

interface HeroSectionClientProps {
  defaultLocation?: ServiceLocation;
  isLoading?: boolean;
  emergencyPhone?: string;
  emergencyPhoneDisplay?: string;
}

/**
 * Client component for interactive elements of the HeroSection
 * This separation follows Next.js best practices to reduce TBT
 */
export default function HeroSectionClient({
  defaultLocation,
  isLoading = false,
  emergencyPhone = '8005554822',
  emergencyPhoneDisplay = '800-555-HVAC'
}: HeroSectionClientProps) {
  // Client-side state for location
  const [activeLocation, setActiveLocation] = useState<ServiceLocation | undefined>(defaultLocation);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  // Use the LocationContext which provides all location functionality
  // This centralizes location handling and reduces redundant code
  const { userLocation, isLocating, permissionStatus, promptForLocation } = useLocation();
  
  // Check if we should show location prompt
  useEffect(() => {
    if (permissionStatus === 'prompt') {
      // Only show prompt if we haven't detected location yet
      if (!userLocation) {
        setShowLocationPrompt(true);
      }
    } else {
      setShowLocationPrompt(false);
    }
  }, [permissionStatus, userLocation]);

  return (
    <>
      {/* Weather display component */}
      <div className="mt-8">
        <ClientWeatherDisplay 
          location={defaultLocation} 
          isLoading={isLoading || isLocating} 
        />
      </div>
      
      {/* Emergency contact - only rendered on client */}
      <div className="mt-4">
        <a
          href={`tel:${emergencyPhone}`} 
          className="inline-flex items-center text-white/90 hover:text-red transition-colors"
        >
          <span className="mr-2 bg-red/20 p-1 rounded-full">
            <svg className="w-4 h-4 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <span>{emergencyPhoneDisplay}</span>
        </a>
      </div>
      
      {/* Form area would go here for quote requests */}
      
      {/* Location prompt - only shown when needed */}
      {showLocationPrompt && (
        <LocationPrompt
          onLocationUpdated={() => {
            setShowLocationPrompt(false);
            // Additional logic could be added here if needed
          }}
        />
      )}
    </>
  );
}
