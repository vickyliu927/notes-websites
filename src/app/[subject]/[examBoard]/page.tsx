import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header, Footer, SubjectTopicGrid, ContactForm, MoreResources } from '@/components'
import ExamBoardPage from '@/components/ExamBoardPage'
import { 
  client, 
  headerQuery, 
  footerQuery, 
  contactFormSectionQuery,
  hasActiveExamBoardPages,
  getExamBoardSidebar
} from '../../../../lib/sanity'
import { 
  getHeaderWithFallback,
  getFooterWithFallback,
  getContactFormWithFallback,
  getSubjectPageWithFallback
} from '../../../../lib/cloneQueries'
import { getSubjectPageForClone } from '../../../../lib/cloneUtils'
import { HeaderData, FooterData, ContactFormSectionData, SubjectPageData } from '../../../../types/sanity'
import { SEOProvider } from '../../../../contexts/SEOContext'

export const revalidate = 10;

interface ExamBoardPageProps {
  params: Promise<{ subject: string; examBoard: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ExamBoardPageProps): Promise<Metadata> {
  const { subject, examBoard } = await params
  
  // Capitalize subject and exam board for display
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1)
  const examBoardName = examBoard.toUpperCase()
  
  const title = `${subjectName} ${examBoardName} Exam Board | Study Resources`
  const description = `Comprehensive ${subjectName} study resources and practice questions for ${examBoardName} exam board. Access notes, papers, and more.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

// Helper function to get clone ID by domain
async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  try {
    console.log(`[EXAM_BOARD_DOMAIN_LOOKUP] Looking up hostname: ${hostname}`)
    
    const query = `*[_type == "clone" && customDomain == "${hostname}" && isActive == true][0] {
      cloneId
    }`
    
    const result = await client.fetch(query)
    console.log(`[EXAM_BOARD_DOMAIN_LOOKUP] Query result:`, result)
    
    if (result?.cloneId?.current) {
      console.log(`[EXAM_BOARD_DOMAIN_LOOKUP] Found clone: ${result.cloneId.current}`)
      return result.cloneId.current
    }
    
    console.log(`[EXAM_BOARD_DOMAIN_LOOKUP] No clone found for hostname: ${hostname}`)
    return null
  } catch (error) {
    console.error('[EXAM_BOARD_DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Helper function to select best data from fallback query
function selectBestData<T>(fallbackResult: { cloneSpecific?: T; baseline?: T; default?: T }): T | undefined {
  return fallbackResult?.cloneSpecific || fallbackResult?.baseline || fallbackResult?.default
}

async function getHeaderData(cloneId?: string): Promise<HeaderData | undefined> {
  try {
    console.log(`[EXAM_BOARD] Fetching header data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getHeaderWithFallback(cloneId));
      const headerData = selectBestData(fallbackResult) as HeaderData;
      console.log(`[EXAM_BOARD] Fetched header data:`, headerData);
      return headerData;
    } else {
      const headerData = await client.fetch(headerQuery);
      console.log('[EXAM_BOARD] Fetched header data:', headerData);
      return headerData;
    }
  } catch (error) {
    console.error('[EXAM_BOARD] Error fetching header data:', error);
    return undefined;
  }
}

async function getFooterData(cloneId?: string): Promise<FooterData | undefined> {
  try {
    console.log(`[EXAM_BOARD] Fetching footer data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getFooterWithFallback(cloneId));
      const footerData = selectBestData(fallbackResult) as FooterData;
      console.log(`[EXAM_BOARD] Fetched footer data:`, footerData);
      return footerData;
    } else {
      const footerData = await client.fetch(footerQuery);
      console.log('[EXAM_BOARD] Fetched footer data:', footerData);
      return footerData;
    }
  } catch (error) {
    console.error('[EXAM_BOARD] Error fetching footer data:', error);
    return undefined;
  }
}

async function getContactFormSectionData(cloneId?: string): Promise<ContactFormSectionData | undefined> {
  try {
    console.log(`[EXAM_BOARD] Fetching contact form section data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getContactFormWithFallback(cloneId));
      const contactFormSectionData = selectBestData(fallbackResult) as ContactFormSectionData;
      console.log(`[EXAM_BOARD] Fetched contact form section data:`, contactFormSectionData);
      return contactFormSectionData;
    } else {
      const contactFormSectionData = await client.fetch(contactFormSectionQuery);
      console.log('[EXAM_BOARD] Fetched contact form section data:', contactFormSectionData);
      return contactFormSectionData;
    }
  } catch (error) {
    console.error('[EXAM_BOARD] Error fetching contact form section data:', error);
    return undefined;
  }
}

// Helper function to get exam board data
async function getExamBoardData(subject: string, examBoard: string, cloneId?: string) {
  // Get the subject page data first
  const subjectPageResult = await getSubjectPageForClone(cloneId || '', subject)
  const subjectPageData = subjectPageResult.data as SubjectPageData | null
  
  if (!subjectPageData) {
    return null
  }

  // Create dynamic exam board page data
  const subjectName = subjectPageData.subjectName || subject.charAt(0).toUpperCase() + subject.slice(1)
  const examBoardDisplay = examBoard.toUpperCase()
  
  // Generate dynamic title and description
  const title = `${subjectName} ${examBoardDisplay} Resources`
  const description = `Access comprehensive ${subjectName} study materials specifically tailored for ${examBoardDisplay} exam board requirements.`
  
  // Create exam board blocks with dynamic links
  const examBoards = [
    {
      id: 'practice-questions',
      name: 'Practice Questions',
      customTitle: `${examBoardDisplay} Practice Questions`,
      customDescription: `Exam-style questions specifically designed for ${examBoardDisplay} ${subjectName} syllabus.`,
      logo: {
        asset: {
          _id: 'practice-icon',
          url: '/file.svg'
        },
        alt: 'Practice Questions'
      },
      buttonLabel: 'Start Practice'
    },
    {
      id: 'study-notes',
      name: 'Study Notes',
      customTitle: `${examBoardDisplay} Study Notes`,
      customDescription: `Comprehensive revision notes aligned with ${examBoardDisplay} ${subjectName} specification.`,
      logo: {
        asset: {
          _id: 'notes-icon',
          url: '/globe.svg'
        },
        alt: 'Study Notes'
      },
      buttonLabel: 'Access Notes'
    },
    {
      id: 'past-papers',
      name: 'Past Papers',
      customTitle: `${examBoardDisplay} Past Papers`,
      customDescription: `Previous examination papers and mark schemes for ${examBoardDisplay} ${subjectName}.`,
      logo: {
        asset: {
          _id: 'papers-icon',
          url: '/next.svg'
        },
        alt: 'Past Papers'
      },
      buttonLabel: 'View Papers'
    }
  ]

  return {
    title,
    description,
    examBoards,
    subjectPageData
  }
}

// Helper function to get clone-aware subject page data
async function getCloneAwareSubjectPageData(slug: string, cloneId?: string): Promise<SubjectPageData | null> {
  try {
    console.log(`[EXAM_BOARD] Fetching subject page data for slug: ${slug}${cloneId ? ` with clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getSubjectPageWithFallback(cloneId, slug));
      const subjectPageData = selectBestData(fallbackResult) as SubjectPageData;
      console.log(`[EXAM_BOARD] Fetched clone-aware subject page data:`, subjectPageData);
      return subjectPageData;
    } else {
      // For the main website (no cloneId), use the fallback system with the baseline clone
      const baselineClone = await client.fetch(`*[_type == "clone" && baselineClone == true][0]{cloneId}`);
      if (baselineClone?.cloneId?.current) {
        const fallbackResult = await client.fetch(getSubjectPageWithFallback(baselineClone.cloneId.current, slug));
        const subjectPageData = selectBestData(fallbackResult) as SubjectPageData;
        console.log('[EXAM_BOARD] Fetched default subject page data using fallback system:', subjectPageData);
        return subjectPageData;
      } else {
        console.log('[EXAM_BOARD] No baseline clone found, falling back to legacy method');
        return null;
      }
    }
  } catch (error) {
    console.error('[EXAM_BOARD] Error fetching subject page data:', error);
    return null;
  }
}

export default async function ExamBoardPageHandler({ params }: ExamBoardPageProps) {
  const { subject, examBoard } = await params
  
  // Read headers to get host information for clone detection
  const headersList = await headers();
  const host = headersList.get('host');
  const hostname = host?.split(':')[0] || 'localhost';
  
  // Check if this is a custom domain
  let cloneId = null;
  if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
    cloneId = await getCloneIdByDomain(hostname);
  }

  // Check if there are active exam board pages for the current clone
  const { hasActive: hasActiveExamBoards, cloneId: examBoardCloneId } = await hasActiveExamBoardPages(cloneId || undefined);
  
  console.log('📍 [EXAM_BOARD] Active exam board check:', { hasActiveExamBoards, examBoardCloneId, subject, examBoard });

  // NEW URL STRUCTURE: If exam board pages are active, show subject content at /[subject]/[examBoard]
  if (hasActiveExamBoards && examBoardCloneId) {
    console.log('📍 [EXAM_BOARD] Showing subject content for exam board:', { subject, examBoard, examBoardCloneId });
    
    // Get the subject page data for the clone that has the active exam board page
    const subjectPageData = await getCloneAwareSubjectPageData(subject, examBoardCloneId);
    
    if (!subjectPageData) {
      notFound()
    }

    // Fetch layout components for the exam board clone
    const headerData = await getHeaderData(examBoardCloneId);
    const footerData = await getFooterData(examBoardCloneId);
    const contactFormSectionData = await getContactFormSectionData(examBoardCloneId);
    const sidebarData = await getExamBoardSidebar(examBoardCloneId);

    // Ensure topicBlockBackgroundColor has a default value if not set
    const backgroundColorClass = subjectPageData.topicBlockBackgroundColor || 'bg-blue-500'

    // Check if contact form is active
    const isContactFormActive = contactFormSectionData?.isActive ?? false;
    const showContactFormOnThisPage = subjectPageData.showContactForm ?? true;
    const shouldShowContactForm = isContactFormActive && showContactFormOnThisPage;

    return (
      <SEOProvider seoData={subjectPageData.seo}>
        <div className="min-h-screen bg-white">
          <Header headerData={headerData} isContactFormActive={shouldShowContactForm} homepageUrl="/" />
          <main>
            {/* Hero Section */}
            <section className="bg-white py-16">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="font-serif font-bold mb-6" style={{fontSize: '55px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                    {subjectPageData.pageTitle}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {subjectPageData.pageDescription}
                  </p>
                </div>
              </div>
            </section>

            {/* Topics Grid Section with Sidebar */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Main Content */}
                  <div className="flex-1">
                    <SubjectTopicGrid 
                      topics={subjectPageData.topics || []} 
                      topicBlockBackgroundColor={backgroundColorClass}
                    />
                  </div>
                  
                  {/* Sidebar - Only show if sidebar data is available and active */}
                  {sidebarData && sidebarData.isActive && (
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                      {/* Premium Study Notes Card */}
                      <div className="rounded-2xl p-8 text-white" style={{ backgroundColor: '#001a96' }}>
                        <div className="flex items-start gap-4 mb-4">
                          {/* Book Icon */}
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">Premium Study Notes</h3>
                            <p className="text-blue-100 text-sm">Expert-crafted summaries</p>
                          </div>
                        </div>
                        <p className="text-white mb-6 leading-relaxed">
                          Study notes written by top graduates. Save hours of prep time with structured summaries.
                        </p>
                        <a 
                          href={sidebarData.studyNotesButton.buttonUrl} 
                          className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200"
                        >
                          {sidebarData.studyNotesButton.buttonText}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>

                      {/* Practice Questions Card */}
                      <div className="rounded-2xl p-8 text-white" style={{ backgroundColor: '#fb510f' }}>
                        <div className="flex items-start gap-4 mb-4">
                          {/* Checkmark Icon */}
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">Practice Questions</h3>
                            <p className="text-orange-100 text-sm">Test your knowledge</p>
                          </div>
                        </div>
                        <p className="text-white mb-6 leading-relaxed">
                          Master exam techniques with targeted practice questions. Get instant feedback and detailed explanations.
                        </p>
                        <a 
                          href={sidebarData.practiceQuestionsButton.buttonUrl} 
                          className="inline-flex items-center gap-2 bg-white text-orange-900 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors duration-200"
                        >
                          {sidebarData.practiceQuestionsButton.buttonText}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            </section>
          </main>
          
          {/* More Resources Section - only show if active */}
          <MoreResources moreResourcesData={subjectPageData.moreResources} />
          
          {/* Contact Form Section - only show if active */}
          {shouldShowContactForm && (
            <ContactForm contactFormData={contactFormSectionData} />
          )}
          
          <Footer footerData={footerData} isContactFormActive={shouldShowContactForm} />
        </div>
      </SEOProvider>
    )
  }

  // FALLBACK: Original exam board page logic when no active exam board pages exist
  // Validate exam board exists in database
  const examBoardInfo = await client.fetch(`*[_type == "examBoard" && (shortName == "${examBoard}" || slug.current == "${examBoard}") && isActive == true][0] {
    _id,
    name,
    shortName,
    slug,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    description,
    officialWebsite
  }`)
  
  if (!examBoardInfo) {
    notFound()
  }

  // Get exam board page data
  const examBoardPageData = await getExamBoardData(subject, examBoard, cloneId || undefined)
  
  if (!examBoardPageData) {
    notFound()
  }

  // Fetch layout components and sidebar
  const headerData = await getHeaderData(cloneId || undefined);
  const footerData = await getFooterData(cloneId || undefined);
  const contactFormSectionData = await getContactFormSectionData(cloneId || undefined);

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false;
  const showContactFormOnThisPage = examBoardPageData.subjectPageData.showContactForm ?? true;
  const shouldShowContactForm = isContactFormActive && showContactFormOnThisPage;

  return (
    <SEOProvider seoData={examBoardPageData.subjectPageData.seo}>
      <div className="min-h-screen bg-white">
        <Header headerData={headerData} isContactFormActive={shouldShowContactForm} homepageUrl="/" />
        <main>
          <ExamBoardPage examBoardPageData={examBoardPageData} currentSubject={subject} sidebarData={sidebarData} />
        </main>
        <Footer footerData={footerData} isContactFormActive={shouldShowContactForm} />
      </div>
    </SEOProvider>
  )
} 