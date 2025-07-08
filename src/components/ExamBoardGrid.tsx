"use client";

import { ExamBoardItem } from '../../types/sanity';
import { urlFor } from '../../lib/sanity';
import Image from "next/image";

interface ExamBoardGridProps {
  examBoards: ExamBoardItem[];
}

export default function ExamBoardGrid({ examBoards }: ExamBoardGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {examBoards.map((examBoard, index) => {
        const logoUrl = examBoard.logo ? urlFor(examBoard.logo).width(120).height(80).fit('max').auto('format').url() : null;
        
        return (
          <div 
            key={index} 
            className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-300"
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
                href={examBoard.ctaButton.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
              >
                {examBoard.ctaButton.text}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
} 