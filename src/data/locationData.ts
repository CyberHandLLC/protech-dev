interface LocationData {
  id: string;
  name: string;
  county: string;
  zipCodes: string[];
  weatherInfo: {
    climateType: string;
    avgSummerTemp: number;
    avgWinterTemp: number;
    humidity: string;
    weatherChallenges: string[];
  };
  hvacChallenges: string[];
  commonServiceIssues: {
    [serviceType: string]: string[];
  };
  localRegulations: string[];
  faqAdditions: {
    [serviceType: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
  introTemplate: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Create a database of locations with HVAC-specific information
const locationDatabase: { [key: string]: LocationData } = {
  'akron-oh': {
    id: 'akron-oh',
    name: 'Akron',
    county: 'Summit County',
    zipCodes: ['44301', '44302', '44303', '44304', '44305', '44306', '44307', '44308', '44310', '44311', '44312', '44313', '44314', '44319', '44320'],
    weatherInfo: {
      climateType: 'Humid Continental',
      avgSummerTemp: 82,
      avgWinterTemp: 24,
      humidity: 'High',
      weatherChallenges: ['Heavy snowfall', 'Summer humidity', 'Frequent temperature fluctuations'],
    },
    hvacChallenges: [
      'Older homes with inadequate insulation',
      'High humidity in summer requiring proper air conditioning sizing',
      'Cold winters requiring reliable heating systems',
      'Varying temperature swings that stress HVAC systems'
    ],
    commonServiceIssues: {
      'air-conditioning': [
        'Undersized units struggling with high humidity',
        'Condensate drain clogs due to high humidity',
        'Refrigerant leaks in older systems'
      ],
      'heating-systems': [
        'Inefficient systems in older homes',
        'Furnace reliability during extreme cold',
        'Inadequate insulation causing temperature imbalances'
      ],
      'indoor-air-quality': [
        'Basement humidity and mold concerns',
        'Allergens from nearby industrial areas',
        'Winter dryness requiring humidification'
      ]
    },
    localRegulations: [
      'Summit County requires HVAC permits for new installations',
      'Energy efficiency requirements for new construction',
      'Licensed contractor requirements for commercial work'
    ],
    faqAdditions: {
      'air-conditioning': [
        {
          question: 'How does Akron\'s humidity affect my air conditioning needs?',
          answer: 'Akron\'s high summer humidity requires properly sized air conditioning systems with good dehumidification capabilities. An undersized system won\'t remove enough humidity, leaving your home feeling clammy, while an oversized system may cool quickly but not run long enough to dehumidify properly. Our Akron technicians specifically evaluate humidity control when recommending systems.'
        },
        {
          question: 'Are there any rebates available for energy-efficient AC systems in Summit County?',
          answer: 'Yes, Summit County residents may qualify for several energy efficiency rebates through Ohio Edison, as well as federal tax credits for high-efficiency systems. Our Akron team stays current on all local incentive programs and can help you maximize your savings when upgrading your system.'
        }
      ],
      'heating-systems': [
        {
          question: 'What heating system is best for Akron\'s cold winters?',
          answer: 'For Akron homes, we typically recommend high-efficiency gas furnaces with 95% AFUE or higher to handle our cold winters cost-effectively. For homes without natural gas access, modern heat pumps with supplemental electric heating are an excellent option. The right choice depends on your home\'s construction, existing infrastructure, and your priorities regarding initial cost versus long-term savings.'
        }
      ]
    },
    introTemplate: 'Akron residents face unique HVAC challenges due to our humid summers and frigid winters with lake effect snow. Homes in Summit County require carefully designed heating and cooling systems that can handle temperature extremes while managing humidity effectively. Our Akron-based technicians understand the specific needs of local homes, from older properties in Highland Square to newer developments in the suburbs.',
    coordinates: {
      latitude: 41.0814,
      longitude: -81.5190
    }
  },
  'cleveland-oh': {
    id: 'cleveland-oh',
    name: 'Cleveland',
    county: 'Cuyahoga County',
    zipCodes: ['44101', '44102', '44103', '44104', '44105', '44106', '44107', '44108', '44109', '44110', '44111', '44112', '44113', '44114'],
    weatherInfo: {
      climateType: 'Humid Continental',
      avgSummerTemp: 80,
      avgWinterTemp: 26,
      humidity: 'High',
      weatherChallenges: ['Lake effect snow', 'Summer humidity', 'Rapid weather changes', 'Lakefront temperature variations'],
    },
    hvacChallenges: [
      'Lake effect causing extreme temperature differences across the city',
      'Older housing stock with historical considerations',
      'High winter humidity from Lake Erie requiring proper ventilation',
      'Lakefront properties with unique heating and cooling patterns'
    ],
    commonServiceIssues: {
      'air-conditioning': [
        'Corrosion in outdoor units due to lake-effect moisture',
        'Sizing challenges due to varied microclimates across Cleveland',
        'Higher maintenance needs from salt air near the lake'
      ],
      'heating-systems': [
        'Boiler systems in older Cleveland homes needing modernization',
        'Uneven heating in homes with lake exposure',
        'Retrofitting challenges in historic districts'
      ],
      'indoor-air-quality': [
        'Increased humidity management needs near the lake',
        'Urban pollution requiring enhanced filtration',
        'Basement moisture issues common in older Cleveland homes'
      ]
    },
    localRegulations: [
      'Cleveland Housing Code requirements for heating system adequacy',
      'Historic district restrictions on exterior equipment placement',
      'City of Cleveland energy efficiency standards'
    ],
    faqAdditions: {
      'air-conditioning': [
        {
          question: 'How does living near Lake Erie affect my air conditioning needs?',
          answer: 'Lake Erie creates unique cooling challenges for Cleveland homes. Lakefront properties often experience cooler temperatures and higher humidity, which can affect AC sizing and operation. Our Cleveland technicians account for these microclimates when recommending systems, ensuring proper dehumidification without oversizing, which is particularly important for homes within a few miles of the shoreline.'
        },
        {
          question: 'Do I need special considerations for my AC unit due to Cleveland\'s weather?',
          answer: 'Cleveland\'s proximity to Lake Erie means outdoor AC units face more corrosion challenges due to higher humidity and salt air. We recommend units with corrosion-resistant coatings and more frequent preventative maintenance for Cleveland homes, especially those closer to the lake. We also ensure proper drainage systems to handle the higher condensation levels common in our area.'
        }
      ],
      'heating-systems': [
        {
          question: 'What\'s the best heating solution for older Cleveland homes?',
          answer: 'Many Cleveland homes, especially in historic neighborhoods like Tremont and Ohio City, have boiler systems. When upgrading, we can either modernize these boilers for greater efficiency or convert to forced air systems. Our Cleveland technicians specialize in designing solutions that respect architectural integrity while providing modern comfort and efficiency suitable for our lake effect winter conditions.'
        }
      ]
    },
    introTemplate: 'Cleveland homes face distinctive HVAC challenges due to Lake Erie\'s influence on our climate. From the lake effect snow that demands reliable heating to the variable summer conditions where temperatures can differ by 10 degrees between downtown and just a few miles inland, Cuyahoga County properties need specialized HVAC approaches. Our Cleveland technicians are experienced with the unique needs of homes throughout the area, from lakefront properties to historic neighborhoods.',
    coordinates: {
      latitude: 41.4993,
      longitude: -81.6944
    }
  },
  'canton-oh': {
    id: 'canton-oh',
    name: 'Canton',
    county: 'Stark County',
    zipCodes: ['44702', '44703', '44704', '44705', '44706', '44707', '44708', '44709', '44710', '44714', '44718'],
    weatherInfo: {
      climateType: 'Humid Continental',
      avgSummerTemp: 83,
      avgWinterTemp: 22,
      humidity: 'Moderate to High',
      weatherChallenges: ['Cold winters', 'Hot, humid summers', 'Occasional severe storms'],
    },
    hvacChallenges: [
      'Mix of older and newer homes with varying insulation quality',
      'Hot, humid summers requiring effective cooling and dehumidification',
      'Cold winters stressing heating systems',
      'Varied housing types from historic to modern requiring different approaches'
    ],
    commonServiceIssues: {
      'air-conditioning': [
        'Inadequate cooling in older Canton homes',
        'Efficiency challenges in historic districts',
        'Ductwork limitations in older buildings'
      ],
      'heating-systems': [
        'Aging furnaces struggling with Stark County winters',
        'Uneven heating in multi-level homes',
        'Energy efficiency concerns in older systems'
      ],
      'indoor-air-quality': [
        'Industrial area influences requiring enhanced filtration',
        'Basement moisture common in older Canton neighborhoods',
        'Allergen control needs in spring and fall'
      ]
    },
    localRegulations: [
      'Stark County building codes for HVAC installations',
      'Local energy efficiency incentives through utility providers',
      'Permit requirements for system replacements'
    ],
    faqAdditions: {
      'air-conditioning': [
        {
          question: 'How do I know if my Canton home needs ductwork modifications?',
          answer: 'Many Canton homes, especially in historic neighborhoods, have ductwork that wasn\'t designed for modern air conditioning systems. Signs you may need modifications include rooms that are consistently too hot or cold, high energy bills, or excessive dust. Our Canton technicians can perform a detailed duct inspection and testing to identify restrictions, leaks, or sizing issues specific to your home.'
        }
      ],
      'heating-systems': [
        {
          question: 'What heating options are best for older Canton homes?',
          answer: 'For Canton\'s older homes in neighborhoods like West Lawn and Crystal Park, we often recommend high-efficiency furnaces with zoning capabilities to address the uneven heating common in these properties. For historic homes with radiators, modern boiler systems provide excellent efficiency while preserving architectural elements. Our Stark County technicians have extensive experience adapting modern heating solutions to Canton\'s diverse housing stock.'
        },
        {
          question: 'Are there specific maintenance concerns for heating systems in Stark County?',
          answer: 'Canton\'s combination of cold winters and older housing stock means heating systems often work harder than in newer homes. We recommend fall tune-ups be scheduled early (September-October) for Canton homes to address any efficiency issues before the first cold snap. Our preventative maintenance includes particular attention to heat exchangers, as the cycle of expansion and contraction in our climate can lead to premature cracking.'
        }
      ]
    },
    introTemplate: 'Canton homeowners contend with distinct HVAC requirements shaped by Stark County\'s climate and diverse housing stock. From historic homes in the West Lawn district requiring specialized approaches to newer developments needing optimized efficiency, Canton properties need heating and cooling systems tailored to local conditions. Our Canton-based technicians understand how to navigate the challenges of both hot, humid summers and frigid winters that characterize our region.',
    coordinates: {
      latitude: 40.7989,
      longitude: -81.3784
    }
  }
};

// Function to get location data by ID with fallback to default location
export function getLocationData(locationId: string): LocationData {
  // Convert any URL-friendly location format
  const normalizedId = locationId.toLowerCase().replace(/\s+/g, '-');
  
  // Return the requested location data or default to Northeast Ohio
  return locationDatabase[normalizedId] || {
    id: 'northeast-ohio',
    name: 'Northeast Ohio',
    county: 'Multiple Counties',
    zipCodes: [],
    weatherInfo: {
      climateType: 'Humid Continental',
      avgSummerTemp: 81,
      avgWinterTemp: 25,
      humidity: 'Moderate to High',
      weatherChallenges: ['Cold winters', 'Humid summers', 'Lake effect weather'],
    },
    hvacChallenges: [
      'Diverse climate conditions across the region',
      'Varying home types and ages',
      'Seasonal temperature extremes'
    ],
    commonServiceIssues: {
      'air-conditioning': [
        'Sizing for humidity control',
        'Seasonal maintenance requirements',
        'Energy efficiency optimization'
      ],
      'heating-systems': [
        'Cold weather reliability',
        'Energy cost management',
        'System longevity in harsh conditions'
      ],
      'indoor-air-quality': [
        'Seasonal allergen control',
        'Winter dryness management',
        'Summer humidity control'
      ]
    },
    localRegulations: [
      'Varies by municipality',
      'Federal efficiency standards',
      'Local contractor licensing requirements'
    ],
    faqAdditions: {
      'air-conditioning': [],
      'heating-systems': [],
      'indoor-air-quality': []
    },
    introTemplate: 'Northeast Ohio experiences a full range of seasonal challenges that impact HVAC systems. From the humid summers to the frigid winters, homes in our region require versatile systems that can handle temperature extremes while providing consistent comfort year-round. Our technicians are familiar with the unique requirements of homes throughout the area.',
    coordinates: {
      latitude: 41.2528,
      longitude: -81.4233
    }
  };
}

// Function to get common HVAC issues for a specific location and service
export function getLocationServiceIssues(locationId: string, serviceId: string): string[] {
  const locationData = getLocationData(locationId);
  return locationData.commonServiceIssues[serviceId] || [];
}

// Function to get location-specific FAQs
export function getLocationFaqs(locationId: string, serviceId: string): Array<{question: string, answer: string}> {
  const locationData = getLocationData(locationId);
  return locationData.faqAdditions[serviceId] || [];
}

// Export types and functions
export type { LocationData };
export { locationDatabase };
