import Link from 'next/link';
import Image from 'next/image';
import { quickLinks, legalLinks, socialPlatforms, serviceCategories } from '@/data/footerData';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Contact information items
  const contactItems = [
    {
      icon: '📞',
      title: 'Phone',
      content: (
        <a href="tel:8005554822" className="text-ivory/90 hover:text-red-light transition-colors">
          330-642-HVAC (4822)
        </a>
      )
    },
    {
      icon: '✉️',
      title: 'Email',
      content: (
        <a href="mailto:info@protechheatingandcooling.net" className="text-ivory/90 hover:text-red-light transition-colors">
          info@protechheatingandcooling.net
        </a>
      )
    },
    {
      icon: '🕒',
      title: 'Hours',
      content: (
        <p className="text-ivory/90">
          Monday - Friday: 8AM - 6PM<br />
          Saturday: 9AM - 2PM<br />
          <span className="text-red-light">24/7 Emergency Service</span>
        </p>
      )
    }
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">ProTech HVAC</h3>
              <p className="text-ivory/80 mb-3">
                Professional heating and cooling solutions serving Northeast Ohio with quality HVAC services.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-3 mt-4">
                {socialPlatforms.map((platform) => (
                  <a 
                    key={platform.name}
                    href={platform.url}
                    className="bg-dark-blue-light w-8 h-8 rounded-full flex items-center justify-center hover:bg-red hover:text-white transition-all"
                    aria-label={`Follow us on ${platform.name}`}
                  >
                    <Image 
                      src={platform.icon}
                      alt={`${platform.name} logo`}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Newsletter (Simplified) */}
            <div className="pt-4 border-t border-dark-blue-light">
              <h4 className="font-medium mb-2">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 rounded flex-1 text-gray-800 text-sm"
                  aria-label="Email for newsletter"
                />
                <button className="bg-red text-white hover:bg-red-dark px-3 py-2 rounded font-medium transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Links & Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="text-ivory/80 hover:text-red-light transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services - Simplified */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Services</h3>
              <ul className="space-y-2">
                {serviceCategories.flatMap(category => 
                  category.services.slice(0, 5).map(service => (
                    <li key={`${category.name}-${service}`}>
                      <Link 
                        href={`/services`}
                        className="text-ivory/80 hover:text-red-light transition-colors"
                      >
                        {service}
                      </Link>
                    </li>
                  ))
                ).slice(0, 10)}
              </ul>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-4">
              {contactItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 mt-1">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Service Areas - Very Simplified */}
            <div className="mt-4 pt-4 border-t border-dark-blue-light">
              <h4 className="font-medium mb-2">Service Areas</h4>
              <p className="text-ivory/80">Proudly serving Northeast Ohio including Akron, Cleveland, Canton and surrounding communities.</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Simplified */}
        <div className="border-t border-dark-blue-light pt-4 flex flex-col sm:flex-row justify-between items-center text-ivory/70 text-sm">
          <p>© {currentYear} ProTech HVAC. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-0">
            {legalLinks.map(link => (
              <Link key={link.name} href={link.path} className="hover:text-red-light transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}