"use client";

import { useState } from "react";
import { FAQData } from '../../types/sanity';

interface FAQProps {
  faqData?: FAQData;
}

export default function FAQ({ faqData }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Fallback data if no Sanity data is provided
  const fallbackData: FAQData = {
    _id: 'fallback',
    title: 'Default FAQ',
    sectionTitle: 'Frequently Asked Questions',
    sectionDescription: 'Find answers to common questions about our CIE IGCSE study notes and platform.',
    faqs: [
      {
        question: "What subjects are covered in your CIE IGCSE study notes?",
        answer: "We cover all major CIE IGCSE subjects including Mathematics, Physics, Chemistry, Biology, English Language & Literature, History, Geography, Economics, Business Studies, Computer Science, and more. Our notes are regularly updated to match the latest syllabus requirements."
      },
      {
        question: "Are the study notes aligned with the latest CIE IGCSE syllabus?",
        answer: "Yes, all our study notes are meticulously aligned with the latest CIE IGCSE syllabus. We regularly review and update our content to ensure it meets current examination requirements and includes any syllabus changes."
      },
      {
        question: "How are the study notes structured and organized?",
        answer: "Our notes are organized by subject and then broken down into topics and subtopics following the official CIE syllabus structure. Each topic includes clear explanations, examples, diagrams, and practice questions to reinforce learning."
      },
      {
        question: "Do you provide practice questions and past papers?",
        answer: "Yes, we provide extensive practice questions for each topic, along with access to past papers and mark schemes. This helps students familiarize themselves with the exam format and practice under exam conditions."
      },
      {
        question: "Are the notes suitable for both Foundation and Higher tiers?",
        answer: "Our notes cover content for all tiers and clearly indicate which topics are relevant for Foundation, Higher, or both tiers. This ensures students focus on the appropriate content for their chosen tier."
      },
      {
        question: "How often are the study materials updated?",
        answer: "We continuously update our study materials throughout the academic year. Major updates occur when CIE releases syllabus changes, and we also make regular improvements based on student feedback and exam trends."
      },
      {
        question: "Can I access the notes offline?",
        answer: "Yes, our notes are available for download in PDF format, allowing you to study offline. We also offer a mobile-friendly web version that works well on tablets and smartphones."
      },
      {
        question: "Do you offer support for exam preparation and revision strategies?",
        answer: "Absolutely! In addition to subject-specific notes, we provide comprehensive revision guides, exam techniques, time management strategies, and tips from experienced IGCSE teachers and examiners."
      }
    ],
    contactSupport: {
      description: "Still have questions? We're here to help!",
      buttonText: "Contact Support",
      buttonLink: "mailto:support@example.com"
    }
  };

  // Use Sanity data if available, otherwise use fallback
  const data = faqData || fallbackData;

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="mb-4 font-serif"
            style={{
              fontSize: '42px',
              color: '#243b53',
              letterSpacing: '-0.01em',
              fontWeight: 600
            }}
          >
            {data.sectionTitle}
          </h2>
          <p 
            className=""
            style={{
              fontFamily: 'sans-serif',
              color: '#486581',
              fontWeight: 500,
              fontSize: '20px'
            }}
          >
            {data.sectionDescription}
          </p>
        </div>

        <div className="space-y-4">
          {data.faqs.map((item, index) => (
            <div key={index} className="card overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h4>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4 animate-slide-down">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {data.contactSupport && (data.contactSupport.description || data.contactSupport.buttonText) && (
          <div className="text-center mt-12">
            {data.contactSupport.description && (
              <p className="text-gray-600 mb-4">
                {data.contactSupport.description}
              </p>
            )}
            {data.contactSupport.buttonText && (
              <a
                href={data.contactSupport.buttonLink || '#'}
                className="px-8 py-3 inline-flex items-center gap-2 text-white rounded-lg font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#243b53' }}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {data.contactSupport.buttonText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
} 