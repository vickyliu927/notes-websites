import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header, Footer, SubjectTopicGrid, ContactForm, MoreResources } from '@/components'
import { 
  client, 
  headerQuery, 
  footerQuery, 
  getSubjectPageData, 
  getGlobalSEOSettings, 
  allSubjectSlugsQuery, 
  contactFormSectionQuery,
  getExamBoardPage
} from '../../../lib/sanity'
import { 
  getHeaderWithFallback,
  getFooterWithFallback,
  getContactFormWithFallback,
  getSubjectPageWithFallback
} from '../../../lib/cloneQueries'
import { HeaderData, FooterData, ContactFormSectionData } from '../../../types/sanity'
import { generateSEOMetadata } from '../../../components/SEOHead'
import { SEOProvider } from '../../../contexts/SEOContext'
import ExamBoardPage from '@/components/ExamBoardPage'

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

interface SubjectPageProps {
  params: Promise<{
    subject: string
  }>
}

// Function to get clone ID by domain (same as homepage)
async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  console.log(`[SUBJECT_DOMAIN_LOOKUP] Searching for hostname: ${hostname}`)
  
  try {
    // Query Sanity for clone with matching custom domain from domains array
    const query = `
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    console.log(`[SUBJECT_DOMAIN_LOOKUP] Executing query:`, query, `with hostname:`, hostname)
    
    const result = await client.fetch(query, { hostname })
    console.log(`[SUBJECT_DOMAIN_LOOKUP] Query result:`, result)
    
    if (result?.cloneId?.current) {
      console.log(`[SUBJECT_DOMAIN_LOOKUP] Found clone: ${result.cloneId.current}`)
      return result.cloneId.current
    }
    
    console.log(`[SUBJECT_DOMAIN_LOOKUP] No clone found for hostname: ${hostname}`)
    return null
  } catch (error) {
    console.error('[SUBJECT_DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Helper function to select best data from fallback query
function selectBestData<T>(fallbackResult: { cloneSpecific?: T; baseline?: T; default?: T }): T | undefined {
  return fallbackResult?.cloneSpecific || fallbackResult?.baseline || fallbackResult?.default
}

async function getHeaderData(cloneId?: string): Promise<HeaderData | undefined> {
  try {
    console.log(`[SUBJECT] Fetching header data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getHeaderWithFallback(cloneId));
      const headerData = selectBestData(fallbackResult) as HeaderData;
      console.log(`[SUBJECT] Fetched header data:`, headerData);
      return headerData;
    } else {
      const headerData = await client.fetch(headerQuery);
      console.log('[SUBJECT] Fetched header data:', headerData);
      return headerData;
    }
  } catch (error) {
    console.error('[SUBJECT] Error fetching header data:', error);
    return undefined;
  }
}

async function getFooterData(cloneId?: string): Promise<FooterData | undefined> {
  try {
    console.log(`[SUBJECT] Fetching footer data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getFooterWithFallback(cloneId));
      const footerData = selectBestData(fallbackResult) as FooterData;
      console.log(`[SUBJECT] Fetched footer data:`, footerData);
      return footerData;
    } else {
      const footerData = await client.fetch(footerQuery);
      console.log('[SUBJECT] Fetched footer data:', footerData);
      return footerData;
    }
  } catch (error) {
    console.error('[SUBJECT] Error fetching footer data:', error);
    return undefined;
  }
}

async function getContactFormSectionData(cloneId?: string): Promise<ContactFormSectionData | undefined> {
  try {
    console.log(`[SUBJECT] Fetching contact form section data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getContactFormWithFallback(cloneId));
      const contactFormSectionData = selectBestData(fallbackResult) as ContactFormSectionData;
      console.log(`[SUBJECT] Fetched contact form section data:`, contactFormSectionData);
      return contactFormSectionData;
    } else {
    const contactFormSectionData = await client.fetch(contactFormSectionQuery);
      console.log('[SUBJECT] Fetched contact form section data:', contactFormSectionData);
    return contactFormSectionData;
    }
  } catch (error) {
    console.error('[SUBJECT] Error fetching contact form section data:', error);
    return undefined;
  }
}

async function getCloneAwareSubjectPageData(slug: string, cloneId?: string) {
  try {
    console.log(`[SUBJECT] Fetching subject page data for slug: ${slug}${cloneId ? ` with clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getSubjectPageWithFallback(cloneId, slug));
      const subjectPageData = selectBestData(fallbackResult);
      console.log(`[SUBJECT] Fetched clone-aware subject page data:`, subjectPageData);
      return subjectPageData;
    } else {
      const subjectPageData = await getSubjectPageData(slug);
      console.log('[SUBJECT] Fetched default subject page data:', subjectPageData);
      return subjectPageData;
    }
  } catch (error) {
    console.error('[SUBJECT] Error fetching subject page data:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(allSubjectSlugsQuery)
    return slugs.map((slug: string) => ({
      subject: slug,
    }))
  } catch (error) {
    console.error('Error fetching subject slugs:', error)
    return []
  }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  try {
  const { subject } = await params
    
    // Read headers to detect clone
    const headersList = await headers();
    const host = headersList.get('host');
    const hostname = host?.split(':')[0] || 'localhost';
    
    // Check if this is a custom domain
    let cloneId = null;
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
      cloneId = await getCloneIdByDomain(hostname);
    }
    
    console.log('📍 [SUBJECT_META] Clone detection:', { hostname, cloneId, subject });
    
    const subjectPageData = await getCloneAwareSubjectPageData(subject, cloneId || undefined)
  
  if (!subjectPageData) {
      return generateSEOMetadata({
      title: 'Subject Not Found - CIE IGCSE Notes',
      description: 'The requested subject page could not be found.'
      })
    }

    // Get global SEO settings as fallback
    const globalSEO = await getGlobalSEOSettings()
    
    // Use subject page SEO data if available, otherwise fall back to global SEO
    const seoData = subjectPageData.seo || globalSEO

    return generateSEOMetadata({
      title: `${subjectPageData.pageTitle} - CIE IGCSE Notes`,
      description: subjectPageData.pageDescription,
      seoData,
    })
  } catch (error) {
    console.error('Error generating subject page metadata:', error)
    
    // Return basic metadata if there's an error
    return generateSEOMetadata({
      title: 'IGCSE Notes - CIE Study Materials',
      description: 'Access comprehensive IGCSE study notes and revision materials.',
    })
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params
  
  // Read headers to get host information
  const headersList = await headers();
  const host = headersList.get('host');
  const hostname = host?.split(':')[0] || 'localhost';
  
  console.log('📍 [SUBJECT_PAGE] Checking domain:', hostname);
  
  // Directly check if this is a custom domain
  let cloneId = null;
  if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
    console.log('📍 [SUBJECT_PAGE] Custom domain detected, checking for clone...');
    cloneId = await getCloneIdByDomain(hostname);
  }
  
  console.log('📍 [SUBJECT_PAGE] Clone detection result:', { hostname, cloneId, subject });

  // Fetch all data with clone awareness
  const headerData = await getHeaderData(cloneId || undefined);
  const footerData = await getFooterData(cloneId || undefined);
  const subjectPageData = await getCloneAwareSubjectPageData(subject, cloneId || undefined);
  const contactFormSectionData = await getContactFormSectionData(cloneId || undefined);

  if (!subjectPageData) {
    notFound()
  }

  // Fetch exam board page for this subject and clone
  const examBoardPageData = await getExamBoardPage(cloneId || '', subjectPageData._id);

  // Debug log to check the data
  console.log('📍 [SUBJECT_PAGE] Subject page data:', {
    subject,
    cloneId,
    topicBlockBackgroundColor: subjectPageData.topicBlockBackgroundColor,
    topics: subjectPageData.topics?.length,
    title: subjectPageData.title
  })
  console.log('📍 [SUBJECT_PAGE] Exam board page data:', examBoardPageData);

  // Ensure topicBlockBackgroundColor has a default value if not set
  const backgroundColorClass = subjectPageData.topicBlockBackgroundColor || 'bg-blue-500'

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false;
  const showContactFormOnThisPage = subjectPageData.showContactForm ?? true; // Default to true for backward compatibility
  const shouldShowContactForm = isContactFormActive && showContactFormOnThisPage;

  // If exam board page exists, render it instead of the default subject page UI
  if (examBoardPageData) {
    return (
      <SEOProvider seoData={subjectPageData.seo}>
        <div className="min-h-screen bg-white">
          <Header headerData={headerData} isContactFormActive={shouldShowContactForm} homepageUrl="/" />
          <main>
            <ExamBoardPage examBoardPageData={examBoardPageData} />
          </main>
          <Footer footerData={footerData} isContactFormActive={shouldShowContactForm} />
        </div>
      </SEOProvider>
    )
  }

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
                topics={subjectPageData.topics} 
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