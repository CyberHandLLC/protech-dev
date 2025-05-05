'use client';

type ServiceCategory = 'residential' | 'commercial' | 'emergency';
type SystemType = 'air_conditioning' | 'heating' | 'air_quality' | 'refrigeration';
type ServiceType = 'installation' | 'repair' | 'maintenance' | 'inspection' | 'emergency';

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  serviceArea?: string;
  serviceCategory?: ServiceCategory;
  systemType?: SystemType;
  serviceType?: ServiceType;
  imageUrl?: string;
  url?: string;
}

/**
 * Service Schema Component
 * 
 * Adds structured data for individual HVAC services
 * This helps search engines understand service details which can improve visibility
 * for specific services like AC repair, furnace installation, etc.
 */
export default function ServiceSchema({
  name,
  description,
  provider = 'ProTech HVAC',
  serviceArea = 'Northeast Ohio',
  serviceCategory = 'residential',
  systemType = 'air_conditioning',
  serviceType = 'installation',
  imageUrl = '/images/service-default.jpg',
  url = '',
}: ServiceSchemaProps) {
  // Get all available HVAC services from our service catalog
  const hvacServices = getHvacServiceCatalog();
  
  // Map service category to schema audience type
  const audienceType = serviceCategory === 'residential' ? 
    'Residential property owners' : 
    serviceCategory === 'commercial' ? 
      'Commercial property owners and businesses' : 
      'Residential and Commercial property owners';
  
  // More specific service type based on parameters
  const specificServiceType = formatServiceType(serviceCategory, systemType, serviceType);
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": provider,
      "priceRange": "$$"
    },
    "areaServed": serviceArea,
    "audience": {
      "@type": "Audience",
      "audienceType": audienceType
    },
    "serviceType": specificServiceType,
    "termsOfService": "https://protech-ohio.com/terms",
    "serviceOutput": getServiceOutputs(systemType, serviceType),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HVAC Services",
      "itemListElement": hvacServices
    },
    // Include image if provided
    ...(imageUrl && {
      "image": imageUrl.startsWith('http') ? imageUrl : `https://protech-ohio.com${imageUrl}`
    }),
    // Include URL if provided
    ...(url && {
      "url": url.startsWith('http') ? url : `https://protech-ohio.com${url}`
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

/**
 * Returns the complete service catalog for ProTech HVAC
 * Based on the Services-ProTech.txt file
 */
function getHvacServiceCatalog() {
  return [
    // Residential Services
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential HVAC Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential HVAC Maintenance",
        "serviceType": "Maintenance"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential HVAC Repairs",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Central AC Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Central AC Repair",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Mini Split Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Mini Split Repair",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Heat Pump Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Heat Pump Repair",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Furnace Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Furnace Repair",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Boiler Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Boiler Repair",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Air Purifier Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Humidifier Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Residential Dehumidifier Installation",
        "serviceType": "Installation"
      }
    },
    // Commercial Services
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial HVAC Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial HVAC Maintenance",
        "serviceType": "Maintenance"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial HVAC Repairs",
        "serviceType": "Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial Refrigeration Systems",
        "serviceType": "Installation and Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Data Center Cooling Solutions",
        "serviceType": "Installation and Maintenance"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial Rooftop Unit Installation",
        "serviceType": "Installation"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial Rooftop Unit Repair",
        "serviceType": "Repair"
      }
    },
    // Emergency Services
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "24/7 Emergency HVAC Services",
        "serviceType": "Emergency Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Emergency Cooling Repair",
        "serviceType": "Emergency Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Emergency Heating Repair",
        "serviceType": "Emergency Repair"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Emergency Refrigeration Repair",
        "serviceType": "Emergency Repair"
      }
    }
  ];
}

/**
 * Formats service type into a more specific string for schema
 */
function formatServiceType(serviceCategory: ServiceCategory, systemType: SystemType, serviceType: ServiceType): string {
  return `${capitalize(serviceCategory)} ${formatSystemType(systemType)} ${serviceType}`;
}

/**
 * Format system type for display
 */
function formatSystemType(systemType: SystemType): string {
  switch(systemType) {
    case 'air_conditioning': return 'Air Conditioning';
    case 'air_quality': return 'Air Quality';
    default: return capitalize(systemType);
  }
}

/**
 * Helper to capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get service outputs based on service type
 */
function getServiceOutputs(systemType: SystemType, serviceType: ServiceType): string {
  if (serviceType === 'installation') {
    switch(systemType) {
      case 'air_conditioning': return 'Functioning air conditioning system, improved comfort, energy efficiency';
      case 'heating': return 'Functioning heating system, improved comfort, energy efficiency';
      case 'air_quality': return 'Improved air quality, reduced allergens, healthier breathing environment';
      case 'refrigeration': return 'Functioning refrigeration system, safe food storage, energy efficiency';
      default: return 'Properly installed HVAC system';
    }
  } else if (serviceType === 'repair') {
    return 'Restored HVAC system functionality, improved performance';
  } else if (serviceType === 'maintenance') {
    return 'Extended equipment lifespan, improved efficiency, reduced breakdown risk';
  } else if (serviceType === 'emergency') {
    return 'Rapid restoration of HVAC functionality, minimized downtime';
  } else {
    return 'Professional HVAC services';
  }
}
