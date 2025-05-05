import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';

export default function SideNavigation() {
  // Define navigation items with their properties to reduce repetitive code
  const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const quickAccessItems = [
    { name: 'Emergency Service', path: '/emergency-service' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Testimonials', path: '/testimonials' }
  ];
  
  // Reusable navigation item component
  const NavItem = ({ name, path }: { name: string; path: string }) => (
    <li key={name}>
      <Link href={path} 
            className="flex items-center p-3 rounded-lg hover:bg-navy/10 transition-all text-navy hover:text-red">
        <span>{name}</span>
      </Link>
    </li>
  );
  
  return (
    <aside className="h-full bg-white shadow-lg flex flex-col border-r border-gray-100">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-2xl font-bold text-navy">ProTech HVAC</div>
        <p className="text-sm text-gray-500">Professional Heating & Cooling</p>
      </div>
      
      {/* Main Navigation Links */}
      <nav className="flex-grow py-6 px-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.name} name={item.name} path={item.path} />
          ))}
        </ul>
        
        {/* Secondary Navigation Links */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Quick Access
          </h4>
          <ul className="mt-3 space-y-1">
            {quickAccessItems.map((item) => (
              <NavItem key={item.name} name={item.name} path={item.path} />
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Location-Based Services */}
      <div className="p-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-500">Near You</h4>
        <div className="mt-2 p-3 bg-navy/5 rounded-lg hover:bg-navy/10 transition-all">
          <p className="text-sm font-medium">Akron, OH Services</p>
          <Link href="/services/residential/ac-repair/akron-oh" 
                className="text-red text-xs hover:underline flex items-center mt-1">
            AC Repair in Your Area
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="p-6 bg-navy text-ivory mt-auto">
        <p className="font-bold">Need Help?</p>
        <a href="tel:8005554822" className="text-lg text-white block mb-3">330-642-HVAC</a>
        <Button variant="primary" className="w-full text-sm" href="/contact">
          Schedule Service
        </Button>
      </div>
    </aside>
  );
}