import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { validateCloneId, getCompleteCloneData } from '../../../../../lib/cloneUtils'
import { client, allSubjectPagesQuery, hasActiveExamBoardPages } from '../../../../../lib/sanity'
import { 
  Header, 
  Hero, 
  SubjectGrid, 
  WhyChooseUs, 
  FAQ, 
  ContactForm,
  Footer,
  SubjectTopicGrid
} from '@/components'
import { HeaderData, HeroData, SubjectGridData, WhyChooseUsData, FAQData, ContactFormSectionData, FooterData, SubjectPageData, HomepageData } from '../../../../../types/sanity'
import Link from 'next/link'

// ===== TYPES =====

interface CloneHomepageProps {
  params: Promise<{
    cloneId: string
  }>
}

// ===== UTILITY FUNCTIONS =====

async function getPublishedSubjectsForClone(cloneId: string): Promise<SubjectPageData[]> {
  try {
    // Get all published subject pages that match this clone or are general
    const publishedSubjects = await client.fetch(`
      *[_type == "subjectPage" && isPublished == true && 
        (cloneReference->cloneId.current == "${cloneId}" || !defined(cloneReference))
      ] {
        _id,
        title,
        subjectSlug,
        subjectName,
        cloneReference
      }
    `)
    return publishedSubjects || []
  } catch (error) {
    console.error('Error fetching published subjects for clone:', error)
    return []
  }
}

// Helper function to fetch homepage data for clone
async function getHomepageDataForClone(cloneId: string): Promise<HomepageData | undefined> {
  try {
    console.log(`Fetching homepage data for clone: ${cloneId}...`);
    
    const query = `
      *[_type == "homepage" && cloneReference._ref == $cloneId && isActive == true][0] {
        _id,
        title,
        pageTitle,
        pageDescription,
        sections,
        topicBlocksSubject->{
          _id,
          title,
          subjectSlug,
          subjectName,
          pageTitle,
          pageDescription,
          topicBlockBackgroundColor,
          topics[] {
            topicName,
            topicDescription,
            color,
            displayOrder,
            subtopics[] {
              subtopicName,
              subtopicUrl,
              isComingSoon,
              subSubtopics[] {
                subSubtopicName,
                subSubtopicUrl,
                isComingSoon
              }
            }
          },
          isPublished,
          showContactForm,
          displayTopicsOnHomepage
        },
        topicBlocksSubjects[]->{
          _id,
          title,
          subjectSlug,
          subjectName,
          pageTitle,
          pageDescription,
          topicBlockBackgroundColor,
          topics[] {
            topicName,
            topicDescription,
            color,
            displayOrder,
            subtopics[] {
              subtopicName,
              subtopicUrl,
              isComingSoon,
              subSubtopics[] {
                subSubtopicName,
                subSubtopicUrl,
                isComingSoon
              }
            }
          },
          isPublished,
          showContactForm,
          displayTopicsOnHomepage
        }
      }
    `;
    
    const homepageData = await client.fetch(query, { cloneId });
    console.log(`Fetched homepage data for clone ${cloneId}:`, homepageData);
    return homepageData;
  } catch (error) {
    console.error(`Error fetching homepage data for clone ${cloneId}:`, error);
    return undefined;
  }
}

// ===== METADATA =====

export async function generateMetadata({ params }: CloneHomepageProps): Promise<Metadata> {
  const { cloneId } = await params
  
  // Fetch clone data for metadata
  const cloneData = await getCompleteCloneData(cloneId)
  const cloneName = cloneData?.clone?.cloneName || cloneId
  
  return {
    title: `${cloneName} - Homepage | CIE IGCSE Study Notes`,
    description: `Access ${cloneName} variant of comprehensive CIE IGCSE study notes and revision materials.`,
  }
}

// ===== MAIN COMPONENT =====

export default async function CloneHomepage({ params }: CloneHomepageProps) {
  const { cloneId } = await params
  
  // Basic validation
  const isValidFormat = validateCloneId(cloneId)
  if (!isValidFormat) {
    redirect('/404')
  }

  // Fetch complete clone data
  const cloneData = await getCompleteCloneData(cloneId)
  
  // If clone doesn't exist or is inactive, redirect to 404
  if (!cloneData?.clone || !cloneData.clone.isActive) {
    redirect('/404')
  }

  const { clone, components } = cloneData

  // Get published subjects for this clone
  const publishedSubjects = await getPublishedSubjectsForClone(cloneId)

  // Check if there are active exam board pages for URL structure (for this specific clone)
  const { hasActive: hasActiveExamBoards } = await hasActiveExamBoardPages(cloneId);

  // Fetch homepage data for this clone
  const homepageData = await getHomepageDataForClone(cloneId);

  // Extract component data with fallbacks
  const headerData = components.header?.data as HeaderData | undefined
  const heroData = components.hero?.data as HeroData | undefined
  const subjectGridData = components.subjectGrid?.data as SubjectGridData | undefined
  const whyChooseUsData = components.whyChooseUs?.data as WhyChooseUsData | undefined
  const faqData = components.faq?.data as FAQData | undefined
  const contactFormData = components.contactForm?.data as ContactFormSectionData | undefined
  const footerData = components.footer?.data as FooterData | undefined

  // Check if contact form is active
  const isContactFormActive = contactFormData?.isActive ?? false

  return (
    <div className="min-h-screen bg-white">
      {/* Clone Indicator Banner */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
        <div className="max-w-7xl mx-auto">
          🔄 <strong>Clone Version:</strong> {clone.cloneName} 
          <span className="mx-2">•</span>
          <strong>ID:</strong> {cloneId}
          <span className="mx-2">•</span>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Original Site
          </Link>
          <span className="mx-2">•</span>
          <Link 
            href="/admin/clones/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Header */}
      <Header headerData={headerData} isContactFormActive={isContactFormActive} homepageUrl={`/clone/${cloneId}/homepage`} />
      
      <main>
        {/* Hero Section */}
        <Hero heroData={heroData} />
        
        {/* Topic Blocks Section - conditionally displayed after Hero */}
        {homepageData?.sections?.showTopicBlocks && (
          <>
            {Array.isArray(homepageData?.topicBlocksSubjects) && homepageData.topicBlocksSubjects.length > 0 ? (
              homepageData.topicBlocksSubjects.map((subject) => (
                <section key={subject._id} className="py-16 bg-gray-50">
                  <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                      <h2 className="font-serif font-bold mb-6" style={{fontSize: '45px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                        {subject.pageTitle}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {subject.pageDescription}
                      </p>
                    </div>
                    <SubjectTopicGrid 
                      topics={subject.topics || []} 
                      topicBlockBackgroundColor={subject.topicBlockBackgroundColor || 'bg-blue-500'}
                    />
                  </div>
                </section>
              ))
            ) : (
              homepageData?.topicBlocksSubject && (
                <section className="py-16 bg-gray-50">
                  <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                      <h2 className="font-serif font-bold mb-6" style={{fontSize: '45px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                        {homepageData.topicBlocksSubject.pageTitle}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {homepageData.topicBlocksSubject.pageDescription}
                      </p>
                    </div>
                    <SubjectTopicGrid 
                      topics={homepageData.topicBlocksSubject.topics || []} 
                      topicBlockBackgroundColor={homepageData.topicBlocksSubject.topicBlockBackgroundColor || 'bg-blue-500'}
                    />
                  </div>
                </section>
              )
            )}
          </>
        )}
        
        {/* Subject Grid with Clone Context */}
        <SubjectGrid 
          subjectGridData={subjectGridData} 
          publishedSubjects={publishedSubjects}
          cloneId={cloneId}
          hasActiveExamBoards={hasActiveExamBoards}
        />
        
        {/* Subject Request Banner */}

        
        {/* Why Choose Us */}
        <WhyChooseUs whyChooseUsData={whyChooseUsData} />
        
        {/* FAQ */}
        <FAQ faqData={faqData} />
        
        {/* Contact Form - only show if active */}
        {isContactFormActive && (
          <ContactForm contactFormData={contactFormData} />
        )}
      </main>
      
      {/* Footer */}
      <Footer footerData={footerData} isContactFormActive={isContactFormActive} />
    </div>
  )
}

// ===== REVALIDATION =====

export const revalidate = 60 