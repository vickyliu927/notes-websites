import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header, Footer, ExamBoardGrid } from '@/components'
import { 
  client, 
  headerQuery, 
  footerQuery, 
  examBoardBySlugQuery, 
  contactFormSectionQuery 
} from '../../../../lib/sanity'
import { 
  getHeaderWithFallback,
  getFooterWithFallback,
  getContactFormWithFallback
} from '../../../../lib/cloneQueries'
import { HeaderData, FooterData, ContactFormSectionData, ExamBoardData } from '../../../../types/sanity'
import { generateSEOMetadata } from '../../../../components/SEOHead'
import { generateCloneSEOMetadata } from '../../../../lib/seo-clone-utils'
import { getCloneDataByDomain } from '../../../../lib/cloneUtils'
import { SEOProvider } from '../../../../contexts/SEOContext'

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

interface ExamBoardPageProps {
  params: Promise<{
    subject: string
  }>
}

// Function to get clone ID by domain (reused from homepage)
async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  try {
    const query = `
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    
    const result = await client.fetch(query, { hostname })
    
    if (result?.cloneId?.current) {
      return result.cloneId.current
    }
    
    return null
  } catch (error) {
    console.error('[DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Helper function to select best data from fallback query
function selectBestData<T>(fallbackResult: { cloneSpecific?: T; baseline?: T; default?: T }): T | undefined {
  return fallbackResult?.cloneSpecific || fallbackResult?.baseline || fallbackResult?.default
}

// Clone-aware data fetching functions
async function getHeaderData(cloneId?: string): Promise<HeaderData | undefined> {
  try {
    if (cloneId) {
      const fallbackResult = await client.fetch(getHeaderWithFallback(cloneId));
      const headerData = selectBestData(fallbackResult) as HeaderData;
      return headerData;
    } else {
      const headerData = await client.fetch(headerQuery);
      return headerData;
    }
  } catch (error) {
    console.error('Error fetching header data:', error);
    return undefined;
  }
}

async function getFooterData(cloneId?: string): Promise<FooterData | undefined> {
  try {
    if (cloneId) {
      const fallbackResult = await client.fetch(getFooterWithFallback(cloneId));
      const footerData = selectBestData(fallbackResult) as FooterData;
      return footerData;
    } else {
      const footerData = await client.fetch(footerQuery);
      return footerData;
    }
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return undefined;
  }
}

async function getContactFormSectionData(cloneId?: string): Promise<ContactFormSectionData | undefined> {
  try {
    if (cloneId) {
      const fallbackResult = await client.fetch(getContactFormWithFallback(cloneId));
      const contactFormData = selectBestData(fallbackResult) as ContactFormSectionData;
      return contactFormData;
    } else {
      const contactFormData = await client.fetch(contactFormSectionQuery);
      return contactFormData;
    }
  } catch (error) {
    console.error('Error fetching contact form data:', error);
    return undefined;
  }
}

async function getExamBoardData(subject: string): Promise<ExamBoardData | undefined> {
  try {
    const examBoardData = await client.fetch(examBoardBySlugQuery(subject));
    return examBoardData;
  } catch (error) {
    console.error('Error fetching exam board data:', error);
    return undefined;
  }
}

export async function generateMetadata({ params }: ExamBoardPageProps): Promise<Metadata> {
  try {
    const { subject } = await params
    
    // Get hostname to check for clone-specific settings
    const headersList = await headers();
    const host = headersList.get('host');
    const hostname = host?.split(':')[0] || 'localhost';
    
    // Get clone data if on a custom domain
    let cloneData = null;
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
      cloneData = await getCloneDataByDomain(hostname);
    }
    
    const examBoardData = await getExamBoardData(subject)
  
    if (!examBoardData) {
      return generateCloneSEOMetadata({
        pageTitle: 'Exam Board Not Found',
        pageDescription: 'The requested exam board page could not be found.',
        cloneSiteTitle: cloneData?.siteTitle,
        cloneSiteDescription: cloneData?.siteDescription
      })
    }

    return generateCloneSEOMetadata({
      pageTitle: examBoardData.heroSection.title,
      pageDescription: examBoardData.heroSection.description,
      cloneSiteTitle: cloneData?.siteTitle,
      cloneSiteDescription: cloneData?.siteDescription
    })
  } catch (error) {
    console.error('Error generating exam board page metadata:', error)
    
    return generateCloneSEOMetadata({
      pageTitle: 'IGCSE Notes - Study Materials',
      pageDescription: 'Access comprehensive IGCSE study notes and revision materials.'
    })
  }
}

export default async function ExamBoardPage({ params }: ExamBoardPageProps) {
  const { subject } = await params
  
  // Read headers to get host information
  const headersList = await headers();
  const host = headersList.get('host');
  const hostname = host?.split(':')[0] || 'localhost';
  
  // Check if this is a custom domain
  let cloneId = null;
  if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
    cloneId = await getCloneIdByDomain(hostname);
  }

  // Fetch all data with clone awareness
  const headerData = await getHeaderData(cloneId || undefined);
  const footerData = await getFooterData(cloneId || undefined);
  const examBoardData = await getExamBoardData(subject);
  const contactFormSectionData = await getContactFormSectionData(cloneId || undefined);

  if (!examBoardData) {
    notFound()
  }

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false;

  return (
    <SEOProvider seoData={undefined}>
      <div className="min-h-screen bg-white">
        <Header headerData={headerData} isContactFormActive={isContactFormActive} homepageUrl="/" />
        <main>
          {/* Hero Section */}
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="font-serif font-bold mb-6" style={{fontSize: '55px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                  {examBoardData.heroSection.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                  {examBoardData.heroSection.description}
                </p>

                {/* CTA Buttons */}
                {examBoardData.heroSection.ctaButtons && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {examBoardData.heroSection.ctaButtons.primaryButton && (
                      <a 
                        href={examBoardData.heroSection.ctaButtons.primaryButton.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white px-8 py-3 rounded-md font-medium font-sans inline-flex items-center justify-center group transition-colors hover:opacity-90" 
                        style={{backgroundColor: '#E67E50', fontSize: '14px'}}
                      >
                        {examBoardData.heroSection.ctaButtons.primaryButton.text}
                        <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                    {examBoardData.heroSection.ctaButtons.secondaryButton && (
                      <a 
                        href={examBoardData.heroSection.ctaButtons.secondaryButton.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-slate-300 hover:bg-slate-50 px-8 py-3 rounded-md font-medium font-sans transition-colors"
                        style={{fontSize: '14px', color: '#475569'}}
                      >
                        {examBoardData.heroSection.ctaButtons.secondaryButton.text}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Exam Boards Grid Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:w-2/3">
                  <ExamBoardGrid examBoards={examBoardData.examBoards} />
                </div>

                {/* Sidebar */}
                {examBoardData.sidebarContent && (
                  <div className="lg:w-1/3 space-y-6">
                    {/* Premium Notes Box */}
                    {examBoardData.sidebarContent.premiumNotesBox && (
                      <div className="bg-blue-600 text-white p-6 rounded-lg">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-1">
                            {examBoardData.sidebarContent.premiumNotesBox.title}
                          </h3>
                          <p className="text-blue-100 text-sm">
                            {examBoardData.sidebarContent.premiumNotesBox.subtitle}
                          </p>
                        </div>
                        <p className="text-blue-50 mb-4 text-sm leading-relaxed">
                          {examBoardData.sidebarContent.premiumNotesBox.description}
                        </p>
                        {examBoardData.sidebarContent.premiumNotesBox.buttonUrl && (
                          <a 
                            href={examBoardData.sidebarContent.premiumNotesBox.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm hover:bg-blue-50 transition-colors"
                          >
                            {examBoardData.sidebarContent.premiumNotesBox.buttonText}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Practice Questions Box */}
                    {examBoardData.sidebarContent.practiceQuestionsBox && (
                      <div className="bg-orange-500 text-white p-6 rounded-lg">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-1">
                            {examBoardData.sidebarContent.practiceQuestionsBox.title}
                          </h3>
                          <p className="text-orange-100 text-sm">
                            {examBoardData.sidebarContent.practiceQuestionsBox.subtitle}
                          </p>
                        </div>
                        <p className="text-orange-50 mb-4 text-sm leading-relaxed">
                          {examBoardData.sidebarContent.practiceQuestionsBox.description}
                        </p>
                        {examBoardData.sidebarContent.practiceQuestionsBox.buttonUrl && (
                          <a 
                            href={examBoardData.sidebarContent.practiceQuestionsBox.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-orange-500 px-4 py-2 rounded font-medium text-sm hover:bg-orange-50 transition-colors"
                          >
                            {examBoardData.sidebarContent.practiceQuestionsBox.buttonText}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        
        <Footer footerData={footerData} isContactFormActive={isContactFormActive} />
      </div>
    </SEOProvider>
  )
} 