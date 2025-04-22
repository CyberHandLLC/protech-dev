export type FooterLink = {
  name: string;
  path: string;
};

export type SocialPlatform = {
  name: string;
  icon: string;
  url: string;
};

export type ServiceArea = {
  region: string;
  cities: string[];
};

export type ServiceCategory = {
  name: string;
  services: string[];
};

// Quick links for main navigation
export const quickLinks: FooterLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Financing', path: '/financing' },
  { name: 'Careers', path: '/careers' },
  { name: 'Emergency Service', path: '/emergency-service' },
  { name: 'Contact', path: '/contact' }
];

// Legal links for bottom bar
export const legalLinks: FooterLink[] = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms-of-service' },
  { name: 'Sitemap', path: '/sitemap' }
];

// Social media platforms
export const socialPlatforms: SocialPlatform[] = [
  { name: 'Facebook', icon: 'F', url: '#' },
  { name: 'Twitter', icon: 'T', url: '#' },
  { name: 'Instagram', icon: 'I', url: '#' },
  { name: 'LinkedIn', icon: 'L', url: '#' }
];

// Service areas grouped by region
export const serviceAreas: ServiceArea[] = [
  { 
    region: 'Akron Area', 
    cities: ['Akron', 'Cuyahoga Falls', 'Stow', 'Kent', 'Green']
  },
  { 
    region: 'Cleveland Area', 
    cities: ['Cleveland', 'Parma', 'Euclid', 'Lakewood', 'Beachwood']
  },
  { 
    region: 'Canton Area', 
    cities: ['Canton', 'North Canton', 'Massillon', 'Alliance', 'Louisville']
  },
];

// Services categories
export const serviceCategories: ServiceCategory[] = [
  { 
    name: 'Residential', 
    services: ['AC Repair', 'Heating Services', 'Air Quality', 'System Replacement', 'Maintenance Plans', 'Seasonal Tune-ups', 'Inspections']
  },
  { 
    name: 'Commercial', 
    services: ['Commercial HVAC', 'Industrial Solutions', 'Energy Efficiency', 'Compliance Services', 'Seasonal Tune-ups', 'Inspections']
  },
];
