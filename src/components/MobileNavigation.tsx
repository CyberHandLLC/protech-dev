import Link from 'next/link';

export default function MobileNavigation() {
  return (
    <nav className="bg-white shadow-lg shadow-dark-blue/20 rounded-t-xl border-t border-gray-200">
      <ul className="flex justify-around items-center h-16">
        {[
          { name: 'Home', path: '/', icon: '🏠' },
          { name: 'Services', path: '/services', icon: '🔧' },
          { name: 'Search', path: '/search', icon: '🔍' },
          { name: 'Contact', path: '/contact', icon: '📞' },
          { name: 'More', path: '#', icon: '•••' }
        ].map((item) => (
          <li key={item.name} className="flex-1">
            <Link href={item.path}
                  className="flex flex-col items-center justify-center h-full">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}