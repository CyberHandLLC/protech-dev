'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceFAQsProps {
  faqs: FAQ[];
  service: string;
  serviceType: string;
  location: string;
}

export default function ServiceFAQs({ faqs, service, serviceType, location }: ServiceFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  if (!faqs.length) return null;
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-navy mb-6">
        Frequently Asked Questions About {service} {serviceType} in {location}
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`w-full text-left px-6 py-4 flex justify-between items-center ${
                openIndex === index ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gray-50'
              }`}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}