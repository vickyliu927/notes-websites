import { WhyChooseUsData } from '../../types/sanity';

interface WhyChooseUsProps {
  whyChooseUsData?: WhyChooseUsData;
}

export default function WhyChooseUs({ whyChooseUsData }: WhyChooseUsProps) {
  // Fallback data if no Sanity data is provided
  const fallbackData: WhyChooseUsData = {
    _id: 'fallback',
    title: 'Default Why Choose Us',
    sectionTitleFirstPart: 'Why Choose',
    sectionTitleSecondPart: 'Our Study Notes',
    sectionDescription: 'Our comprehensive resources are designed to help you excel in your CIE A-Level examinations',
    highlight1: {
      title: 'Exam-Focused',
      description: 'Content aligned with the latest CIE syllabus and exam requirements'
    },
    highlight2: {
      title: 'Concise Notes',
      description: 'Clear explanations and summaries of complex topics and concepts'
    },
    highlight3: {
      title: 'Practice Questions',
      description: 'Extensive question banks with detailed solutions and explanations'
    },
    highlight4: {
      title: 'Exam Technique',
      description: 'Guidance on answering strategies, timing, and mark allocation'
    }
  };

  // Use Sanity data if available, otherwise use fallback
  const data = whyChooseUsData || fallbackData;

  // Icon components for each highlight
  const icons = {
    highlight1: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    highlight2: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    highlight3: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    highlight4: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const highlights = [
    { ...data.highlight1, icon: icons.highlight1, bgColor: 'bg-blue-50', iconBg: 'bg-blue-100' },
    { ...data.highlight2, icon: icons.highlight2, bgColor: 'bg-cyan-50', iconBg: 'bg-cyan-100' },
    { ...data.highlight3, icon: icons.highlight3, bgColor: 'bg-yellow-50', iconBg: 'bg-yellow-100' },
    { ...data.highlight4, icon: icons.highlight4, bgColor: 'bg-green-50', iconBg: 'bg-green-100' }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="leading-none mb-6 font-serif" style={{fontSize: '42px', letterSpacing: '-0.01em', fontWeight: '600'}}>
            <span style={{color: '#243b53'}}>{data.sectionTitleFirstPart}</span>
            {data.sectionTitleSecondPart && (
              <span style={{color: '#e67e50'}}> {data.sectionTitleSecondPart}</span>
            )}
          </h2>
          <p className="font-sans leading-relaxed max-w-3xl mx-auto" style={{fontSize: '20px', color: '#486581', fontWeight: '400'}}>
            {data.sectionDescription}
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="card p-6 text-center hover:shadow-medium transition-all hover:-translate-y-1 group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${highlight.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {highlight.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {highlight.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 