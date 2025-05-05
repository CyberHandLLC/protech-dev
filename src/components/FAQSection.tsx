'use client';

import { useState } from 'react';
import FAQSchema from './schema/FAQSchema';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  mainEntity?: string;
  className?: string;
}

/**
 * FAQ Section Component
 * 
 * Displays frequently asked questions in an accessible, expandable format
 * Also includes structured data for SEO using FAQSchema
 */
export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle,
  mainEntity = 'HVAC Services',
  className = ''
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      {/* Include the schema markup for SEO */}
      <FAQSchema faqs={faqs} mainEntity={mainEntity} />
      
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-red mx-auto mb-3"></div>
            <span className="text-red-light uppercase text-sm tracking-wider font-medium">Get Answers</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-ivory/80 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        
        {/* FAQ accordions */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-navy-light rounded-lg overflow-hidden bg-navy shadow-sm"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-navy-light transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-white">{faq.question}</span>
                <span className={`text-red transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>
              
              <div 
                id={`faq-answer-${index}`}
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}
                aria-hidden={openIndex !== index}
              >
                <div className="text-ivory/90 text-sm md:text-base">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
