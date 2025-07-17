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

} from '@/components'
import { HeaderData, HeroData, SubjectGridData, WhyChooseUsData, FAQData, ContactFormSectionData, FooterData, SubjectPageData } from '../../../../../types/sanity'
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