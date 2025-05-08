'use client';

/**
 * LocalBusinessSchema component
 * Implements structured data (JSON-LD) for the business
 * This helps search engines understand your business information and can lead to rich search results
 */

// Define types for our data structures
type CityData = {
  city: string;
  zipCodes: string[];
};

type ServiceAreasType = {
  [key: string]: CityData[];
};

type SchemaAreaEntry = {
  "@type": string;
  "name": string;
  "addressRegion"?: string;
  "containedInPlace"?: {
    "@type": string;
    "name": string;
  };
};

export default function LocalBusinessSchema() {
  // Define service areas by county and cities
  const serviceAreas: ServiceAreasType = {
    // Summit County
    "Summit County": [
      { city: "Akron", zipCodes: ["44301", "44302", "44303", "44304", "44305", "44306", "44307", "44308", "44309", "44310", "44311", "44312", "44313", "44314", "44315", "44316", "44317", "44319", "44320", "44321", "44325", "44326", "44328", "44333", "44334", "44372", "44396", "44398"] },
      { city: "Cuyahoga Falls", zipCodes: ["44221", "44223"] },
      { city: "Stow", zipCodes: ["44224"] },
      { city: "Tallmadge", zipCodes: ["44278"] },
      { city: "Hudson", zipCodes: ["44236"] },
      { city: "Norton", zipCodes: ["44203"] },
    ],
    // Medina County
    "Medina County": [
      { city: "Medina", zipCodes: ["44256"] },
      { city: "Wadsworth", zipCodes: ["44281"] },
      { city: "Seville", zipCodes: ["44273"] },
      { city: "Brunswick", zipCodes: ["44212"] },
      { city: "Lodi", zipCodes: ["44254"] },
      { city: "Rittman", zipCodes: ["44270"] },
    ],
    // Wayne County
    "Wayne County": [
      { city: "Wooster", zipCodes: ["44691"] },
      { city: "Orrville", zipCodes: ["44667"] },
      { city: "Smithville", zipCodes: ["44677"] },
      { city: "Fredericksburg", zipCodes: ["44627"] },
      { city: "Doylestown", zipCodes: ["44230"] },
    ]
  };
  
  // Create service area entries for schema
  const areaServedEntries: SchemaAreaEntry[] = [];
  
  // Add counties
  Object.keys(serviceAreas).forEach(county => {
    areaServedEntries.push({
      "@type": "AdministrativeArea",
      "name": county,
      "addressRegion": "OH"
    });
    
    // Add cities within each county
    serviceAreas[county].forEach((cityData: CityData) => {
      areaServedEntries.push({
        "@type": "City",
        "name": cityData.city,
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": county
        }
      });
    });
  });
  
  // Create services offered list
  const servicesOffered = [
    "Residential HVAC Installation",
    "Residential HVAC Maintenance",
    "Residential HVAC Repairs",
    "Air Conditioning Installation",
    "Air Conditioning Repair",
    "Furnace Installation",
    "Furnace Repair",
    "Boiler Installation",
    "Boiler Repair",
    "Heat Pump Installation",
    "Heat Pump Repair",
    "Mini Split Installation",
    "Mini Split Repair",
    "Indoor Air Quality Solutions",
    "Air Purifier Installation",
    "Humidifier Installation",
    "Dehumidifier Installation",
    "Commercial HVAC Installation",
    "Commercial HVAC Maintenance",
    "Commercial HVAC Repairs",
    "Commercial Refrigeration",
    "Data Center Cooling",
    "Rooftop Unit Installation",
    "Rooftop Unit Repair",
    "24/7 Emergency HVAC Services"
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "ProTech HVAC",
    "url": "https://protech-ohio.com",
    "logo": "https://protech-ohio.com/images/logo-protech.png",
    "image": "https://protech-ohio.com/images/service-truck.jpg",
    "description": "Professional heating, cooling, and air quality services throughout Northeast Ohio. Family-owned HVAC service with expert technicians.",
    "telephone": "330-642-HVAC",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": areaServedEntries,
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 41.0814,
        "longitude": -81.5190
      },
      "geoRadius": "80000" // 80km radius in meters - covers all service areas
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HVAC Services",
      "itemListElement": servicesOffered.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service
        }
      }))
    },
    "sameAs": [
      "https://www.facebook.com/people/Pro-Tech-Heating-Cooling-LLC/61555139044123/",
      "https://www.instagram.com/protechohio/",
      "https://www.yelp.com/biz/protech-heating-and-cooling-orrville",
      "https://g.co/kgs/NRw5p2E"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
