'use client';

import { useState, useEffect } from 'react';
import { ServiceCategory, ServiceSystem, ServiceType, ServiceItem } from '@/data/serviceDataNew';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';
import Link from 'next/link';
import Image from 'next/image';

interface ServicesListEnhancedProps {
  category: ServiceCategory;
  userLocation?: any; // ServiceLocation object passed from server-side
}

export default function ServicesListEnhanced({ 
  category, 
  userLocation: serverLocation 
}: ServicesListEnhancedProps) {
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // State to track which systems and service types are expanded
  const [expandedSystems, setExpandedSystems] = useState<{[key: string]: boolean}>({});
  const [expandedServiceTypes, setExpandedServiceTypes] = useState<{[key: string]: boolean}>({});
  
  // Initialize all systems to be expanded by default
  useEffect(() => {
    const initialExpanded = category.systems.reduce((acc, system) => {
      acc[system.id] = true;
      return acc;
    }, {} as {[key: string]: boolean});
    
    setExpandedSystems(initialExpanded);
  }, [category.systems]);
  
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
  
  // Update location when client-side detection completes
  useEffect(() => {
    if (!isLocating) {
      let locationName = '';
      let locationSlug = '';

      // Prioritize client location if available, otherwise use server location
      if (clientLocation) {
        try {
          locationName = decodeURIComponent(clientLocation);
        } catch (e) {
          locationName = clientLocation;
        }
        locationSlug = convertToLocationSlug(clientLocation);
      } else if (serverLocation?.name) {
        locationName = serverLocation.name;
        locationSlug = serverLocation.id;
      } else {
        locationName = 'Northeast Ohio';
        locationSlug = 'northeast-ohio';
      }

      setCombinedLocation({
        name: locationName,
        slug: locationSlug,
        isDetecting: false
      });
    }
  }, [isLocating, clientLocation, serverLocation]);
  
  // Toggle expansion state for a system
  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemId]: !prev[systemId]
    }));
  };
  
  // Toggle expansion state for a service type
  const toggleServiceType = (serviceTypeId: string) => {
    setExpandedServiceTypes(prev => ({
      ...prev,
      [serviceTypeId]: !prev[serviceTypeId]
    }));
  };
  
  // Get icon path for a service system
  const getSystemIconPath = (systemId: string): string => {
    const iconMap: {[key: string]: string} = {
      'cooling': '/images/icons/cooling.svg',
      'heating': '/images/icons/heating.svg',
      'indoor-air': '/images/icons/indoor-air.svg',
      'maintenance': '/images/icons/maintenance.svg',
      'emergency': '/images/icons/emergency.svg',
    };
    
    return iconMap[systemId] || '/images/icons/default-service.svg';
  };
  
  // Get a gradient based on system type for visual interest
  const getSystemGradient = (systemId: string): string => {
    const gradientMap: {[key: string]: string} = {
      'cooling': 'from-blue-600 to-blue-800',
      'heating': 'from-red-600 to-red-800',
      'indoor-air': 'from-green-600 to-green-800',
      'maintenance': 'from-purple-600 to-purple-800',
      'emergency': 'from-orange-600 to-orange-800',
    };
    
    return gradientMap[systemId] || 'from-navy to-dark-blue';
  };
  
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ivory">{category.name}</h2>
          <p className="text-ivory/80 mt-4">Services available in {combinedLocation.name}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {category.systems.map((system) => (
            <div 
              key={system.id} 
              className="bg-navy-light/20 border border-ivory/10 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-red/20"
            >
              {/* System Header */}
              <div 
                className={`relative bg-gradient-to-r ${getSystemGradient(system.id)} p-5 cursor-pointer flex items-center justify-between`}
                onClick={() => toggleSystem(system.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-4 shadow-md">
                    <span className="text-xl">{system.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{system.name}</h3>
                </div>
                
                <svg 
                  className={`w-6 h-6 text-white transition-transform duration-300 ${
                    expandedSystems[system.id] ? 'transform rotate-180' : ''
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* System Content */}
              <div className={`transition-all duration-500 overflow-hidden ${
                expandedSystems[system.id] ? 'max-h-[2000px]' : 'max-h-0'
              }`}>
                <div className="p-5">
                  {system.description && (
                    <p className="text-ivory/80 mb-6">{system.description}</p>
                  )}
                  
                  {/* Service Types Accordion */}
                  <div className="space-y-4">
                    {system.serviceTypes.map((serviceType) => (
                      <div key={serviceType.id} className="border border-ivory/10 rounded-lg overflow-hidden">
                        {/* Service Type Header */}
                        <div
                          className="p-4 bg-navy-light/30 flex items-center justify-between cursor-pointer hover:bg-navy-light/40"
                          onClick={() => toggleServiceType(`${system.id}-${serviceType.id}`)}
                        >
                          <div className="flex items-center">
                            <span className="text-red mr-3 text-lg">{serviceType.icon}</span>
                            <h4 className="font-medium text-ivory">{serviceType.name}</h4>
                          </div>
                          
                          <svg 
                            className={`w-5 h-5 text-ivory/70 transition-transform duration-300 ${
                              expandedServiceTypes[`${system.id}-${serviceType.id}`] ? 'transform rotate-180' : ''
                            }`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        {/* Service Type Content - Items Grid */}
                        <div className={`transition-all duration-300 ${
                          expandedServiceTypes[`${system.id}-${serviceType.id}`] 
                            ? 'max-h-[1000px] opacity-100 visible'
                            : 'max-h-0 opacity-0 invisible overflow-hidden'
                        }`}>
                          <div className="p-4 bg-navy-light/10">
                            {serviceType.description && (
                              <p className="text-ivory/70 text-sm mb-4 pb-3 border-b border-ivory/10">{serviceType.description}</p>
                            )}
                            
                            {serviceType.items && serviceType.items.length > 0 ? (
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                {serviceType.items.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={`/services2/${category.id}/${system.id}/${serviceType.id}/${item.id}/${combinedLocation.slug}`}
                                    className="group"
                                  >
                                    <div className="flex items-center p-3 rounded-lg bg-navy-light/20 hover:bg-red/10 border border-ivory/5 hover:border-red/30 transition-all duration-200 group-hover:translate-x-1">
                                      <span className="text-lg mr-3 text-red group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                      <span className="text-ivory group-hover:text-red transition-colors duration-200">{item.name}</span>
                                      <svg className="w-4 h-4 ml-auto text-ivory/50 group-hover:text-red transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-4">
                                <Link
                                  href={`/services2/${category.id}/${system.id}/${serviceType.id}/general/${combinedLocation.slug}`}
                                  className="bg-navy-light/30 hover:bg-red/10 text-ivory hover:text-red transition-colors duration-200 py-3 px-6 rounded-lg border border-ivory/10 hover:border-red/30 flex items-center"
                                >
                                  <span>Request {serviceType.name}</span>
                                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-navy-light/30 p-6 rounded-lg border border-ivory/10">
            <h3 className="text-xl font-bold text-ivory mb-2">Not sure which service you need?</h3>
            <p className="text-ivory/70 mb-4">Our experts can help you determine the best solution for your needs.</p>
            <Link
              href="/contact"
              className="inline-block bg-red hover:bg-red-dark text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}