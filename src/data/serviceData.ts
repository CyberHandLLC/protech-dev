export interface Service {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subServices?: Service[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

// Define the service categories with their respective services
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential Services',
    description: 'Complete HVAC solutions for your home',
    services: [
      {
        id: 'installations',
        name: 'Installations',
        icon: '🏠',
        description: 'Professional installation of new HVAC equipment',
        subServices: [
          { id: 'central-ac-installation', name: 'Central AC', icon: '❄️' },
          { id: 'mini-splits-installation', name: 'Mini Splits', icon: '🔄' },
          { id: 'heat-pumps-installation', name: 'Heat Pumps', icon: '♨️' },
          { id: 'furnace-installation', name: 'Furnaces', icon: '🔥' },
          { id: 'boiler-installation', name: 'Boilers', icon: '🧯' },
          { id: 'rooftop-units-installation', name: 'Rooftop Units', icon: '🏢' }
        ]
      },
      {
        id: 'maintenance',
        name: 'Maintenance',
        icon: '🛠️',
        description: 'Regular maintenance to ensure optimal performance',
        subServices: [
          { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' },
          { id: 'priority-scheduling', name: 'Priority Scheduling', icon: '⏰' }
        ]
      },
      {
        id: 'repairs',
        name: 'Repairs',
        icon: '🔧',
        description: 'Expert repair services for all HVAC systems'
      },
      {
        id: 'tune-ups',
        name: 'Tune-ups',
        icon: '📋',
        description: 'Performance optimization for your HVAC equipment',
        subServices: [
          { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' }
        ]
      },
      {
        id: 'inspections',
        name: 'Inspections',
        icon: '🔍',
        description: 'Comprehensive inspections to identify issues early'
      },
      {
        id: 'air-conditioning',
        name: 'Air Conditioning',
        icon: '❄️',
        description: 'Complete air conditioning solutions',
        subServices: [
          { id: 'central-ac', name: 'Central AC', icon: '❄️' },
          { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
          { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
        ]
      },
      {
        id: 'heating-systems',
        name: 'Heating Systems',
        icon: '🔥',
        description: 'Comprehensive heating system services',
        subServices: [
          { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
          { id: 'boilers', name: 'Boilers', icon: '🧯' },
          { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' }
        ]
      },
      {
        id: 'indoor-air-quality',
        name: 'Indoor Air Quality Solutions',
        icon: '💧',
        description: 'Improve the air quality in your home',
        subServices: [
          { id: 'air-purifiers', name: 'Air Purifiers', icon: '🌬️' },
          { id: 'humidifiers', name: 'Humidifiers', icon: '💦' },
          { id: 'dehumidifiers', name: 'Dehumidifiers', icon: '🌡️' }
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Services',
    description: 'HVAC solutions for businesses of all sizes',
    services: [
      {
        id: 'installations',
        name: 'Installations',
        icon: '🏢',
        description: 'Professional installation of commercial HVAC systems',
        subServices: [
          { id: 'commercial-ac-installation', name: 'Commercial AC', icon: '❄️' },
          { id: 'refrigeration-system-installation', name: 'Refrigeration Systems', icon: '🧊' },
          { id: 'data-center-cooling-installation', name: 'Data Center Cooling', icon: '💻' },
          { id: 'rooftop-units-installation', name: 'Rooftop Units', icon: '🏢' }
        ]
      },
      {
        id: 'maintenance',
        name: 'Maintenance',
        icon: '🛠️',
        description: 'Scheduled maintenance to prevent business disruptions',
        subServices: [
          { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' },
          { id: 'priority-scheduling', name: 'Priority Scheduling', icon: '⏰' }
        ]
      },
      {
        id: 'repairs',
        name: 'Repairs',
        icon: '🔧',
        description: 'Prompt repair services for commercial HVAC equipment'
      },
      {
        id: 'tune-ups',
        name: 'Tune-ups',
        icon: '📋',
        description: 'Performance optimization for commercial systems',
        subServices: [
          { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' }
        ]
      },
      {
        id: 'inspections',
        name: 'Inspections',
        icon: '🔍',
        description: 'Detailed inspections of commercial HVAC systems'
      },
      {
        id: 'air-conditioning',
        name: 'Air Conditioning',
        icon: '❄️',
        description: 'Commercial air conditioning solutions',
        subServices: [
          { id: 'commercial-refrigeration', name: 'Commercial Refrigeration Systems', icon: '🧊' },
          { id: 'data-center-cooling', name: 'Data Center Cooling', icon: '💻' },
          { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
          { id: 'central-ac', name: 'Central AC', icon: '❄️' },
          { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
          { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
        ]
      },
      {
        id: 'heating-systems',
        name: 'Heating Systems',
        icon: '🔥',
        description: 'Commercial heating solutions',
        subServices: [
          { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
          { id: 'boilers', name: 'Boilers', icon: '🧯' },
          { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' }
        ]
      },
      {
        id: 'indoor-air-quality',
        name: 'Indoor Air Quality Solutions',
        icon: '💧',
        description: 'Improve air quality in commercial spaces',
        subServices: [
          { id: 'air-purifiers', name: 'Air Purifiers', icon: '🌬️' },
          { id: 'humidifiers', name: 'Humidifiers', icon: '💦' },
          { id: 'dehumidifiers', name: 'Dehumidifiers', icon: '🌡️' }
        ]
      }
    ]
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    description: '24/7 emergency HVAC services when you need them most',
    services: [
      { id: 'cooling-emergency', name: 'Cooling Emergencies', icon: '❄️' },
      { id: 'heating-emergency', name: 'Heating Emergencies', icon: '🔥' },
      { id: 'refrigeration-emergency', name: 'Refrigeration Breakdowns', icon: '🧊' }
    ]
  }
];

// Sample locations
export const serviceLocations = [
  'akron-oh',
  'cleveland-oh',
  'canton-oh',
];
