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
  hasActiveExamBoardPages
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

            {/* Topics Grid Section */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <SubjectTopicGrid 
                  topics={subjectPageData.topics || []} 
                  topicBlockBackgroundColor={backgroundColorClass}
                />
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

  // FALLBACK: Use normal subject page layout for all exam board subject pages
  // Get the subject page data for the current clone
  const subjectPageData = await getCloneAwareSubjectPageData(subject, cloneId || undefined);
  
  if (!subjectPageData) {
    notFound()
  }

  // Fetch layout components for the current clone
  const headerData = await getHeaderData(cloneId || undefined);
  const footerData = await getFooterData(cloneId || undefined);
  const contactFormSectionData = await getContactFormSectionData(cloneId || undefined);

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

          {/* Topics Grid Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <SubjectTopicGrid 
                topics={subjectPageData.topics || []} 
                topicBlockBackgroundColor={backgroundColorClass}
              />
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