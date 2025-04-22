import Link from 'next/link';
import { Service } from '@/data/serviceData';

export default function ServiceCard({ 
  service, 
  categoryId, 
  locations 
}: { 
  service: Service; 
  categoryId: string; 
  locations: string[] 
}) {
  return (
    <div className="bg-gradient-to-br from-dark-blue-light to-dark-blue h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1 border border-dark-blue-light/30 relative group">
      {/* Diagonal accent ribbon */}
      <div className="absolute -right-12 top-6 bg-red shadow-lg transform rotate-45 w-40 h-5 z-10"></div>
      
      <div className="p-6">
        {/* Icon in a styled circle */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-light to-dark-blue-light flex items-center justify-center mb-5 border-2 border-red/20 shadow-lg">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red transition-colors">{service.name}</h3>
        
        <div className="mt-4 border-t border-dark-blue-light/50 pt-4">
          <p className="text-sm text-ivory/80 mb-2">Available in:</p>
          <ul className="space-y-1.5">
            {locations.map((location) => {
              const formattedLocation = location
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
                
              return (
                <li key={location}>
                  <Link 
                    href={`/services/${categoryId}/${service.id}/${location}`} 
                    className="block text-sm text-red-light hover:text-red hover:pl-1 transition-all"
                  >
                    <span className="inline-block mr-1.5">→</span>{formattedLocation}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
