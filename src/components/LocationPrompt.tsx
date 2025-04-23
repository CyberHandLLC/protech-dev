'use client';

import { useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';

type LocationPromptProps = {
  onLocationUpdated: () => void;
};

/**
 * A component that prompts the user to share their location
 * Used on the homepage to ensure we're showing location-specific content
 */
export default function LocationPrompt({ onLocationUpdated }: LocationPromptProps) {
  const { permissionStatus, promptForLocation, isLoading } = useLocation();
  const [isPrompting, setIsPrompting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Don't show if permission is already granted or explicitly denied
  if (permissionStatus === 'granted' || (permissionStatus === 'denied' && hasAttempted)) {
    return null;
  }

  const handleLocationPrompt = async () => {
    setIsPrompting(true);
    
    try {
      const success = await promptForLocation();
      if (success) {
        console.log('Location permission granted');
        onLocationUpdated();
      }
    } finally {
      setIsPrompting(false);
      setHasAttempted(true);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 z-50 max-w-sm ml-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col">
        <div className="flex items-center mb-3">
          <span className="text-xl mr-3" aria-hidden="true">📍</span>
          <h3 className="font-bold text-navy-dark text-lg">Use your location?</h3>
        </div>
        
        <p className="text-navy-dark/80 text-sm sm:text-base mb-4">
          Allow us to show HVAC services specific to your area for the most relevant experience.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setHasAttempted(true)}
            className="px-4 py-2 text-sm font-medium text-navy-dark/70 hover:text-navy-dark bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isPrompting || isLoading}
          >
            Not Now
          </button>
          
          <button
            type="button"
            onClick={handleLocationPrompt}
            className="px-4 py-2 text-sm font-medium text-white bg-red hover:bg-red-dark rounded-lg transition-colors flex items-center"
            disabled={isPrompting || isLoading}
          >
            {isPrompting || isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Detecting...
              </>
            ) : (
              'Use My Location'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
