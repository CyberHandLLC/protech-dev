export type MenuItem = {
  name: string;
  href: string;
  subItems?: Array<{
    name: string;
    href: string;
  }>;
};

/**
 * Navigation menu structure
 */
export const menuItems: MenuItem[] = [
  { name: 'Home', href: '/' },
  { 
    name: 'Services', 
    href: '/services',
    subItems: [
      { name: 'Residential HVAC', href: '/services?category=residential' },
      { name: 'Commercial HVAC', href: '/services?category=commercial' }
    ]
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
