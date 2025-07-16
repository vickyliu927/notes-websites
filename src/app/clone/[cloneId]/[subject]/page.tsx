import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  Header, 
  Footer, 
  SubjectTopicGrid,
  ContactForm,
  MoreResources,
  ExamBoardPage
} from '@/components'
import { validateCloneId, getCompleteCloneData, getSubjectPageForClone } from '../../../../../lib/cloneUtils'
import { getExamBoardPage } from '../../../../../lib/sanity'
import { generateSEOMetadata } from '../../../../../components/SEOHead'
import { SEOProvider } from '../../../../../contexts/SEOContext'
import { HeaderData, FooterData, ContactFormSectionData, SubjectPageData } from '../../../../../types/sanity'

// ===== TYPES =====

interface CloneSubjectPageProps {
  params: Promise<{
    cloneId: string
    subject: string
  }>
}

// ===== METADATA =====

export async function generateMetadata({ params }: CloneSubjectPageProps): Promise<Metadata> {
  const { cloneId, subject } = await params
  
  try {
    // Get clone-specific subject data for metadata
    const subjectResult = await getSubjectPageForClone(cloneId, subject)
    const subjectData = subjectResult.data as SubjectPageData | null
    const cloneData = await getCompleteCloneData(cloneId)
    
    if (!subjectData) {
      return generateSEOMetadata({
        title: 'Subject Not Found | CIE IGCSE Study Notes',
        description: 'The requested subject page could not be found.',
      })
    }
    
    const cloneName = cloneData?.clone?.cloneName || cloneId
    const title = `${subjectData.pageTitle || subjectData.title} - ${cloneName} | CIE IGCSE Study Notes`
    const description = subjectData.pageDescription || `Comprehensive ${subjectData.subjectName} study notes and revision materials for ${cloneName}.`
    
    return generateSEOMetadata({
      title,
      description,
      seoData: subjectData.seo,
    })
  } catch (error) {
    console.error('Error generating clone subject page metadata:', error)
    return generateSEOMetadata({
      title: 'IGCSE Notes - CIE Study Materials',
      description: 'Access comprehensive IGCSE study notes and revision materials.',
    })
  }
}

// ===== MAIN COMPONENT =====

export default async function CloneSubjectPage({ params }: CloneSubjectPageProps) {
  const { cloneId, subject } = await params
  
  // Basic validation
  const isValidCloneFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cloneId)
  const isValidSubjectFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subject)
  
  if (!isValidCloneFormat || !isValidSubjectFormat) {
    console.log(`Invalid format - cloneId: ${cloneId}, subject: ${subject}`)
    notFound()
  }

  // Validate clone exists
  const isValidClone = await validateCloneId(cloneId)
  if (!isValidClone) {
    console.log(`Clone not found: ${cloneId}`)
    notFound()
  }

  // Get clone-specific subject data
  const subjectResult = await getSubjectPageForClone(cloneId, subject)
  const subjectData = subjectResult.data as SubjectPageData | null
  
  if (!subjectData) {
    console.log(`Subject not found: ${subject} for clone: ${cloneId}`)
    console.log(`Subject data source: ${subjectResult.source}`)
    notFound()
  }

  // Log which data source was used
  console.log(`Using ${subjectResult.source} subject data for ${cloneId}/${subject}`)

  // Get clone-specific components
  const cloneComponents = await getCompleteCloneData(cloneId)
  
  // Extract clone-specific data or use fallbacks (with null checks)
  const headerData = cloneComponents?.components?.header?.data as HeaderData | undefined
  const contactFormData = cloneComponents?.components?.contactForm?.data as ContactFormSectionData | undefined
  const footerData = cloneComponents?.components?.footer?.data as FooterData | undefined

  // Fetch exam board page for this clone (applies to all subjects)
  const examBoardPageData = await getExamBoardPage(cloneId)

  // Ensure topicBlockBackgroundColor has a default value if not set
  const backgroundColorClass = subjectData.topicBlockBackgroundColor || 'bg-blue-500'

  // Check if contact form should be shown
  const isContactFormActive = contactFormData?.isActive ?? false
  const showContactFormOnThisPage = subjectData.showContactForm ?? true
  const shouldShowContactForm = isContactFormActive && showContactFormOnThisPage

  // If exam board page exists, render it instead of the default subject page UI
  if (examBoardPageData) {
    return (
      <SEOProvider seoData={subjectData.seo}>
        <div className="min-h-screen bg-white">
          <Header headerData={headerData} isContactFormActive={shouldShowContactForm} homepageUrl={`/clone/${cloneId}/homepage`} />
          <main>
            <ExamBoardPage examBoardPageData={examBoardPageData} currentSubject={subject} />
          </main>
          {shouldShowContactForm && contactFormData && (
            <ContactForm contactFormData={contactFormData} />
          )}
          <Footer footerData={footerData} isContactFormActive={shouldShowContactForm} />
        </div>
      </SEOProvider>
    )
  }

  return (
    <SEOProvider seoData={subjectData.seo}>
      <div className="min-h-screen bg-white">
        <Header headerData={headerData} isContactFormActive={shouldShowContactForm} homepageUrl={`/clone/${cloneId}/homepage`} />
        
        <main>
          {/* Hero Section */}
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="font-serif font-bold mb-6" style={{fontSize: '55px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: '600'}}>
                  {subjectData.pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {subjectData.pageDescription}
                </p>
              </div>
            </div>
          </section>

          {/* Topics Grid Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <SubjectTopicGrid 
                topics={subjectData.topics} 
                topicBlockBackgroundColor={backgroundColorClass}
              />
            </div>
          </section>
        </main>
        
        {/* More Resources Section */}
        <MoreResources moreResourcesData={subjectData.moreResources} />
        
        {/* Contact Form Section - only show if active */}
        {shouldShowContactForm && (
          <ContactForm contactFormData={contactFormData} />
        )}
        
        <Footer footerData={footerData} isContactFormActive={shouldShowContactForm} />
      </div>
    </SEOProvider>
  )
} 