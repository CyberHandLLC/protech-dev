interface FAQ {
  question: string;
  answer: string;
}

// This utility generates contextual FAQs based on service, service type, and location
export function generateFAQs(system: string, serviceType: string, itemName: string, location: string): FAQ[] {
  // Base FAQs for all services
  const baseFAQs: FAQ[] = [
    {
      question: `How much does ${itemName} ${serviceType.toLowerCase()} cost in ${location}?`,
      answer: `The cost of ${itemName} ${serviceType.toLowerCase()} in ${location} depends on several factors including the scope of work, equipment specifications, and any additional requirements. We provide free, detailed quotes tailored to your specific needs. Contact us for a personalized estimate.`
    },
    {
      question: `How long does a typical ${itemName} ${serviceType.toLowerCase()} take to complete?`,
      answer: `Most ${itemName} ${serviceType.toLowerCase()} services can be completed within 1-4 hours, depending on the complexity of the job. For installations or major repairs, it may take 1-2 days. We always provide a time estimate before beginning work.`
    }
  ];
  
  // System-specific FAQs
  const systemFAQs: Record<string, FAQ[]> = {
    cooling: [
      {
        question: `What's the best time of year for cooling system ${serviceType.toLowerCase()} in ${location}?`,
        answer: `For cooling systems in ${location}, we recommend scheduling ${serviceType.toLowerCase()} in early spring (March-April), before the hot summer season begins. This ensures your system is operating efficiently when you need it most.`
      },
      {
        question: `How often should I have my ${itemName} serviced in ${location}?`,
        answer: `In ${location}'s climate, we recommend having your ${itemName} professionally serviced at least once per year, ideally before the cooling season starts. Regular maintenance extends equipment life and ensures optimal performance.`
      }
    ],
    heating: [
      {
        question: `When should I schedule heating system ${serviceType.toLowerCase()} in ${location}?`,
        answer: `The ideal time for heating system ${serviceType.toLowerCase()} in ${location} is during early fall (September-October), before the heating season begins. This ensures your system is ready for winter and helps avoid emergency service calls during cold weather.`
      },
      {
        question: `How can I tell if my ${itemName} needs repair or replacement?`,
        answer: `Signs that your ${itemName} may need repair or replacement include increased energy bills, uneven heating, unusual noises, frequent cycling, or if it's more than 15 years old. Our technicians can perform a thorough assessment to determine the best course of action.`
      }
    ],
    'indoor-air': [
      {
        question: `How can ${itemName} improve my home's air quality in ${location}?`,
        answer: `${itemName} can significantly improve your home's air quality in ${location} by removing airborne particles, allergens, and pollutants. This is especially important during high pollen seasons or if household members have allergies or respiratory conditions.`
      },
      {
        question: `How often should indoor air quality equipment be maintained?`,
        answer: `Most indoor air quality equipment should be checked and maintained every 6-12 months. Filters may need more frequent replacement depending on usage and environmental factors in ${location}.`
      }
    ]
  };
  
  // Service type specific FAQs
  const serviceTypeFAQs: Record<string, FAQ[]> = {
    maintenance: [
      {
        question: `What's included in your ${itemName} maintenance service?`,
        answer: `Our comprehensive ${itemName} maintenance includes inspection of all components, cleaning of key parts, lubrication of moving parts, testing of electrical connections, and calibration of the thermostat. We also check refrigerant levels (if applicable) and provide a detailed report of the system's condition.`
      },
      {
        question: `Do you offer maintenance plans for ${itemName} systems?`,
        answer: `Yes, we offer several maintenance plan options for ${itemName} systems that include regular scheduled service, priority scheduling, and discounts on repairs. These plans help ensure your system remains efficient and can extend its operational life.`
      }
    ],
    repairs: [
      {
        question: `Do you offer emergency repair services for ${itemName} in ${location}?`,
        answer: `Yes, we provide 24/7 emergency repair services for ${itemName} in ${location} and surrounding areas. Our technicians are always on call to address urgent heating and cooling issues to restore your comfort as quickly as possible.`
      },
      {
        question: `What warranties do you offer on ${itemName} repairs?`,
        answer: `All our ${itemName} repairs come with a 90-day warranty on labor and a manufacturer's warranty on any parts replaced. For certain major repairs, extended warranty options may be available. We stand behind the quality of our work.`
      }
    ],
    installations: [
      {
        question: `What brands of ${itemName} do you install?`,
        answer: `We install and service all major brands of ${itemName} including Carrier, Trane, Lennox, Rheem, American Standard, and many others. We can help you select the best system for your needs and budget.`
      },
      {
        question: `Do you offer financing for new ${itemName} installations?`,
        answer: `Yes, we offer flexible financing options for new ${itemName} installations with approved credit. This allows you to invest in a high-quality system with convenient monthly payments. We also help customers take advantage of manufacturer rebates and utility incentives.`
      }
    ],
    inspections: [
      {
        question: `How often should I have my ${itemName} professionally inspected?`,
        answer: `We recommend annual professional inspections for your ${itemName} to ensure optimal performance and identify potential issues early. In ${location}, this is especially important due to the seasonal temperature variations.`
      },
      {
        question: `What does a professional ${itemName} inspection include?`,
        answer: `Our professional ${itemName} inspection includes a thorough examination of all components, performance testing, efficiency evaluation, and safety checks. We provide a detailed report of findings with recommendations for any necessary maintenance or repairs.`
      }
    ],
    solutions: [
      {
        question: `How do I know which ${itemName} solution is right for my home in ${location}?`,
        answer: `Choosing the right ${itemName} for your home in ${location} depends on several factors including your specific air quality concerns, home size, existing HVAC system, and budget. Our technicians can perform an assessment and recommend the best solution for your situation.`
      },
      {
        question: `Will a ${itemName} help with allergies and asthma?`,
        answer: `Yes, a properly selected and maintained ${itemName} can significantly reduce allergens and asthma triggers in your home by filtering out particles such as pollen, dust mites, pet dander, and mold spores. This can provide substantial relief for allergy and asthma sufferers.`
      }
    ]
  };
  
  // Combine all relevant FAQs
  const allFAQs: FAQ[] = [
    ...baseFAQs,
    ...(systemFAQs[system] || []),
    ...(serviceTypeFAQs[serviceType] || [])
  ];
  
  return allFAQs;
}