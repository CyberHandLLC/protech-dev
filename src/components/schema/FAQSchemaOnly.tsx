'use client';

/**
 * FAQSchemaOnly Component
 * 
 * Adds structured FAQ data for SEO benefits WITHOUT rendering any visible UI
 * This helps pages qualify for FAQ rich snippets in search results
 * while maintaining design consistency by not showing visible FAQ sections
 */

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaOnlyProps {
  faqs: FAQ[];
  mainEntity?: string;
}

export default function FAQSchemaOnly({ faqs, mainEntity = 'HVAC Services' }: FAQSchemaOnlyProps) {
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
