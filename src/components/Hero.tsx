"use client";

import { HeroData } from "../../types/sanity";

interface HeroProps {
  heroData?: HeroData;
}

// Helper function to wrap text based on character limit
const wrapText = (text: string, maxCharsPerLine: number): string => {
  if (text.length <= maxCharsPerLine) return text;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is longer than max chars, just add it
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.join('\n');
};

export default function Hero({ heroData }: HeroProps) {
  // Fallback data if no Sanity data is provided
  const fallbackData = {
    premiumTag: "Premium IGCSE Tutoring",
    sectionTitle: "Master Your",
    sectionTitleHighlighted: "IGCSE Journey",
    sectionTitleNoHighlight: "with Confidence",
    description: "Comprehensive study notes, expert tutoring, and personalized guidance to help you excel in your CIE IGCSE examinations with confidence.",
    ctaButtons: {
      primaryButton: {
        text: "Start Learning Today",
        href: "#"
      },
      secondaryButton: {
        text: "View Sample Notes",
        href: "#"
      }
    },
    statistics: {
      studentsHelped: {
        text: "Students Helped",
        stats: "500+"
      },
      subjectsCovered: {
        text: "Subjects Covered",
        stats: "15+"
      },
      successRate: {
        text: "Success Rate",
        stats: "98%"
      }
    },
    floatingCards: [
      {
        title: "Physics",
        description: "Interactive learning",
        maxCharactersPerLine: 20
      },
      {
        title: "Mathematics",
        description: "Complete notes & practice",
        maxCharactersPerLine: 25
      },
      {
        title: "Chemistry",
        description: "Lab experiments",
        maxCharactersPerLine: 15
      }
    ]
  };

  // Use Sanity data if available, otherwise use fallback
  const data = heroData || fallbackData;

  // Check if we have any CTA buttons to display
  const hasPrimaryButton = data.ctaButtons?.primaryButton?.text && data.ctaButtons?.primaryButton?.href;
  const hasSecondaryButton = data.ctaButtons?.secondaryButton?.text && data.ctaButtons?.secondaryButton?.href;
  const hasAnyButtons = hasPrimaryButton || hasSecondaryButton;

  return (
    <section className="relative py-8 sm:py-20 overflow-hidden notebook-paper">
      {/* Background with reduced orange tones and gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/25 via-white/20 to-orange-50/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100/15 via-transparent to-orange-100/15"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-gray-50/15"></div>

      {/* Floating decorative elements with gentle up and down movement */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full animate-float" style={{backgroundColor: '#E67E50', opacity: '0.08'}}></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full animate-float-delayed" style={{backgroundColor: '#E67E50', opacity: '0.06'}}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content - aligned with header logo */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Premium badge - updated color to #B14F29 - only show if premiumTag exists */}
              {data.premiumTag && (
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-semibold" style={{backgroundColor: '#fdeee6', color: '#B14F29'}}>
                <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                </svg>
                {data.premiumTag}
              </div>
              )}

              {/* Main heading - keeping highlighted text in original orange color */}
              <h1 className="font-bold leading-none font-serif" style={{fontSize: '55px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                <span className="block">{data.sectionTitle}</span>
                <span className="block">
                  <span style={{color: '#E67E50'}}>{data.sectionTitleHighlighted}</span>
                  {data.sectionTitleNoHighlight && (
                    <span> {data.sectionTitleNoHighlight}</span>
                  )}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl font-sans leading-relaxed" style={{color: '#486581', fontWeight: '500'}}>
                {data.description}
              </p>
            </div>

            {/* CTA Buttons - only show if buttons exist, adjust spacing if no buttons */}
            {hasAnyButtons && (
            <div className="flex flex-col sm:flex-row gap-4">
                {hasPrimaryButton && (
                  <a 
                    href={data.ctaButtons!.primaryButton!.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white px-8 py-3 rounded-md font-medium font-sans inline-flex items-center justify-center group transition-colors hover:opacity-90" 
                    style={{backgroundColor: '#E67E50', fontSize: '14px'}}
                  >
                    {data.ctaButtons!.primaryButton!.text}
                <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
                  </a>
                )}
                {hasSecondaryButton && (
                  <a 
                    href={data.ctaButtons!.secondaryButton!.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-slate-300 hover:bg-slate-50 px-8 py-3 rounded-md font-medium font-sans transition-colors"
                    style={{fontSize: '14px', color: '#475569'}}
                  >
                    {data.ctaButtons!.secondaryButton!.text}
                  </a>
                )}
            </div>
            )}

            {/* Statistics - adjust top margin based on whether buttons are present and only show if statistics exist */}
            {data.statistics && (
            <div className={`flex items-center gap-8 ${hasAnyButtons ? 'pt-4' : 'pt-2'}`}>
              {data.statistics.studentsHelped && (
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold" style={{color: '#243b53'}}>{data.statistics.studentsHelped.stats}</div>
                  <div className="text-sm font-sans" style={{color: '#64748b'}}>{data.statistics.studentsHelped.text}</div>
                </div>
              )}
              {data.statistics.subjectsCovered && (
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold" style={{color: '#243b53'}}>{data.statistics.subjectsCovered.stats}</div>
                  <div className="text-sm font-sans" style={{color: '#64748b'}}>{data.statistics.subjectsCovered.text}</div>
                </div>
              )}
              {data.statistics.successRate && (
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold" style={{color: '#243b53'}}>{data.statistics.successRate.stats}</div>
                  <div className="text-sm font-sans" style={{color: '#64748b'}}>{data.statistics.successRate.text}</div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Right side - Floating cards with gradient effects */}
          <div className="relative lg:h-96 hidden lg:block">
            {/* First card (Physics/top-right) with muted gradient overlay */}
            {data.floatingCards && data.floatingCards[0] && (
              <div className="absolute top-0 right-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200 rotate-3 transform hover:rotate-0 transition-transform duration-300 overflow-hidden">
                {/* Muted gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-transparent to-slate-100/30 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-full h-32 bg-gradient-to-br from-white via-slate-100 to-slate-300 rounded-lg flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
                  <h3 className="font-serif font-bold mb-2" style={{color: '#243b53'}}>{data.floatingCards[0].title}</h3>
                  <p className="text-sm font-sans whitespace-pre-line" style={{color: '#64748b'}}>{wrapText(data.floatingCards[0].description, data.floatingCards[0].maxCharactersPerLine)}</p>
                </div>
            </div>
            )}

            {/* Second card (Mathematics/left) with muted gradient overlay */}
            {data.floatingCards && data.floatingCards[1] && (
              <div className="absolute top-8 left-4 bg-white rounded-2xl p-6 shadow-lg border border-slate-200 -rotate-2 transform hover:rotate-0 transition-transform duration-300 overflow-hidden">
                {/* Muted gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-transparent to-yellow-100/30 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-full h-24 bg-gradient-to-br from-white via-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
                  <h3 className="font-serif font-bold mb-2" style={{color: '#243b53'}}>{data.floatingCards[1].title}</h3>
                  <p className="text-sm font-sans whitespace-pre-line" style={{color: '#64748b'}}>{wrapText(data.floatingCards[1].description, data.floatingCards[1].maxCharactersPerLine)}</p>
                </div>
            </div>
            )}

            {/* Third card (Chemistry/bottom-right) with muted gradient overlay */}
            {data.floatingCards && data.floatingCards[2] && (
              <div className="absolute bottom-[-2rem] right-16 bg-white rounded-2xl p-4 shadow-lg border border-slate-200 rotate-1 transform hover:rotate-0 transition-transform duration-300 overflow-hidden">
                {/* Muted gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-100/25 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-full h-20 bg-gradient-to-br from-white via-red-100 to-red-200 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-red-700 fill-current" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.770-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a .53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                </svg>
                  </div>
                  <h3 className="font-serif font-bold text-sm mb-1" style={{color: '#243b53'}}>{data.floatingCards[2].title}</h3>
                  <p className="text-xs font-sans whitespace-pre-line" style={{color: '#64748b'}}>{wrapText(data.floatingCards[2].description, data.floatingCards[2].maxCharactersPerLine)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 