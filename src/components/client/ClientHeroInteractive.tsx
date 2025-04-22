'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { convertToLocationSlug } from '@/utils/location';

// Client component for ONLY the interactive elements in the Hero Section
// This properly implements the Next.js server/client boundary pattern to reduce TBT

interface ClientHeroInteractiveProps {
  location: string;
}

export default function ClientHeroInteractive({ location }: ClientHeroInteractiveProps) {
  const router = useRouter();
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    issue: 'repair'
  });
  
  // Fetch weather data only on the client
  useEffect(() => {
    // Implement as a microtask to avoid blocking the main thread
    const getWeatherData = async () => {
      try {
        // Only attempt weather lookup if browser APIs are available
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          // Delay non-critical API call to improve TBT
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Simulate weather API call - in a real app, fetch from a weather API
          const mockTemp = Math.floor(Math.random() * 30) + 50; // 50-80°F
          setCurrentTemp(mockTemp);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use requestIdleCallback for non-critical tasks to improve TBT
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        getWeatherData();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(getWeatherData, 100);
    }
    
    // Cleanup to prevent memory leaks
    return () => {
      // Any cleanup needed
    };
  }, [location]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of sending API request directly, queue it to avoid blocking main thread
    setTimeout(() => {
      // Form submission logic here
      console.log('Emergency service requested:', formData);
      setIsFormOpen(false);
      // Show success message or redirect
    }, 0);
  };
  
  return (
    <div className="relative">
      {/* Weather display - client-side only */}
      <div className="bg-navy-light p-4 rounded-lg shadow-md mb-6">
        {isLoading ? (
          <div className="flex items-center space-x-2 h-8 animate-pulse">
            <div className="w-8 h-8 bg-slate-300/20 rounded-full"></div>
            <div className="h-4 bg-slate-300/20 rounded w-24"></div>
          </div>
        ) : currentTemp ? (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <div>
              <p className="text-white font-medium">Current Temperature</p>
              <p className="text-white/70 text-sm">{currentTemp}°F in {location}</p>
            </div>
          </div>
        ) : (
          <div className="text-white/70 text-sm">Weather data unavailable</div>
        )}
      </div>
      
      {/* Emergency service request form - interactive client component */}
      <div className="bg-navy-light rounded-lg overflow-hidden shadow-lg">
        <div className="bg-red p-4">
          <h3 className="text-xl font-bold text-white">Emergency Service</h3>
          <p className="text-white/90 text-sm">24/7 response for urgent HVAC issues</p>
        </div>
        
        {!isFormOpen ? (
          <div className="p-6">
            <p className="text-ivory/80 mb-6">
              Need immediate assistance with your heating or cooling system?
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-red hover:bg-red-dark text-white py-3 rounded font-medium transition-colors"
            >
              Request Emergency Service
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-ivory/90 mb-2 text-sm">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-navy-dark border border-navy-light-300 text-white"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-ivory/90 mb-2 text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-navy-dark border border-navy-light-300 text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="issue" className="block text-ivory/90 mb-2 text-sm">
                Issue Type
              </label>
              <select
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-navy-dark border border-navy-light-300 text-white"
              >
                <option value="repair">Repair</option>
                <option value="noHeat">No Heat</option>
                <option value="noCooling">No Cooling</option>
                <option value="leak">Water Leak</option>
                <option value="noise">Unusual Noise</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-red hover:bg-red-dark text-white py-3 rounded font-medium transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-transparent hover:bg-navy-light-300 text-white py-3 rounded font-medium border border-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
