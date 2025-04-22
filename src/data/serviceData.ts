export interface Service {
  id: string;
  name: string;
  icon: string;
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
      { id: 'ac-repair', name: 'AC Repair', icon: '❄️' },
      { id: 'heating-services', name: 'Heating Services', icon: '🔥' },
      { id: 'air-quality', name: 'Air Quality Solutions', icon: '💧' },
      { id: 'system-replacement', name: 'System Replacement', icon: '🔄' },
      { id: 'maintenance-plans', name: 'Maintenance Plans', icon: '🛠️' },
      { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' },
      { id: 'inspections', name: 'Inspections', icon: '🔍' },

    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Services',
    description: 'HVAC solutions for businesses of all sizes',
    services: [
      { id: 'commercial-hvac', name: 'Commercial HVAC', icon: '🏢' },
      { id: 'industrial-solutions', name: 'Industrial Solutions', icon: '🏭' },
      { id: 'energy-efficiency', name: 'Energy Efficiency', icon: '📈' },
      { id: 'compliance-services', name: 'Compliance Services', icon: '📋' },
      { id: 'seasonal-tune-ups', name: 'Seasonal Tune-ups', icon: '📆' },
      { id: 'inspections', name: 'Inspections', icon: '🔍' },

    ]
  }
];

// Sample locations
export const serviceLocations = [
  'akron-oh',
  'cleveland-oh',
  'canton-oh',
];
