import { useState } from 'react';
import Link from 'next/link';
import * as styles from '../utils/styles';

/**
 * Service data structure
 */
interface Service {
  /** Icon representing the service (emoji) */
  icon: string;
  /** Name of the service */
  name: string;
  /** Brief description of the service */
  description: string;
}

/**
 * Available service categories and their services
 */
const services: Record<string, Service[]> = {
  residential: [
    { icon: '❄️', name: 'AC Repair', description: 'Fast, reliable air conditioner repair services' },
    { icon: '🔥', name: 'Heating Services', description: 'Furnace and heat pump maintenance and repair' },
    { icon: '💧', name: 'Air Quality', description: 'Solutions for cleaner, healthier indoor air' },
    { icon: '🔄', name: 'System Replacement', description: 'Expert installation of new HVAC systems' },
    { icon: '🛠️', name: 'Maintenance Plans', description: 'Regular service to prevent costly breakdowns' },
  ],
  commercial: [
    { icon: '🏢', name: 'Commercial HVAC', description: 'Systems for offices and retail spaces' },
    { icon: '🏭', name: 'Industrial Solutions', description: 'Heavy-duty heating and cooling systems' },
    { icon: '📈', name: 'Energy Efficiency', description: 'Reduce costs with efficient systems' },
    { icon: '📋', name: 'Compliance Services', description: 'Meet regulations with proper maintenance' },
  ],
  maintenance: [
    { icon: '📆', name: 'Seasonal Tune-ups', description: 'Prepare your system for seasonal changes' },
    { icon: '🔍', name: 'Inspections', description: 'Thorough system checks to identify issues' },

  ]
};

/**
 * Component for displaying services organized by category
 * Allows users to filter between different service types
 */
export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState('residential');
  const activeServices = services[activeTab as keyof typeof services];
  
  return (
    <section className={`${styles.section} ${styles.bgColors.white}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`${styles.heading.h2} ${styles.colors.primary} mb-2 text-center`}>
          Our Services
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Professional solutions for all your HVAC needs
        </p>
        
        {/* Service Category Tabs */}
        <CategoryTabs 
          categories={Object.keys(services)}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        {/* Service Cards */}
        <div className={styles.grid.cols3}>
          {activeServices.map((service) => (
            <ServiceCard 
              key={service.name}
              service={service}
              category={activeTab}
            />
          ))}
        </div>
        
        {/* Mobile Indicators */}
        <MobileIndicators count={3} activeIndex={0} />
      </div>
    </section>
  );
}

/**
 * Category tabs component for filtering services
 */
interface CategoryTabsProps {
  categories: string[];
  activeTab: string;
  onChange: (category: string) => void;
}

function CategoryTabs({ categories, activeTab, onChange }: CategoryTabsProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
      <div className="flex space-x-2 mx-auto" role="tablist">
        {categories.map((category) => {
          const isActive = activeTab === category;
          const displayName = category.charAt(0).toUpperCase() + category.slice(1);
          
          return (
            <button 
              key={category}
              className={`px-6 py-3 text-sm font-medium rounded-full whitespace-nowrap ${
                isActive
                  ? `${styles.bgColors.primary} ${styles.colors.light}`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => onChange(category)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${category}-panel`}
              id={`${category}-tab`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Individual service card component
 */
interface ServiceCardProps {
  service: Service;
  category: string;
}

function ServiceCard({ service, category }: ServiceCardProps) {
  return (
    <div 
      className={`${styles.card} bg-ivory ${styles.hover.grow}`}
      role="tabpanel"
      id={`${category}-panel`}
    >
      <div className="text-3xl mb-3" aria-hidden="true">{service.icon}</div>
      <h3 className={`${styles.heading.h4} mb-2 ${styles.colors.primary}`}>
        {service.name}
      </h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <Link 
        href={`/services/${category}/${service.name.toLowerCase().replace(/\s+/g, '-')}/akron-oh`}
        className={`${styles.colors.secondary} font-medium inline-flex items-center group`}
        aria-label={`Learn more about ${service.name}`}
      >
        Learn More
        <svg 
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

/**
 * Mobile indicators component for pagination
 */
interface MobileIndicatorsProps {
  count: number;
  activeIndex: number;
}

function MobileIndicators({ count, activeIndex }: MobileIndicatorsProps) {
  return (
    <div className="flex justify-center mt-6 md:hidden">
      <div className="flex space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${
              index === activeIndex 
                ? styles.bgColors.primary 
                : 'bg-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}