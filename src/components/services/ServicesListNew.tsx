'use client';

import { useState, useEffect } from 'react';
import { serviceCategories } from '@/data/serviceDataNew';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';

interface ServicesListNewProps {
  categoryId: string;
  userLocation?: any; // ServiceLocation object passed from server-side
}

export default function ServicesListNew({ categoryId, userLocation: serverLocation }: ServicesListNewProps) {
  // State for tracking expanded sections
  const [expandedSystems, setExpandedSystems] = useState<{[key: string]: boolean}>({});
  const [expandedTypes, setExpandedTypes] = useState<{[key: string]: boolean}>({});
  
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating, error } = useLocationDetection();
  
  // State to store the final location after combining server and client data
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    slug: string;
    isDetecting: boolean;
  }>({
    name: serverLocation?.name || 'Northeast Ohio',
    slug: serverLocation?.id || 'northeast-ohio',
    isDetecting: true
  });
  
  // Toggle expansion state for a system
  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemId]: !prev[systemId]
    }));
  };
  
  // Toggle expansion state for a service type
  const toggleServiceType = (typeId: string, systemId: string) => {
    const key = `${systemId}-${typeId}`;
    setExpandedTypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Update location when client-side detection completes
  useEffect(() => {
    // Wait for location detection to complete
    if (!isLocating) {
      let locationName = '';
      let locationSlug = '';

      // Prioritize client location if available, otherwise use server location
      if (clientLocation) {
        try {
          locationName = decodeURIComponent(clientLocation);
        } catch (e) {
          locationName = clientLocation;
          console.error('Error decoding location:', e);
        }
        locationSlug = convertToLocationSlug(clientLocation);
      } else if (serverLocation?.name) {
        // Use server-provided location if client detection fails
        locationName = serverLocation.name;
        locationSlug = serverLocation.id;
      } else {
        // Fallback to default
        locationName = 'Northeast Ohio';
        locationSlug = 'northeast-ohio';
      }
      
      // Update the combined location state
      setCombinedLocation({
        name: locationName,
        slug: locationSlug,
        isDetecting: false
      });
    }
  }, [clientLocation, isLocating, serverLocation]);
  
  // Initialize all systems as expanded by default
  useEffect(() => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    if (category) {
      const initialExpandedSystems: {[key: string]: boolean} = {};
      const initialExpandedTypes: {[key: string]: boolean} = {};
      
      category.systems.forEach(system => {
        initialExpandedSystems[system.id] = true;
        
        system.serviceTypes.forEach(type => {
          const key = `${system.id}-${type.id}`;
          initialExpandedTypes[key] = true;
        });
      });
      
      setExpandedSystems(initialExpandedSystems);
      setExpandedTypes(initialExpandedTypes);
    }
  }, [categoryId]);
  
  // Find the selected category
  const selectedCategory = serviceCategories.find(cat => cat.id === categoryId);
  if (!selectedCategory) {
    return <div>Category not found</div>;
  }
  
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{selectedCategory.name}</h2>
        {combinedLocation.isDetecting ? (
          <p className="text-ivory/70 animate-pulse">Detecting your location...</p>
        ) : (
          <p className="text-ivory/80">
            Services available in <span className="text-red-light font-medium">{combinedLocation.name}</span>
          </p>
        )}
      </div>
      
      {/* Systems (Cooling, Heating, Indoor Air) */}
      <div className="space-y-8">
        {selectedCategory.systems.map((system) => (
          <div 
            key={system.id}
            className="bg-dark-blue rounded-lg overflow-hidden border border-navy"
          >
            {/* System header */}
            <div 
              className="flex items-center justify-between cursor-pointer bg-dark-blue-light p-4"
              onClick={() => toggleSystem(system.id)}
            >
              <h3 className="font-bold text-xl text-white flex items-center gap-3">
                <span className="text-red">{system.icon}</span>
                {system.name}
              </h3>
              <button 
                className="text-ivory hover:text-red transition-colors"
                aria-expanded={expandedSystems[system.id] ? 'true' : 'false'}
                aria-controls={`${system.id}-content`}
              >
                <svg 
                  className={`h-6 w-6 transform transition-transform ${expandedSystems[system.id] ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* System content */}
            <div
              id={`${system.id}-content`}
              className={`transition-all duration-300 ${
                expandedSystems[system.id] 
                  ? 'max-h-[5000px] opacity-100 visible'
                  : 'max-h-0 opacity-0 invisible overflow-hidden'
              }`}
            >
              <div className="p-4 space-y-6">
                {/* Service Types (Maintenance, Repairs, etc.) */}
                {system.serviceTypes.map((serviceType) => (
                  <div key={serviceType.id} className="border-l-4 border-red pl-4 py-2">
                    {/* Service Type header */}
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleServiceType(serviceType.id, system.id)}
                    >
                      <h4 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="text-red">{serviceType.icon}</span>
                        {serviceType.name}
                      </h4>
                      {serviceType.items.length > 0 && (
                        <button 
                          className="text-ivory hover:text-red transition-colors"
                          aria-expanded={expandedTypes[`${system.id}-${serviceType.id}`] ? 'true' : 'false'}
                          aria-controls={`${system.id}-${serviceType.id}-items`}
                        >
                          <svg 
                            className={`h-5 w-5 transform transition-transform ${expandedTypes[`${system.id}-${serviceType.id}`] ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {serviceType.description && (
                      <p className="text-ivory/70 mt-1 mb-2">
                        {serviceType.description}
                      </p>
                    )}
                    
                    {/* Service Items (specific services) */}
                    {serviceType.items.length > 0 && (
                      <div
                        id={`${system.id}-${serviceType.id}-items`}
                        className={`mt-3 transition-all duration-300 ${
                          expandedTypes[`${system.id}-${serviceType.id}`] 
                            ? 'max-h-[500px] opacity-100 visible'
                            : 'max-h-0 opacity-0 invisible overflow-hidden'
                        }`}
                      >
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-2 border-l-2 border-navy/30">
                          {serviceType.items.map((item) => (
                            <li key={item.id} className="py-1">
                              <a 
                                href={`/services2/${categoryId}/${system.id}/${serviceType.id}/${item.id}/${combinedLocation.slug}`}
                                className="flex items-center text-ivory hover:text-red transition-colors"
                              >
                                <span className="text-red mr-2">{item.icon}</span>
                                <span>{item.name}</span>
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* For emergency services with no specific items */}
                    {serviceType.id === 'emergency' && serviceType.items.length === 0 && (
                      <a 
                        href={`/services2/${categoryId}/emergency/${combinedLocation.slug}`}
                        className="inline-flex items-center text-red-light font-medium hover:text-red transition-colors mt-2"
                      >
                        <span className="mr-2">24/7 Emergency Service</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}