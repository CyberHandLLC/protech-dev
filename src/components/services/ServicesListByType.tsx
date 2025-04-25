'use client';

import { useState, useEffect } from 'react';
import { ServiceCategory } from '@/data/serviceDataNew';
import useLocationDetection from '@/hooks/useLocationDetection';
import { convertToLocationSlug } from '@/utils/location';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';

// Type to collect all unique service types across systems
interface ServiceTypeData {
  id: string;
  name: string;
  icon: string;
}

interface ServicesListByTypeProps {
  category: ServiceCategory;
  userLocation?: any;
}

export default function ServicesListByType({ category, userLocation: serverLocation }: ServicesListByTypeProps) {
  // Client-side location detection
  const { userLocation: clientLocation, isLocating } = useLocationDetection();
  
  // State to track active service type tab
  const [activeServiceType, setActiveServiceType] = useState<string>('');
  
  // State for location
  const [combinedLocation, setCombinedLocation] = useState<{
    name: string;
    slug: string;
  }>({
    name: serverLocation?.name || 'Northeast Ohio',
    slug: serverLocation?.id || 'northeast-ohio',
  });
  
  // Extract all unique service types across systems
  const serviceTypes: ServiceTypeData[] = [];
  const serviceTypeMap: {[key: string]: boolean} = {};
  
  category.systems.forEach(system => {
    system.serviceTypes.forEach(serviceType => {
      if (!serviceTypeMap[serviceType.id]) {
        serviceTypeMap[serviceType.id] = true;
        serviceTypes.push({
          id: serviceType.id,
          name: serviceType.name,
          icon: serviceType.icon
        });
      }
    });
  });
  
  // Set initial active service type
  useEffect(() => {
    if (serviceTypes.length > 0 && !activeServiceType) {
      setActiveServiceType(serviceTypes[0].id);
    }
  }, [serviceTypes, activeServiceType]);
  
  // Update location when client-side detection completes
  useEffect(() => {
    if (!isLocating) {
      let locationName = '';
      let locationSlug = '';

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
      });
    }
  }, [isLocating, clientLocation, serverLocation]);
  
  // Get active service type data
  const activeServiceTypeData = serviceTypes.find(type => type.id === activeServiceType);
  
  // Get color for service type
  const getServiceTypeColor = (serviceTypeId: string): string => {
    const colorMap: {[key: string]: string} = {
      'maintenance': 'bg-blue-600',
      'repairs': 'bg-red-600',
      'inspections': 'bg-green-600',
      'emergency': 'bg-orange-600',
      'installations': 'bg-purple-600',
    };
    
    return colorMap[serviceTypeId] || 'bg-navy';
  };
  
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Type Navigation Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            {serviceTypes.map((serviceType) => (
              <button
                key={serviceType.id}
                onClick={() => setActiveServiceType(serviceType.id)}
                className={`px-5 py-3 rounded-lg flex items-center transition-all ${
                  activeServiceType === serviceType.id 
                    ? 'bg-red text-white shadow-lg' 
                    : 'bg-navy-light hover:bg-navy-light/80 text-ivory'
                }`}
              >
                <span className="mr-2 text-xl">{serviceType.icon}</span>
                <span className="font-medium">{serviceType.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Active Service Type Content */}
        {activeServiceTypeData && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <SectionHeading
                title={activeServiceTypeData.name}
                subtitle={`Professional ${activeServiceTypeData.name.toLowerCase()} for all your HVAC systems.`}
                size="md"
              />
            </div>
            
            {/* Systems List */}
            <div className="space-y-8">
              {category.systems.map((system) => {
                // Find this service type within the current system
                const serviceType = system.serviceTypes.find(type => type.id === activeServiceType);
                
                // Only render if this system has the active service type
                if (!serviceType) return null;
                
                return (
                  <div key={system.id} className="bg-navy-light/20 border border-ivory/10 rounded-lg overflow-hidden">
                    {/* System Header */}
                    <div className="bg-navy-light p-4 flex items-center">
                      <div className="flex items-center">
                        <span className="w-10 h-10 flex items-center justify-center bg-navy rounded-full mr-3 text-xl">{system.icon}</span>
                        <h3 className="text-xl font-bold text-white">{system.name} {activeServiceTypeData.name}</h3>
                      </div>
                    </div>
                    
                    {/* Service Type Description */}
                    {serviceType.description && (
                      <div className="p-4 pb-2 border-b border-navy-light/30">
                        <p className="text-ivory/80">{serviceType.description}</p>
                      </div>
                    )}
                    
                    {/* Service Items Grid */}
                    <div className="p-4">
                      {serviceType.items && serviceType.items.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {serviceType.items.map((item) => (
                            <li key={item.id}>
                              <Link 
                                href={`/services2/${category.id}/${system.id}/${serviceType.id}/${item.id}/${combinedLocation.slug}`}
                                className="flex items-center p-3 rounded-md bg-navy-light/30 hover:bg-red/10 border border-ivory/5 hover:border-red/30 group transition-all h-full"
                              >
                                <span className="w-10 h-10 flex items-center justify-center bg-navy rounded-full mr-3 text-xl group-hover:scale-110 transition-transform">
                                  {item.icon}
                                </span>
                                <div>
                                  <div className="font-medium text-white group-hover:text-red transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-ivory/60 group-hover:text-ivory/80 transition-colors">
                                    {system.name}
                                  </div>
                                </div>
                                <svg 
                                  className="w-5 h-5 ml-auto text-ivory/30 group-hover:text-red transition-colors group-hover:translate-x-1 transition-transform duration-200" 
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
                            href={`/services2/${category.id}/${system.id}/${serviceType.id}/general/${combinedLocation.slug}`}
                            className="inline-flex items-center bg-red hover:bg-red-dark text-white px-6 py-3 rounded-lg transition-colors"
                          >
                            <span>Schedule {system.name} {serviceType.name}</span>
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Service Type Benefits */}
            <div className="mt-12 bg-navy-light/20 border border-ivory/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-ivory mb-4 border-b border-ivory/10 pb-3">
                Why Choose Our {activeServiceTypeData.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {activeServiceType === 'maintenance' && (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Improved Efficiency</h4>
                        <p className="text-ivory/70">Regular maintenance keeps your systems running at peak efficiency, saving energy and money.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Extended Equipment Life</h4>
                        <p className="text-ivory/70">Properly maintained HVAC systems last significantly longer than neglected ones.</p>
                      </div>
                    </div>
                  </>
                )}
                
                {activeServiceType === 'repairs' && (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Same-Day Service</h4>
                        <p className="text-ivory/70">Fast response times and efficient repairs to get your comfort back quickly.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Quality Parts & Warranty</h4>
                        <p className="text-ivory/70">We use only quality replacement parts backed by solid warranties.</p>
                      </div>
                    </div>
                  </>
                )}
                
                {(activeServiceType === 'inspections' || !['maintenance', 'repairs', 'installations', 'emergency'].includes(activeServiceType)) && (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Thorough Examination</h4>
                        <p className="text-ivory/70">Comprehensive inspections that identify potential issues before they become major problems.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Detailed Reports</h4>
                        <p className="text-ivory/70">Clear documentation of findings with recommendations for optimal system performance.</p>
                      </div>
                    </div>
                  </>
                )}
                
                {activeServiceType === 'installations' && (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Expert Installation</h4>
                        <p className="text-ivory/70">Professional installation by certified technicians ensures optimal performance from day one.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Quick & Efficient Process</h4>
                        <p className="text-ivory/70">From selection to installation, we make the process smooth and hassle-free.</p>
                      </div>
                    </div>
                  </>
                )}
                
                {activeServiceType === 'emergency' && (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">24/7 Availability</h4>
                        <p className="text-ivory/70">Emergency service available 24 hours a day, 7 days a week, including holidays.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Rapid Response</h4>
                        <p className="text-ivory/70">Fast dispatch of technicians to your location when you need help the most.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6">
            <h3 className="text-xl font-bold text-ivory mb-4">Need service in {combinedLocation.name}?</h3>
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
    </section>
  );
}