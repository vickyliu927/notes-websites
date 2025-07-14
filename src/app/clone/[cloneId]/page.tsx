import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { 
  Header, 
  Hero, 
  SubjectGrid, 
  WhyChooseUs, 
  FAQ, 
  ContactForm,
  Footer,
  SubjectRequestBanner
} from '@/components'
import { validateCloneId, getCompleteCloneData } from '../../../../lib/cloneUtils'
import { 
  client, 
  allSubjectPagesQuery,
  getHomepageData,
  getSEOSettings
} from '../../../../lib/sanity'
import { 
  SubjectPageData,
  HeaderData,
  HeroData,
  SubjectGridData,
  WhyChooseUsData,
  FAQData,
  ContactFormSectionData,
  FooterData
} from '../../../../types/sanity'
import { generateSEOMetadata } from '../../../../components/SEOHead'
import { SEOProvider } from '../../../../contexts/SEOContext'
import Link from 'next/link'

// ===== TYPES =====

interface CloneHomepageProps {
  params: Promise<{
    cloneId: string
  }>
}

// ===== METADATA =====

export async function generateMetadata({ params }: CloneHomepageProps): Promise<Metadata> {
  const { cloneId } = await params
  
  return {
    title: `${cloneId} Clone | CIE IGCSE Study Notes`,
    description: `Access ${cloneId} variant of comprehensive CIE IGCSE study notes and revision materials.`,
  }
}

// ===== MAIN COMPONENT =====

export default async function CloneWebsite({ params }: CloneHomepageProps) {
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

  // Fetch additional data that isn't clone-specific (yet)
  const publishedSubjects = await getPublishedSubjects()
  const seoSettings = await getSEOSettings()

  // Create SEO data object
  const seoData = {
    metaTitle: seoSettings?.metaTitle,
    metaDescription: seoSettings?.metaDescription,
    noFollowExternal: seoSettings?.noFollowExternal
  }

  // Extract clone-specific data or use fallbacks
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
    <SEOProvider seoData={seoData}>
      <div className="min-h-screen bg-white">
        {/* Clone Indicator Banner */}
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
          <div className="max-w-7xl mx-auto">
            🔄 <strong>Clone:</strong> {clone.cloneName} 
            <span className="mx-2">•</span>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View Original
            </Link>
            <span className="mx-2">•</span>
            <a href={`/clone/${cloneId}/homepage`} className="underline hover:no-underline">
              Dashboard
            </a>
          </div>
        </div>

        <Header headerData={headerData} isContactFormActive={isContactFormActive} homepageUrl={`/clone/${cloneId}/homepage`} />
        <main>
          <Hero heroData={heroData} />
          <SubjectGrid subjectGridData={subjectGridData} publishedSubjects={publishedSubjects} cloneId={cloneId} />
          <SubjectRequestBanner />
          <WhyChooseUs whyChooseUsData={whyChooseUsData} />
          <FAQ faqData={faqData} />
          {isContactFormActive && (
            <ContactForm contactFormData={contactFormData} />
          )}
        </main>
        <Footer footerData={footerData} />
      </div>
    </SEOProvider>
  )
}

async function getPublishedSubjects(): Promise<SubjectPageData[]> {
  try {
    const publishedSubjects = await client.fetch(allSubjectPagesQuery)
    return publishedSubjects || []
  } catch (error) {
    console.error('Error fetching published subjects:', error)
    return []
  }
}

// ===== REVALIDATION =====

export const revalidate = 60 