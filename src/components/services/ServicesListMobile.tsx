'use client';

import { useState, useEffect, useRef } from 'react';
import { ServiceCategory } from '@/data/serviceDataNew';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';

interface ServicesListMobileProps {
  category: ServiceCategory;
  userLocation?: any; // ServiceLocation object passed from server-side
}

export default function ServicesListMobile({ 
  category, 
  userLocation: serverLocation 
}: ServicesListMobileProps) {
  // Use client-side hook as backup to server-provided location
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // State to track active system and service type
  const [activeSystem, setActiveSystem] = useState<string>(category.systems[0]?.id || '');
  const [activeServiceType, setActiveServiceType] = useState<string>('');
  
  // State to track arrow visibility
  const [showSystemArrows, setShowSystemArrows] = useState<boolean>(false);
  const [showServiceArrows, setShowServiceArrows] = useState<boolean>(false);
  
  // Refs for scroll containers
  const systemTabsRef = useRef<HTMLDivElement>(null);
  const serviceTabsRef = useRef<HTMLDivElement>(null);
  
  // Timeouts for auto-hiding arrows
  const systemArrowsTimeout = useRef<NodeJS.Timeout | null>(null);
  const serviceArrowsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // State to store the final location after combining server and client data
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    slug: string;
    isDetecting: boolean;
  }>({
    name: serverLocation?.name || '',
    slug: serverLocation?.id || '',
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
        // If neither client nor server location is available, use geolocation API directly
        fetch('/api/geolocation')
          .then(response => response.json())
          .then(data => {
            if (data.location) {
              locationName = data.location;
              locationSlug = convertToLocationSlug(data.location);
              
              setCombinedLocation({
                name: locationName,
                slug: locationSlug,
                isDetecting: false
              });
            }
          })
          .catch(error => {
            console.error('Error fetching location from API:', error);
            // Only use Northeast Ohio as absolute last resort
            locationName = 'Northeast Ohio';
            locationSlug = 'northeast-ohio';
            
            setCombinedLocation({
              name: locationName,
              slug: locationSlug,
              isDetecting: false
            });
          });
          
        // Return early since we're handling state update in the async callback
        return;
      }

      setCombinedLocation({
        name: locationName,
        slug: locationSlug,
        isDetecting: false
      });
    }
  }, [isLocating, clientLocation, serverLocation]);
  
  // Get active system data
  const activeSystemData = category.systems.find(sys => sys.id === activeSystem);
  
  // Extract all service types from the active system
  const serviceTypes = activeSystemData?.serviceTypes || [];
  
  // Set initial active service type when system changes
  useEffect(() => {
    if (serviceTypes.length > 0) {
      setActiveServiceType(serviceTypes[0].id);
    }
  }, [activeSystem, serviceTypes]);
  
  // Handler for system tabs container hover
  const handleSystemTabsHover = () => {
    setShowSystemArrows(true);
    
    // Auto-hide arrows after 1 second
    if (systemArrowsTimeout.current) {
      clearTimeout(systemArrowsTimeout.current);
    }
    
    systemArrowsTimeout.current = setTimeout(() => {
      setShowSystemArrows(false);
    }, 1000);
  };
  
  // Handler for system tabs container leave
  const handleSystemTabsLeave = () => {
    if (systemArrowsTimeout.current) {
      clearTimeout(systemArrowsTimeout.current);
    }
    setShowSystemArrows(false);
  };
  
  // Handler for service tabs container hover
  const handleServiceTabsHover = () => {
    setShowServiceArrows(true);
    
    // Auto-hide arrows after 1 second
    if (serviceArrowsTimeout.current) {
      clearTimeout(serviceArrowsTimeout.current);
    }
    
    serviceArrowsTimeout.current = setTimeout(() => {
      setShowServiceArrows(false);
    }, 1000);
  };
  
  // Handler for service tabs container leave
  const handleServiceTabsLeave = () => {
    if (serviceArrowsTimeout.current) {
      clearTimeout(serviceArrowsTimeout.current);
    }
    setShowServiceArrows(false);
  };
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (systemArrowsTimeout.current) {
        clearTimeout(systemArrowsTimeout.current);
      }
      if (serviceArrowsTimeout.current) {
        clearTimeout(serviceArrowsTimeout.current);
      }
    };
  }, []);
  
  // Scroll handlers for left/right arrows
  const scrollSystemTabs = (direction: 'left' | 'right') => {
    if (systemTabsRef.current) {
      const scrollAmount = 200; // Scroll by 200px
      systemTabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollServiceTabs = (direction: 'left' | 'right') => {
    if (serviceTabsRef.current) {
      const scrollAmount = 200; // Scroll by 200px
      serviceTabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Find the active service type object
  const activeServiceTypeData = serviceTypes.find(type => type.id === activeServiceType);
  
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* System Navigation Tabs */}
        <div className="mb-8 relative">
          <div 
            className="relative overflow-hidden" 
            onMouseEnter={handleSystemTabsHover}
            onMouseLeave={handleSystemTabsLeave}
            onTouchStart={handleSystemTabsHover}
          >
            {/* Left Arrow - Positioned on top of tabs */}
            <div 
              className={`absolute left-0 top-0 bottom-0 flex items-center z-20 transition-opacity duration-300 ${
                showSystemArrows ? 'opacity-80' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => scrollSystemTabs('left')}
            >
              <div className="h-full w-12 flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ivory/90 bg-navy/50 rounded-full p-1">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Right Arrow - Positioned on top of tabs */}
            <div 
              className={`absolute right-0 top-0 bottom-0 flex items-center z-20 transition-opacity duration-300 ${
                showSystemArrows ? 'opacity-80' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => scrollSystemTabs('right')}
            >
              <div className="h-full w-12 flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ivory/90 bg-navy/50 rounded-full p-1">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div 
              ref={systemTabsRef}
              className="overflow-x-auto scrollbar-hide"
            >
              <div className="flex space-x-2 pb-2 min-w-max p-1">
                {category.systems.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => setActiveSystem(system.id)}
                    className={`px-5 py-3 rounded-lg flex items-center transition-all ${
                      activeSystem === system.id 
                        ? 'bg-red text-white shadow-lg' 
                        : 'bg-navy-light hover:bg-navy-light/80 text-ivory'
                    }`}
                  >
                    <span className="mr-2 text-xl">{system.icon}</span>
                    <span className="font-medium">{system.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Active System Content */}
        {activeSystemData && (
          <div>
            <div className="mb-8">
              <SectionHeading
                title={activeSystemData.name}
                subtitle={activeSystemData.description || `Professional ${activeSystemData.name.toLowerCase()} services for your home or business.`}
                size="md"
              />
            </div>
            
            {/* Service Type Tabs */}
            <div className="mb-6 relative">
              <div 
                className="relative overflow-hidden"
                onMouseEnter={handleServiceTabsHover}
                onMouseLeave={handleServiceTabsLeave}
                onTouchStart={handleServiceTabsHover}
              >
                {/* Left Arrow - Positioned on top of tabs */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 flex items-center z-20 transition-opacity duration-300 ${
                    showServiceArrows ? 'opacity-80' : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={() => scrollServiceTabs('left')}
                >
                  <div className="h-full w-12 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ivory/90 bg-navy/50 rounded-full p-1">
                      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Right Arrow - Positioned on top of tabs */}
                <div 
                  className={`absolute right-0 top-0 bottom-0 flex items-center z-20 transition-opacity duration-300 ${
                    showServiceArrows ? 'opacity-80' : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={() => scrollServiceTabs('right')}
                >
                  <div className="h-full w-12 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ivory/90 bg-navy/50 rounded-full p-1">
                      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div 
                  ref={serviceTabsRef}
                  className="overflow-x-auto scrollbar-hide"
                >
                  <div className="flex space-x-2 pb-2 min-w-max p-1">
                    {serviceTypes.map((serviceType) => (
                      <button
                        key={serviceType.id}
                        onClick={() => setActiveServiceType(serviceType.id)}
                        className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                          activeServiceType === serviceType.id 
                            ? 'bg-red text-white shadow-md' 
                            : 'bg-navy-light/50 hover:bg-navy-light/80 text-ivory'
                        }`}
                      >
                        <span className="mr-2 text-lg">{serviceType.icon}</span>
                        <span className="font-medium">{serviceType.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active Service Type Content */}
            {activeServiceTypeData && (
              <div className="bg-navy-light/20 border border-ivory/10 rounded-lg overflow-hidden mb-8">
                {/* Service Type Header */}
                <div className="bg-navy-light p-3 sm:p-4 flex items-center">
                  <div className="flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center bg-navy rounded-full mr-3 text-xl">{activeServiceTypeData.icon}</span>
                    <h3 className="text-xl font-bold text-white">{activeSystemData.name} {activeServiceTypeData.name}</h3>
                  </div>
                </div>
                
                {/* Service Type Description */}
                {activeServiceTypeData.description && (
                  <div className="p-3 sm:p-4 pb-2 border-b border-navy-light/30">
                    <p className="text-ivory/80">{activeServiceTypeData.description}</p>
                  </div>
                )}
                
                {/* Service Items Grid */}
                <div className="p-3 sm:p-4">
                  {activeServiceTypeData.items && activeServiceTypeData.items.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {activeServiceTypeData.items.map((item) => (
                        <li key={item.id}>
                          <Link 
                            href={`/services2/${category.id}/${activeSystemData.id}/${activeServiceTypeData.id}/${item.id}/${combinedLocation.slug}`}
                            className="flex items-center p-3 sm:p-4 rounded-md bg-navy-light/30 hover:bg-red/10 border border-ivory/5 hover:border-red/30 group transition-all"
                          >
                            <span className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center bg-navy rounded-full mr-3 sm:mr-4 text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0 mr-1">
                              <div className="font-medium text-base sm:text-lg text-white group-hover:text-red transition-colors truncate">
                                {item.name}
                              </div>
                              <div className="text-xs sm:text-sm text-ivory/60 group-hover:text-ivory/80 transition-colors truncate">
                                {activeServiceTypeData.name.toLowerCase()}
                              </div>
                            </div>
                            <svg 
                              className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-auto flex-shrink-0 text-ivory/30 group-hover:text-red transition-colors group-hover:translate-x-1 transition-transform duration-200" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-4 px-6 text-center">
                      <Link
                        href={`/services2/${category.id}/${activeSystemData.id}/${activeServiceTypeData.id}/general/${combinedLocation.slug}`}
                        className="inline-flex items-center bg-red hover:bg-red-dark text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <span>Schedule {activeSystemData.name} {activeServiceTypeData.name}</span>
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Service Benefits */}
            <div className="mt-8 bg-navy-light/20 border border-ivory/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-ivory mb-4 border-b border-ivory/10 pb-3">
                Why Choose Our {activeSystemData.name} Services
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Certified Technicians</h4>
                    <p className="text-ivory/70 text-sm">Our NATE-certified professionals ensure quality work.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Fast Response Times</h4>
                    <p className="text-white text-sm">Available when you need us most.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Upfront Pricing</h4>
                    <p className="text-ivory/70 text-sm">No surprises or hidden fees.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Satisfaction Guaranteed</h4>
                    <p className="text-white text-sm">We stand behind our work 100%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6">
            <h3 className="text-xl font-bold text-white mb-4">Need service in {combinedLocation.name}?</h3>
            <Link
              href="/contact"
              className="inline-flex items-center bg-red hover:bg-red-dark text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              <span>Schedule Now</span>
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Style to hide scrollbars */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}