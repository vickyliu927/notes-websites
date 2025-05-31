"use client";

import { SubjectGridData, SubjectGridSubject } from '../../types/sanity';
import { urlFor } from '../../lib/sanity';
import { SubjectPageData } from '../../types/sanity';
import Image from "next/image";

interface SubjectGridProps {
  subjectGridData?: SubjectGridData;
  publishedSubjects?: SubjectPageData[];
}

// Helper function to create a slug from subject name
function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function SubjectGrid({ subjectGridData, publishedSubjects }: SubjectGridProps) {
  // Fallback data if no Sanity data is provided
  const fallbackData: SubjectGridData = {
    _id: 'fallback',
    title: 'Default Subject Grid',
    sectionTitle: 'Popular Subjects',
    sectionDescription: 'Explore our comprehensive study materials across all major CIE IGCSE subjects. Each subject includes detailed notes, practice questions, and exam tips.',
    subjects: [
      { 
        name: "Mathematics", 
        color: "bg-primary", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-math.jpg'
          },
          alt: 'Mathematics illustration'
        },
        description: "Algebra, Geometry, Statistics, and Calculus",
        dateUpdated: "2024-01-15",
        viewNotesButton: {
          text: "View Notes",
          href: "/maths"
        }
      },
      { 
        name: "Physics", 
        color: "bg-secondary", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-physics.jpg'
          },
          alt: 'Physics illustration'
        },
        description: "Mechanics, Waves, Electricity, and Modern Physics",
        dateUpdated: "2024-01-10",
        viewNotesButton: {
          text: "View Notes",
          href: "/physics"
        }
      },
      { 
        name: "Chemistry", 
        color: "bg-accent", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-chemistry.jpg'
          },
          alt: 'Chemistry illustration'
        },
        description: "Organic, Inorganic, and Physical Chemistry",
        dateUpdated: "2024-01-12",
        viewNotesButton: {
          text: "View Notes",
          href: "/chemistry"
        }
      },
      { 
        name: "Biology", 
        color: "bg-success", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-biology.jpg'
          },
          alt: 'Biology illustration'
        },
        description: "Cell Biology, Genetics, Ecology, and Human Biology",
        dateUpdated: "2024-01-08",
        viewNotesButton: {
          text: "View Notes",
          href: "/biology"
        }
      },
      { 
        name: "English", 
        color: "bg-warning", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-english.jpg'
          },
          alt: 'English illustration'
        },
        description: "Literature, Language, and Creative Writing",
        dateUpdated: "2024-01-14",
        viewNotesButton: {
          text: "View Notes",
          href: "/english"
        }
      },
      { 
        name: "History", 
        color: "bg-error", 
        image: {
          _type: 'image',
          asset: {
            _ref: '',
            _type: 'reference',
            url: '/placeholder-history.jpg'
          },
          alt: 'History illustration'
        },
        description: "World History, Modern History, and Historical Analysis",
        dateUpdated: "2024-01-11",
        viewNotesButton: {
          text: "View Notes",
          href: "/history"
        }
      },
    ],
    viewAllButton: {
      text: "View All Subjects",
      href: "/"
    }
  };

  // Use Sanity data if available, otherwise use fallback
  const data = subjectGridData || fallbackData;

  // Helper function to get the correct URL for a subject
  const getSubjectUrl = (subject: SubjectGridSubject): string => {
    if (!publishedSubjects) {
      return subject.viewNotesButton.href || subject.viewNotesButton.url || '#';
    }

    // Check if there's a published subject page that matches this subject
    const matchingSubject = publishedSubjects.find(pubSubject => {
      const subjectNameMatch = pubSubject.subjectName.toLowerCase() === subject.name.toLowerCase();
      const slugMatch = pubSubject.subjectSlug.current === createSlug(subject.name);
      return subjectNameMatch || slugMatch;
    });

    if (matchingSubject) {
      return `/${matchingSubject.subjectSlug.current}`;
    }

    // Fallback to original URL or create a dynamic URL
    const originalUrl = subject.viewNotesButton.href || subject.viewNotesButton.url || '#';
    return originalUrl.startsWith('/subjects/') 
      ? `/${createSlug(subject.name)}`
      : originalUrl;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  // Helper function to get image URL
  const getImageUrl = (image: SubjectGridSubject['image']) => {
    if (image?.asset) {
      try {
        // If we have a Sanity asset, use urlFor
        if (image.asset._ref || image.asset._id) {
          return urlFor(image)
            .width(400)
            .height(200)
            .fit('crop')
            .auto('format')
            .quality(90)
            .url();
        }
        // Fallback to direct URL if available
        if (image.asset.url) {
          return image.asset.url;
        }
      } catch (error) {
        console.warn('Error generating image URL:', error);
        return image.asset.url || null;
      }
    }
    return null;
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/30 relative overflow-hidden">
      {/* Floating decorative bubbles - mirroring hero section design */}
      <div className="absolute top-32 left-8 w-6 h-6 rounded-full" style={{backgroundColor: '#E67E50', opacity: '0.06'}}></div>
      <div className="absolute top-28 right-12 w-8 h-8 rounded-full" style={{backgroundColor: '#E67E50', opacity: '0.04'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h3 className="leading-none mb-6 font-serif" style={{fontSize: '42px', color: '#e67e50', letterSpacing: '-0.01em', fontWeight: '600'}}>
            {data.sectionTitle}
          </h3>
          <p className="font-sans leading-relaxed max-w-3xl mx-auto" style={{fontSize: '20px', color: '#486581', fontWeight: '500'}}>
            {data.sectionDescription}
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.subjects.map((subject) => {
            const imageUrl = getImageUrl(subject.image);
            const subjectUrl = getSubjectUrl(subject);
            
            return (
              <div 
                key={subject.name} 
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100/60 hover:border-gray-200/80 transition-all duration-500 hover:shadow-lg hover:shadow-gray-900/5 hover:-translate-y-1"
                style={{
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                }}
              >
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {imageUrl ? (
                    <>
                      <Image 
                        src={imageUrl}
                        alt={subject.image.alt || subject.name}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Subtle overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className={`w-full h-full ${subject.color} bg-gradient-to-br from-current to-current/80 flex items-center justify-center relative overflow-hidden`}>
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3Ccircle cx='32' cy='32' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }}></div>
                      <span className="text-white font-bold relative z-10 font-serif" style={{fontSize: '42px'}}>{subject.name[0]}</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-8 space-y-6">
                  {/* Subject Name */}
                  <h4 className="text-xl font-semibold leading-tight font-serif" style={{color: '#243b53'}}>
                    {subject.name}
                  </h4>
                  
                  {/* Description */}
                  {subject.description && (
                    <p className="text-sm leading-relaxed font-sans" style={{color: '#64748b', lineHeight: '1.6'}}>
                      {subject.description}
                    </p>
                  )}
                  
                  {/* Updated Date - Minimalist Design */}
                  {subject.dateUpdated && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-xs font-medium font-sans tracking-wide" style={{color: '#64748b', letterSpacing: '0.025em'}}>
                          Updated {formatDate(subject.dateUpdated)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* CTA Button - Premium Design */}
                  <div className="pt-4">
                    <a 
                      href={subjectUrl}
                      className="group/btn relative w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium font-sans tracking-wide rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 overflow-hidden"
                      style={{letterSpacing: '0.025em'}}
                    >
                      {/* Button background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      
                      <span className="relative z-10 flex items-center">
                        {subject.viewNotesButton.text}
                        <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* View All Button - Premium Design */}
        <div className="text-center mt-20">
          <a 
            href={data.viewAllButton.href}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-sm font-medium font-sans tracking-wide rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            style={{letterSpacing: '0.05em', color: '#e67e50'}}
          >
            <span className="flex items-center">
              {data.viewAllButton.text}
              <svg className="ml-3 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
} 