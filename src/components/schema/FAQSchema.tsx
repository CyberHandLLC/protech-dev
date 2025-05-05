'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  mainEntity?: string;
}

/**
 * FAQ Schema Component
 * 
 * Adds structured data for Frequently Asked Questions
 * This can enable FAQ rich snippets in Google search results
 * Particularly valuable for HVAC businesses where customers have common questions
 */
export default function FAQSchema({ faqs, mainEntity = 'HVAC Services' }: FAQSchemaProps) {
  // Skip rendering if no FAQs are provided
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
