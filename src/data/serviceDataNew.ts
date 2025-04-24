export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  description?: string;
  items: ServiceItem[];
}

export interface ServiceSystem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  serviceTypes: ServiceType[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  systems: ServiceSystem[];
}

// Define the service categories with their respective systems, types and items
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    name: 'Residential Services',
    description: 'Complete HVAC solutions for your home',
    systems: [
      {
        id: 'cooling',
        name: 'Cooling',
        icon: '❄️',
        description: 'Complete air conditioning and cooling solutions',
        serviceTypes: [
          {
            id: 'maintenance',
            name: 'Maintenance/Tune-ups',
            icon: '🛠️',
            description: 'Regular maintenance to ensure optimal performance',
            items: [
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' }
            ]
          },
          {
            id: 'repairs',
            name: 'Repairs',
            icon: '🔧',
            description: 'Expert repair services for cooling systems',
            items: [
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' }
            ]
          },
          {
            id: 'inspections',
            name: 'Inspections',
            icon: '🔍',
            description: 'Thorough inspections to identify issues early',
            items: [
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' }
            ]
          },
          {
            id: 'installations',
            name: 'Installations',
            icon: '🏠',
            description: 'Professional installation of cooling equipment',
            items: [
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' }
            ]
          },
          {
            id: 'emergency',
            name: 'Emergency Services',
            icon: '🚨',
            description: '24/7 emergency cooling services',
            items: []
          }
        ]
      },
      {
        id: 'heating',
        name: 'Heating',
        icon: '🔥',
        description: 'Comprehensive heating solutions for your home',
        serviceTypes: [
          {
            id: 'maintenance',
            name: 'Maintenance/Tune-ups',
            icon: '🛠️',
            description: 'Regular maintenance to ensure optimal heating performance',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'repairs',
            name: 'Repairs',
            icon: '🔧',
            description: 'Expert repair services for heating systems',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'inspections',
            name: 'Inspections',
            icon: '🔍',
            description: 'Thorough inspections of heating systems',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'installations',
            name: 'Installations',
            icon: '🏠',
            description: 'Professional installation of heating equipment',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'thermostat', name: 'Thermostat', icon: '🌡️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'emergency',
            name: 'Emergency Services',
            icon: '🚨',
            description: '24/7 emergency heating services',
            items: []
          }
        ]
      },
      {
        id: 'indoor-air',
        name: 'Indoor Air',
        icon: '💨',
        description: 'Improve indoor air quality in your home',
        serviceTypes: [
          {
            id: 'solutions',
            name: 'Air Quality Solutions',
            icon: '💧',
            description: 'Comprehensive indoor air quality solutions',
            items: [
              { id: 'air-purifiers', name: 'Air Purifiers', icon: '🌬️' },
              { id: 'humidifiers', name: 'Humidifiers', icon: '💦' },
              { id: 'dehumidifiers', name: 'Dehumidifiers', icon: '🌡️' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Services',
    description: 'Complete HVAC solutions for your business',
    systems: [
      {
        id: 'cooling',
        name: 'Cooling',
        icon: '❄️',
        description: 'Commercial cooling and refrigeration solutions',
        serviceTypes: [
          {
            id: 'maintenance',
            name: 'Maintenance/Tune-ups',
            icon: '🛠️',
            description: 'Regular maintenance for commercial cooling systems',
            items: [
              { id: 'commercial-refrigeration', name: 'Commercial Refrigeration Systems', icon: '🧊' },
              { id: 'data-center-cooling', name: 'Data Center Cooling', icon: '💻' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
            ]
          },
          {
            id: 'repairs',
            name: 'Repairs',
            icon: '🔧',
            description: 'Expert repair services for commercial cooling',
            items: [
              { id: 'commercial-refrigeration', name: 'Commercial Refrigeration Systems', icon: '🧊' },
              { id: 'data-center-cooling', name: 'Data Center Cooling', icon: '💻' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
            ]
          },
          {
            id: 'inspections',
            name: 'Inspections',
            icon: '🔍',
            description: 'Thorough inspections of commercial cooling systems',
            items: [
              { id: 'commercial-refrigeration', name: 'Commercial Refrigeration Systems', icon: '🧊' },
              { id: 'data-center-cooling', name: 'Data Center Cooling', icon: '💻' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
            ]
          },
          {
            id: 'installations',
            name: 'Installations',
            icon: '🏠',
            description: 'Professional installation of commercial cooling equipment',
            items: [
              { id: 'commercial-refrigeration', name: 'Commercial Refrigeration Systems', icon: '🧊' },
              { id: 'data-center-cooling', name: 'Data Center Cooling', icon: '💻' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'central-ac', name: 'Central AC', icon: '❄️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' }
            ]
          },
          {
            id: 'emergency',
            name: 'Emergency Services',
            icon: '🚨',
            description: '24/7 emergency cooling and refrigeration services',
            items: []
          }
        ]
      },
      {
        id: 'heating',
        name: 'Heating',
        icon: '🔥',
        description: 'Commercial heating solutions for your business',
        serviceTypes: [
          {
            id: 'maintenance',
            name: 'Maintenance/Tune-ups',
            icon: '🛠️',
            description: 'Regular maintenance for commercial heating systems',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'repairs',
            name: 'Repairs',
            icon: '🔧',
            description: 'Expert repair services for commercial heating systems',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'inspections',
            name: 'Inspections',
            icon: '🔍',
            description: 'Thorough inspections of commercial heating systems',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'installations',
            name: 'Installations',
            icon: '🏠',
            description: 'Professional installation of commercial heating equipment',
            items: [
              { id: 'furnaces', name: 'Furnaces', icon: '🔥' },
              { id: 'boilers', name: 'Boilers', icon: '🧯' },
              { id: 'rooftop-units', name: 'Rooftop Units', icon: '🏢' },
              { id: 'heat-pumps', name: 'Heat Pumps', icon: '♨️' },
              { id: 'mini-splits', name: 'Mini Splits', icon: '🔄' }
            ]
          },
          {
            id: 'emergency',
            name: 'Emergency Services',
            icon: '🚨',
            description: '24/7 emergency heating services',
            items: []
          }
        ]
      },
      {
        id: 'indoor-air',
        name: 'Indoor Air',
        icon: '💨',
        description: 'Improve indoor air quality in commercial spaces',
        serviceTypes: [
          {
            id: 'solutions',
            name: 'Air Quality Solutions',
            icon: '💧',
            description: 'Comprehensive indoor air quality solutions for businesses',
            items: [
              { id: 'air-purifiers', name: 'Air Purifiers', icon: '🌬️' },
              { id: 'humidifiers', name: 'Humidifiers', icon: '💦' },
              { id: 'dehumidifiers', name: 'Dehumidifiers', icon: '🌡️' }
            ]
          }
        ]
      }
    ]
  }
];

// Sample locations
export const serviceLocations = [
  'akron-oh',
  'cleveland-oh',
  'canton-oh',
];