'use client';

import React, { useState } from 'react';
import { isValidZipCode, isInServiceArea, isNearServiceArea, getLocationForZipCode } from '@/utils/serviceAreaUtils';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { hashCustomerData } from '@/utils/hashCustomerData';

type CheckResult = {
  status: 'idle' | 'valid' | 'invalid' | 'nearby';
  message: string;
  county?: string;
  city?: string;
};

/**
 * ZipCodeChecker Component
 * 
 * A component that allows users to check if their ZIP code is within the
 * ProTech HVAC service area.
 */
export default function ZipCodeChecker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState<CheckResult>({ 
    status: 'idle', 
    message: '' 
  });
  const [isChecking, setIsChecking] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 5 digits and only numbers
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    
    // Reset result when input changes
    if (value !== zipCode) {
      setResult({ status: 'idle', message: '' });
    }
  };

  const checkZipCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state
    setIsChecking(true);
    
    // Simulate a brief delay for better UX
    setTimeout(async () => {
      if (!isValidZipCode(zipCode)) {
        setResult({
          status: 'invalid',
          message: 'Please enter a valid 5-digit ZIP code'
        });
        setIsChecking(false);
        return;
      }
      
      const location = getLocationForZipCode(zipCode);
      
      // Track location search event
      try {
        // Hash zip code for better Event Match Quality
        const hashedData = await hashCustomerData({
          zip: zipCode,
          city: location?.city,
          state: 'OH',
          country: 'us'
        });
        
        // Generate unique event IDs
        const locationSearchEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_location_search';
        const viewContentEventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_view_content';
        
        // Track to Meta Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          (window.fbq as any)('trackCustom', 'LocationSearch', {
            zip_code_searched: zipCode,
            search_result: isInServiceArea(zipCode) ? 'in_service_area' : isNearServiceArea(zipCode) ? 'nearby' : 'out_of_area',
            city: location?.city,
            county: location?.county
          }, {
            eventID: locationSearchEventId
          });
          
          // Track ViewContent event with hashed data for better EMQ
          (window.fbq as any)('track', 'ViewContent', {
            content_name: 'Service Area Check',
            content_category: 'location_search',
            content_type: 'service_area'
          }, {
            eventID: viewContentEventId,
            ...hashedData
          });
        }
        
        // Track to Vercel Analytics
        track('location_search', {
          zip_code: zipCode,
          result: isInServiceArea(zipCode) ? 'in_service_area' : isNearServiceArea(zipCode) ? 'nearby' : 'out_of_area',
          city: location?.city || 'unknown',
          county: location?.county || 'unknown'
        });
        
        // Track to Google Analytics via dataLayer
        if (typeof window !== 'undefined' && window.dataLayer) {
          // Track search event (GA4 recommended event)
          window.dataLayer.push({
            event: 'search',
            search_term: zipCode,
            search_result: isInServiceArea(zipCode) ? 'in_service_area' : isNearServiceArea(zipCode) ? 'nearby' : 'out_of_area',
            city: location?.city,
            county: location?.county
          });
          
          // Track view_search_results event
          window.dataLayer.push({
            event: 'view_search_results',
            search_term: zipCode,
            content_category: 'location_search',
            content_type: 'service_area'
          });
        }
        
        // Send to Conversions API
        const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1];
        const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1];
        
        fetch('/api/facebook-conversions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            events: [
              {
                event_name: 'LocationSearch',
                event_id: locationSearchEventId,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: window.location.href,
                action_source: 'website',
                user_data: {
                  ...hashedData,
                  fbp,
                  fbc
                },
                custom_data: {
                  zip_code_searched: zipCode,
                  search_result: isInServiceArea(zipCode) ? 'in_service_area' : isNearServiceArea(zipCode) ? 'nearby' : 'out_of_area',
                  city: location?.city,
                  county: location?.county
                }
              },
              {
                event_name: 'ViewContent',
                event_id: viewContentEventId,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: window.location.href,
                action_source: 'website',
                user_data: {
                  ...hashedData,
                  fbp,
                  fbc
                },
                custom_data: {
                  content_name: 'Service Area Check',
                  content_category: 'location_search',
                  content_type: 'service_area'
                }
              }
            ]
          })
        }).catch(err => console.error('[ZipCodeChecker] Conversions API error:', err));
        
        console.log('[ZipCodeChecker] Location search tracked to Pixel + Conversions API:', zipCode);
      } catch (error) {
        console.error('[ZipCodeChecker] Tracking error:', error);
      }
      
      if (isInServiceArea(zipCode)) {
        setResult({
          status: 'valid',
          message: `Great news! We provide service to your area.`,
          county: location?.county,
          city: location?.city
        });
      } else if (isNearServiceArea(zipCode)) {
        setResult({
          status: 'nearby',
          message: 'Your location may be within our service area. Please contact us to confirm availability.',
          county: location?.county,
          city: location?.city
        });
      } else {
        setResult({
          status: 'invalid',
          message: 'Sorry, your location appears to be outside our primary service area.'
        });
      }
      
      setIsChecking(false);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-r from-navy to-dark-blue-light rounded-lg overflow-hidden shadow-lg py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Check If We Service Your Area
          </h2>
          <p className="text-ivory/80 mb-6">
            Enter your ZIP code to see if you're within our Northeast Ohio service area
          </p>
          
          <form onSubmit={checkZipCode} className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
            <div className="relative flex-1 max-w-xs mx-auto sm:mx-0">
              <input
                type="text"
                value={zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                className="w-full px-4 py-3 rounded-lg text-gray-800 border-2 border-transparent focus:border-red focus:outline-none"
                aria-label="Enter your ZIP code"
              />
              {zipCode.length === 5 && isChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={zipCode.length !== 5 || isChecking}
              className="bg-red hover:bg-red-light disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200 rounded-lg px-6 py-3"
            >
              Check Availability
            </button>
          </form>
          
          {/* Result Message */}
          {result.status !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.status === 'valid' 
                ? 'bg-green-100 text-green-800' 
                : result.status === 'nearby'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">{result.message}</p>
              
              {(result.status === 'valid' || result.status === 'nearby') && result.county && (
                <p className="text-sm mt-1">
                  {result.city && result.city + ', '}{result.county} County
                </p>
              )}
              
              {result.status === 'valid' && (
                <div className="mt-3">
                  <Link 
                    href="/contact"
                    className="inline-block bg-navy hover:bg-dark-blue text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                  >
                    Schedule Service
                  </Link>
                </div>
              )}
              
              {result.status === 'nearby' && (
                <div className="mt-3">
                  <Link 
                    href="/contact"
                    className="inline-block bg-navy hover:bg-dark-blue text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              )}
              
              {result.status === 'invalid' && (
                <p className="text-sm mt-1">
                  We primarily serve a 45-mile radius around Northeast Ohio.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
