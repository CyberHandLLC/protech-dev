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
  { name: 'Contact', path: '/contact' }
];

// Legal links for bottom bar
export const legalLinks: FooterLink[] = [
  { name: 'Copyright', path: '/' }
];

// Social media platforms
export const socialPlatforms: SocialPlatform[] = [
  { name: 'Facebook', icon: '/logos/platforms/facebook.svg', url: 'https://www.facebook.com/people/Pro-Tech-Heating-Cooling-LLC/61555139044123/' },
  { name: 'Google', icon: '/logos/platforms/google.svg', url: 'https://g.co/kgs/NRw5p2E' },
  { name: 'Instagram', icon: '/logos/platforms/instagram.svg', url: 'https://www.instagram.com/protechohio/' },
  { name: 'Yelp', icon: '/logos/platforms/yelp.svg', url: 'https://www.yelp.com/biz/protech-heating-and-cooling-orrville' }
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
