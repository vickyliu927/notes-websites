"use client";

import { ExamBoardItem } from '../../types/sanity';
import { urlFor } from '../../lib/sanity';
import Image from "next/image";

interface ExamBoardGridProps {
  examBoards: ExamBoardItem[];
  subjectSlug?: string;
  cloneId?: string | null;
}

export default function ExamBoardGrid({ examBoards, subjectSlug, cloneId }: ExamBoardGridProps) {
  
  // Helper function to generate the correct URL for an exam board
  const getExamBoardUrl = (examBoard: ExamBoardItem): string => {
    // If we have clone context and subject slug, use the new URL pattern
    if (cloneId && subjectSlug) {
      // Convert exam board name to slug (lowercase, replace spaces with hyphens)
      const examBoardSlug = examBoard.name.toLowerCase().replace(/\s+/g, '-');
      return `/${subjectSlug}/${examBoardSlug}`;
    }
    
    // Otherwise, use the original href from the button
    return examBoard.ctaButton?.href || '#';
  };

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {examBoards.map((examBoard, index) => {
        const logoUrl = examBoard.logo ? urlFor(examBoard.logo).width(120).height(80).fit('max').auto('format').url() : null;
        const examBoardUrl = getExamBoardUrl(examBoard);
        
        return (
          <div 
            key={index} 
            className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-300 w-80 max-w-sm"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              {logoUrl ? (
                <Image 
                  src={logoUrl}
                  alt={examBoard.logo?.alt || examBoard.name}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">{examBoard.name}</span>
                </div>
              )}
            </div>

            {/* Exam Board Name */}
            <h3 className="text-2xl font-bold mb-2" style={{color: '#243b53'}}>
              {examBoard.name}
            </h3>

            {/* Full Name (if provided) */}
            {examBoard.fullName && (
              <p className="text-sm text-gray-500 mb-4">{examBoard.fullName}</p>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {examBoard.description}
            </p>

            {/* Additional Info (if provided) */}
            {examBoard.additionalInfo && (
              <p className="text-sm text-blue-600 mb-6 font-medium">
                {examBoard.additionalInfo}
              </p>
            )}

            {/* CTA Button */}
            <div className="mt-6">
              <a 
                href={examBoardUrl}
                target={cloneId && subjectSlug ? "_self" : "_blank"}
                rel={cloneId && subjectSlug ? undefined : "noopener noreferrer"}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
              >
                {examBoard.ctaButton?.text || 'View Resources'}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
} 