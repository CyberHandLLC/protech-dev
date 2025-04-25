import Link from 'next/link';
import Image from 'next/image';

export default function MobileNavigation() {
  return (
    <>
      {/* Mobile Header Logo */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-navy py-4 px-4 flex justify-center items-center shadow-md">
        <Link href="/" aria-label="ProTech HVAC - Home">
          <div className="relative w-[180px] h-[60px] transition-all duration-300">
            <Image 
              src="/images/logo-protech.png" 
              alt="ProTech HVAC Logo" 
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>
      </div>
      {/* Add top margin to compensate for fixed header */}
      <div className="h-[76px]"></div>
    <nav className="bg-navy shadow-lg rounded-t-xl border-t border-navy-light">
      <ul className="flex justify-around items-center h-16">
        {[
          { name: 'Home', path: '/', icon: '🏠' },
          { name: 'Services', path: '/services', icon: '🔧' },
          { name: 'Search', path: '/search', icon: '🔍' },
          { name: 'Contact', path: '/contact', icon: '📞' },
          { name: 'More', path: '/about', icon: '•••' }
        ].map((item) => (
          <li key={item.name} className="flex-1">
            <Link href={item.path}
                  className="flex flex-col items-center justify-center h-full">
              <span className="text-xl text-ivory">{item.icon}</span>
              <span className="text-xs mt-1 text-ivory">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}