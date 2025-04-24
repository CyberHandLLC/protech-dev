import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { convertToLocationSlug } from '@/utils/location';
import { getUserLocationFromHeaders } from '@/utils/serverLocation';
import ServicePageClient from '@/components/services/ServicePageClient';
import { getLocationData } from '@/data/locationData';
import { 
  generateLocationIntro,
  generateLocalizedFaqs,
  generateLocalBusinessSchema,
  generateLocationSpecificDetails,
  generateMetaDescription
} from '@/utils/dynamicContent';

// Define types for param objects
type ServiceParams = {
  category: string;
  service: string;
  location: string;
};

// Define props expected by the component
type ServicePageProps = {
  params: ServiceParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Service details data - in a real app, this would come from a database or API
const serviceData = {
  // Residential services
  'residential': {
    // Air Conditioning Services
    'air-conditioning': {
      title: 'Air Conditioning Services',
      description: 'Complete air conditioning solutions for your home',
      icon: '❄️',
      details: [
        'Installation, repair, and maintenance of all types of AC systems',
        'Central AC, mini-splits, and heat pump expertise',
        'Energy-efficient solutions to lower your cooling costs',
        'Indoor air quality improvements with your AC system',
        '24/7 emergency service for AC breakdowns'
      ],
      faqs: [
        {
          question: 'How often should I service my air conditioner?',
          answer: 'We recommend annual maintenance before the cooling season begins to ensure optimal performance, efficiency, and to extend the life of your system.'
        },
        {
          question: 'What are signs my AC needs repair?',
          answer: 'Watch for: warm air coming from vents, weak airflow, frequent cycling, unusual noises, water leaks around the unit, or high humidity in your home.'
        },
        {
          question: 'What type of AC is best for my home?',
          answer: 'This depends on several factors including your home size, layout, existing ductwork, and budget. We offer free consultations to help determine the best cooling solution for your specific needs.'
        }
      ]
    },
    // Heating Systems
    'heating-systems': {
      title: 'Heating System Services',
      description: 'Comprehensive heating solutions for your home',
      icon: '🔥',
      details: [
        'Installation and replacement of furnaces, boilers, and heat pumps',
        'Routine maintenance to ensure safe and efficient operation',
        'Prompt repair service for all makes and models',
        'Energy-efficient solutions to reduce heating costs',
        '24/7 emergency heating service'
      ],
      faqs: [
        {
          question: 'How often should I replace my furnace filter?',
          answer: 'Most 1-2 inch filters should be replaced every 1-3 months. Thicker filters (3-4 inches) can last up to 6 months. If you have pets or allergies, more frequent replacements are recommended.'
        },
        {
          question: 'What are signs my heating system needs repair?',
          answer: 'Watch for unusual noises, inconsistent heating, higher than normal energy bills, frequent cycling, or a yellow pilot light instead of blue. Cold spots in your home can also indicate distribution problems.'
        },
        {
          question: 'How long should my furnace last?',
          answer: 'With proper maintenance, most furnaces last 15-20 years. Boilers typically last 20-30 years. If your system is older than this, you may want to consider a replacement for improved efficiency and reliability.'
        }
      ]
    },
    // Installations
    'installations': {
      title: 'HVAC Installation Services',
      description: 'Professional installation of new HVAC equipment',
      icon: '🏠',
      details: [
        'Expert installation of air conditioners, furnaces, and heat pumps',
        'Proper sizing and load calculations for optimal performance',
        'Complete system replacements and upgrades',
        'Professional ductwork design and installation',
        'Energy-efficient options to reduce utility costs'
      ],
      faqs: [
        {
          question: 'How long does a typical HVAC installation take?',
          answer: 'Most residential installations can be completed in 1-2 days, depending on the complexity of the system and whether ductwork modifications are needed.'
        },
        {
          question: 'Are there any rebates or tax credits available for new installations?',
          answer: 'Yes, many energy-efficient systems qualify for utility rebates and federal tax credits. We can help identify all available incentives during your consultation.'
        },
        {
          question: 'What brands do you install?',
          answer: 'We install all major brands including Carrier, Trane, Lennox, Rheem, and more. We can recommend the best options based on your specific needs and budget.'
        }
      ]
    },
    // Maintenance
    'maintenance': {
      title: 'HVAC Maintenance Services',
      description: 'Regular maintenance to ensure optimal performance',
      icon: '🛠️',
      details: [
        'Seasonal tune-ups for both heating and cooling systems',
        'Comprehensive maintenance plans with priority scheduling',
        'Filter replacements and system cleaning',
        'Performance testing and safety inspections',
        'Preventive care to extend equipment life and prevent breakdowns'
      ],
      faqs: [
        {
          question: 'What does a maintenance visit include?',
          answer: 'Our comprehensive maintenance includes cleaning components, checking electrical connections, lubricating moving parts, inspecting safety controls, and testing system operation. We also check refrigerant levels for cooling systems.'
        },
        {
          question: 'How often should I schedule maintenance?',
          answer: 'We recommend twice-yearly maintenance – once before cooling season and once before heating season – to ensure your systems operate efficiently year-round.'
        },
        {
          question: 'What are the benefits of a maintenance plan?',
          answer: 'Our maintenance plans include priority scheduling, discounts on repairs, no overtime charges for emergency service, and regular reminders to ensure your system stays in top condition.'
        }
      ]
    },
    // Repairs
    'repairs': {
      title: 'HVAC Repair Services',
      description: 'Expert repair services for all HVAC systems',
      icon: '🔧',
      details: [
        'Diagnosis and repair of all makes and models',
        'Emergency repair services available 24/7',
        'Upfront pricing with no hidden fees',
        'Certified technicians with years of experience',
        'Fully stocked service vehicles for faster repairs'
      ],
      faqs: [
        {
          question: 'How quickly can you respond to a repair call?',
          answer: 'We offer same-day service for most repair calls, and our emergency service is available 24/7 for urgent situations.'
        },
        {
          question: 'Do you provide warranties on repairs?',
          answer: 'Yes, all of our repairs come with a satisfaction guarantee and parts warranty to ensure your peace of mind.'
        },
        {
          question: 'How can I avoid needing repairs?',
          answer: 'Regular maintenance is the best way to prevent unexpected breakdowns. Our maintenance plans help catch small issues before they become major problems.'
        }
      ]
    },
    // Indoor Air Quality
    'indoor-air-quality': {
      title: 'Indoor Air Quality Solutions',
      description: 'Improve the air quality in your home',
      icon: '💧',
      details: [
        'Air purification systems to remove contaminants',
        'Humidifiers and dehumidifiers for optimal moisture levels',
        'Ventilation solutions for fresh air exchange',
        'Duct cleaning and sanitizing services',
        'Allergen reduction strategies for healthier living'
      ],
      faqs: [
        {
          question: 'How can I tell if I have poor indoor air quality?',
          answer: 'Common signs include excessive dust, lingering odors, stuffiness, mold growth, and increased allergy symptoms. We offer indoor air quality testing to identify specific issues.'
        },
        {
          question: 'Will improving my air quality reduce my energy bills?',
          answer: 'Yes, proper humidity control and clean air handling systems can improve HVAC efficiency, potentially reducing energy consumption and extending equipment life.'
        },
        {
          question: 'What types of air purification systems do you offer?',
          answer: 'We provide whole-home air purifiers, UV light systems, electronic air cleaners, HEPA filtration, and activated carbon filters, each targeting different air quality concerns.'
        }
      ]
    }
  },
  
  // Commercial services
  'commercial': {
    // Air Conditioning
    'air-conditioning': {
      title: 'Commercial Air Conditioning Services',
      description: 'Comprehensive cooling solutions for businesses',
      icon: '❄️',
      details: [
        'Commercial refrigeration system installation and service',
        'Data center cooling solutions',
        'Rooftop unit maintenance and repair',
        'VRF/VRV system expertise',
        'Energy management and optimization'
      ],
      faqs: [
        {
          question: 'How can we reduce our cooling costs?',
          answer: 'We offer energy audits, programmable thermostat installation, preventive maintenance plans, and can recommend energy-efficient upgrades to reduce operational costs.'
        },
        {
          question: 'What cooling systems work best for retail spaces?',
          answer: 'Retail environments often benefit from rooftop packaged units or split systems that provide efficient zone control for customer and stock areas with different needs.'
        },
        {
          question: 'How do you handle data center cooling?',
          answer: 'We specialize in precision cooling systems for data centers including CRAC/CRAH units, in-row cooling, and hot/cold aisle configurations to maintain optimal operating temperatures.'
        }
      ]
    },
    // Heating Systems
    'heating-systems': {
      title: 'Commercial Heating Services',
      description: 'Heating solutions for commercial buildings',
      icon: '🔥',
      details: [
        'Commercial furnace and boiler installation',
        'Rooftop unit service and replacement',
        'Radiant heating systems for warehouses',
        'Infrared heating solutions',
        'Building automation integration'
      ],
      faqs: [
        {
          question: 'What heating system is most efficient for our warehouse?',
          answer: 'For large, open warehouses, infrared tube heaters or unit heaters are often most efficient as they heat objects rather than all the air in the space.'
        },
        {
          question: 'How often should commercial heating systems be serviced?',
          answer: 'We recommend quarterly maintenance for systems that run continuously and bi-annual service for less intensive applications to ensure reliability and efficiency.'
        },
        {
          question: 'Can you integrate our heating system with our building management system?',
          answer: 'Yes, we specialize in integrating HVAC controls with building automation systems to optimize performance, scheduling, and energy usage.'
        }
      ]
    },
    // Maintenance
    'maintenance': {
      title: 'Commercial HVAC Maintenance',
      description: 'Preventive maintenance programs for businesses',
      icon: '🛠️',
      details: [
        'Customized maintenance plans for all system types',
        'After-hours service to minimize business disruption',
        'Detailed documentation for compliance requirements',
        'Filter replacement programs',
        'Long-term equipment lifecycle management'
      ],
      faqs: [
        {
          question: 'Can you schedule maintenance around our business hours?',
          answer: 'Yes, we offer flexible scheduling including evenings and weekends to minimize disruption to your operations.'
        },
        {
          question: 'Do you provide documentation for regulatory compliance?',
          answer: 'We provide detailed maintenance records and certification to help satisfy health department, insurance, and building code requirements.'
        },
        {
          question: 'What\'s included in your commercial maintenance plans?',
          answer: 'Our plans can be customized to your needs but typically include regular inspections, preventive maintenance, priority emergency service, and discounted repairs.'
        }
      ]
    }
  },
  
  // Emergency Services
  'emergency': {
    'cooling-emergency': {
      title: 'Emergency Cooling Services',
      description: '24/7 emergency service for cooling system failures',
      icon: '❄️',
      details: [
        'Round-the-clock emergency response',
        'Same-day service in most cases',
        'Temporary cooling solutions available',
        'Fast repairs for all makes and models',
        'Priority service for maintenance plan customers'
      ],
      faqs: [
        {
          question: 'How quickly can you respond to an AC emergency?',
          answer: 'We dispatch technicians immediately for emergency calls and typically arrive within 2-4 hours, often sooner.'
        },
        {
          question: 'What should I do while waiting for a technician?',
          answer: 'Turn off your system to prevent further damage, close blinds to reduce heat gain, and use fans if possible to circulate air.'
        },
        {
          question: 'Do you charge extra for emergency service?',
          answer: 'Standard emergency rates apply for after-hours service, but maintenance plan customers receive discounted or waived emergency fees depending on their plan.'
        }
      ]
    },
    'heating-emergency': {
      title: 'Emergency Heating Services',
      description: '24/7 emergency service for heating system failures',
      icon: '🔥',
      details: [
        'Emergency furnace and boiler repairs',
        'Carbon monoxide leak detection',
        'No-heat emergency response',
        'Temporary heating solutions',
        'Weekend and holiday service availability'
      ],
      faqs: [
        {
          question: 'What should I do if I smell gas?',
          answer: 'Leave your home immediately, call your gas utility from a safe location, then contact us for emergency service.'
        },
        {
          question: 'How long will it take to fix my heating system?',
          answer: 'Many heating repairs can be completed in a single visit as our trucks are stocked with commonly needed parts. For uncommon parts, we can often source them within 24 hours.'
        },
        {
          question: 'Can you provide temporary heat if my system can\'t be fixed immediately?',
          answer: 'Yes, we can recommend safe temporary heating options and in some cases provide portable heaters until your system can be repaired.'
        }
      ]
    }
  }
};

/**
 * Generate metadata for the page based on URL parameters
 */
export async function generateMetadata(
  { params }: { params: ServiceParams }
): Promise<Metadata> {
  const { category, service, location } = params;
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if service doesn't exist
  if (!serviceInfo) {
    return {
      title: 'Service Not Found',
    };
  }

  // Get the user's location from server headers
  const userLocation = getUserLocationFromHeaders();
  
  // Format location for display
  // First decode any URL-encoded characters that might be in the location parameter
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  // Use user's detected location if available and param location is generic
  const finalLocation = location === 'northeast-ohio' ? userLocation.name : locationDisplay;
  
  // Generate a dynamic meta description based on location and service
  const dynamicDescription = generateMetaDescription(location, service, serviceInfo.title);

  return {
    title: `${serviceInfo.title} in ${finalLocation} | ProTech HVAC`,
    description: dynamicDescription,
    keywords: [service.replace('-', ' '), category, 'HVAC', finalLocation, 'heating and cooling', 
              getLocationData(location).county, ...getLocationData(location).weatherInfo.weatherChallenges],
  };
}



/**
 * Service details page component
 * This server component fetches the initial location and passes it to the client component
 */
export default async function ServicePage({ params }: ServicePageProps) {
  const { category, service, location } = params;
  
  // Get service info from data
  const serviceInfo = (serviceData as any)?.[category]?.[service];
  
  // Return 404 if the service doesn't exist
  if (!serviceInfo) {
    return notFound();
  }
  
  // Get the user's location from server headers
  const userLocation = getUserLocationFromHeaders();
  
  // Format location for display from URL parameter
  // First decode any URL-encoded characters that might be in the location
  let decodedLocation;
  try {
    decodedLocation = decodeURIComponent(location);
  } catch (e) {
    decodedLocation = location;
  }
  
  // Convert from slug format to readable format
  const locationDisplay = decodedLocation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  // Use user's detected location if available and param location is generic
  const serverLocation = location === 'northeast-ohio' ? userLocation.name : locationDisplay;
  
  // Get location data
  const locationData = getLocationData(location);
  
  // Create a dynamically enhanced version of the service info
  const enhancedServiceInfo = {
    ...serviceInfo,
    // Add a location-specific introduction paragraph
    locationIntro: generateLocationIntro(location, service, serviceInfo.title),
    // Create location-specific details
    details: generateLocationSpecificDetails(location, service, serviceInfo.details),
    // Create location-specific FAQs by combining standard FAQs with location-specific ones
    faqs: generateLocalizedFaqs(location, service, serviceInfo.faqs),
    // Add structured data for SEO
    structuredData: generateLocalBusinessSchema(
      service, 
      serviceInfo.title, 
      locationData.name, 
      locationData.coordinates, 
      `https://protechhvac.com/services/${category}/${service}/${location}`
    )
  };
  
  // Render the client component with the server-provided data
  return (
    <>
      {/* Add schema.org structured data for SEO */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: enhancedServiceInfo.structuredData }}
      />
      
      <ServicePageClient 
        serviceInfo={enhancedServiceInfo} 
        category={category} 
        service={service} 
        locationParam={location}
        serverLocation={serverLocation} 
      />
    </>
  );
}