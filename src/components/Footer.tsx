import Link from 'next/link';
import { quickLinks, legalLinks, socialPlatforms, serviceAreas, serviceCategories } from '@/data/footerData';
import { convertToLocationSlug } from '@/utils/location';

type ContactItem = {
  icon: string;
  title: string;
  content: React.ReactNode;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Contact information items
  const contactItems: ContactItem[] = [
    {
      icon: '📞',
      title: 'Phone',
      content: (
        <a href="tel:8005554822" className="text-teal-100 hover:text-white transition-colors">
          800-555-HVAC (4822)
        </a>
      )
    },
    {
      icon: '✉️',
      title: 'Email',
      content: (
        <a href="mailto:info@protechheatingandcooling.net" className="text-teal-100 hover:text-white transition-colors">
          info@protechheatingandcooling.net
        </a>
      )
    },
    {
      icon: '📍',
      title: 'Main Office',
      content: (
        <address className="text-teal-100 not-italic">
          123 Main Street<br />
          Akron, OH 44301
        </address>
      )
    },
    {
      icon: '🕒',
      title: 'Hours',
      content: (
        <p className="text-teal-100">
          Monday - Friday: 8AM - 6PM<br />
          Saturday: 9AM - 2PM<br />
          24/7 Emergency Service
        </p>
      )
    }
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">ProTech HVAC</h3>
            <p className="text-teal-100 mb-4">
              Professional heating and cooling solutions for residential and commercial customers. Serving Northeast Ohio with quality HVAC services.
            </p>
            <h4 className="font-medium text-white mb-2">Quick Links</h4>
            <ul className="space-y-1 mb-6">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-teal-200 text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-4">
              {socialPlatforms.map((platform) => (
                <a 
                  key={platform.name}
                  href={platform.url}
                  className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red hover:text-white transition-all"
                  aria-label={`Follow us on ${platform.name}`}
                >
                  <span>{platform.icon}</span>
                </a>
              ))}
            </div>
          </div>
          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Services</h3>
            {serviceCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h4 className="font-medium text-white mb-2">{category.name}</h4>
                <ul className="space-y-1">
                  {category.services.map((service) => (
                    <li key={service}>
                      <Link 
                        href={`/services/${convertToLocationSlug(category.name)}/${convertToLocationSlug(service)}/akron-oh`} 
                        className="text-teal-200 text-sm hover:text-white transition-colors"
                      >
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
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
          </div>
        </div>
        {/* Service Areas */}
        <div className="border-t border-dark-blue-light pt-8 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Our Service Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <div key={area.region}>
                <h4 className="font-medium mb-2">{area.region}</h4>
                <ul className="grid grid-cols-2 gap-1">
                  {area.cities.map((city) => (
                    <li key={city}>
                      <Link 
                        href={`/locations/${convertToLocationSlug(`${city}, OH`)}`}
                        className="text-teal-200 text-sm hover:text-white transition-colors"
                      >
                        {city}, OH
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Newsletter Signup */}
        <div className="border-t border-dark-blue-light pt-8 mb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-teal-100 mb-4">
              Sign up for our newsletter to receive seasonal tips and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg flex-1 text-gray-800"
                aria-label="Email for newsletter"
              />
              <button className="bg-red text-white hover:bg-red-dark px-6 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-dark-blue-light pt-8 flex flex-col sm:flex-row justify-between items-center text-center text-ivory/80 text-sm">
          <p> {currentYear} ProTech HVAC. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-0">
            {legalLinks.map(link => (
              <Link key={link.name} href={link.path} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}