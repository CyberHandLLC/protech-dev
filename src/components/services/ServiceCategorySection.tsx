import { ServiceCategory } from '@/data/serviceData';
import ServiceCard from './ServiceCard';

export default function ServiceCategorySection({ 
  category, 
  locations 
}: { 
  category: ServiceCategory; 
  locations: string[] 
}) {
  return (
    <section id={category.id} className="bg-dark-blue rounded-xl shadow-lg overflow-hidden border border-dark-blue-light/30">
      <div className="bg-navy p-6 sm:p-8 relative">
        {/* Red accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red"></div>
        
        <h2 className="text-2xl font-bold text-white mt-2">{category.name}</h2>
        <p className="text-ivory/80 mt-2">{category.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-6 md:p-8">
        {category.services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            categoryId={category.id} 
            locations={locations} 
          />
        ))}
      </div>
    </section>
  );
}
