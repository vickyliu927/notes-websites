import { Metadata } from 'next'
import { headers } from 'next/headers'
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
import { 
  client, 
  headerQuery, 
  heroQuery, 
  subjectGridQuery, 
  whyChooseUsQuery, 
  faqQuery, 
  contactFormSectionQuery,
  footerQuery,
  allSubjectPagesQuery,
  getHomepageData,
  getSEOSettings
} from '../../lib/sanity'
import { 
  HeaderData, 
  HeroData, 
  SubjectGridData, 
  WhyChooseUsData, 
  FAQData, 
  ContactFormSectionData,
  FooterData,
  SubjectPageData
} from '../../types/sanity'
import { generateSEOMetadata } from '../../components/SEOHead'
import { SEOProvider } from '../../contexts/SEOContext'
import { 
  getCloneAwareHomepageData, 
  getCloneIdFromHeaders, 
  isCloneDomain 
} from '../../lib/cloneUtils'
import Link from 'next/link'

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const cloneId = getCloneIdFromHeaders(headersList)
  
  if (cloneId) {
    // Use clone-specific metadata
    const cloneData = await getCloneAwareHomepageData(headersList)
    const cloneName = cloneData.data?.clone?.cloneName || cloneId
    
    return generateSEOMetadata({
      title: `${cloneName} - Homepage | CIE IGCSE Study Notes`,
      description: `Access ${cloneName} variant of comprehensive CIE IGCSE study notes and revision materials.`,
    })
  }
  
  // Use default metadata
  const homepageData = await getHomepageData()
  const seoSettings = await getSEOSettings()
  
  const seoData = {
    metaTitle: seoSettings?.metaTitle,
    metaDescription: seoSettings?.metaDescription,
    noFollowExternal: seoSettings?.noFollowExternal
  }
  
  return generateSEOMetadata({
    title: homepageData?.pageTitle || 'CIE IGCSE Notes',
    description: homepageData?.pageDescription,
    seoData
  })
}

// Clone-aware data fetching functions
async function getCloneAwareHeaderData(): Promise<HeaderData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.header?.data) {
    console.log('Using clone-specific header data')
    return cloneData.data.components.header.data as HeaderData
  }
  
  // Fallback to default header data
  try {
    console.log('Using default header data')
    const headerData = await client.fetch(headerQuery)
    return headerData
  } catch (error) {
    console.error('Error fetching header data:', error)
    return undefined
  }
}

async function getCloneAwareHeroData(): Promise<HeroData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.hero?.data) {
    console.log('Using clone-specific hero data')
    return cloneData.data.components.hero.data as HeroData
  }
  
  // Fallback to default hero data
  try {
    console.log('Using default hero data')
    const heroData = await client.fetch(heroQuery)
    return heroData
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return undefined
  }
}

async function getCloneAwareSubjectGridData(): Promise<SubjectGridData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.subjectGrid?.data) {
    console.log('Using clone-specific subject grid data')
    return cloneData.data.components.subjectGrid.data as SubjectGridData
  }
  
  // Fallback to default subject grid data
  try {
    console.log('Using default subject grid data')
    const subjectGridData = await client.fetch(subjectGridQuery)
    return subjectGridData
  } catch (error) {
    console.error('Error fetching subject grid data:', error)
    return undefined
  }
}

async function getCloneAwarePublishedSubjects(): Promise<SubjectPageData[]> {
  const headersList = await headers()
  const cloneId = getCloneIdFromHeaders(headersList)
  
  if (cloneId) {
    try {
      // Get published subjects that match this clone or are general
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
      console.log(`Using clone-specific subjects for ${cloneId}`)
      return publishedSubjects || []
    } catch (error) {
      console.error('Error fetching clone-specific subjects:', error)
    }
  }
  
  // Fallback to all published subjects
  try {
    console.log('Using default published subjects')
    const publishedSubjects = await client.fetch(allSubjectPagesQuery)
    return publishedSubjects || []
  } catch (error) {
    console.error('Error fetching published subjects:', error)
    return []
  }
}

async function getCloneAwareWhyChooseUsData(): Promise<WhyChooseUsData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.whyChooseUs?.data) {
    console.log('Using clone-specific why choose us data')
    return cloneData.data.components.whyChooseUs.data as WhyChooseUsData
  }
  
  // Fallback to default why choose us data
  try {
    console.log('Using default why choose us data')
    const whyChooseUsData = await client.fetch(whyChooseUsQuery)
    return whyChooseUsData
  } catch (error) {
    console.error('Error fetching why choose us data:', error)
    return undefined
  }
}

async function getCloneAwareFAQData(): Promise<FAQData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.faq?.data) {
    console.log('Using clone-specific FAQ data')
    return cloneData.data.components.faq.data as FAQData
  }
  
  // Fallback to default FAQ data
  try {
    console.log('Using default FAQ data')
    const faqData = await client.fetch(faqQuery)
    return faqData
  } catch (error) {
    console.error('Error fetching FAQ data:', error)
    return undefined
  }
}

async function getCloneAwareFooterData(): Promise<FooterData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.footer?.data) {
    console.log('Using clone-specific footer data')
    return cloneData.data.components.footer.data as FooterData
  }
  
  // Fallback to default footer data
  try {
    console.log('Using default footer data')
    const footerData = await client.fetch(footerQuery)
    return footerData
  } catch (error) {
    console.error('Error fetching footer data:', error)
    return undefined
  }
}

async function getCloneAwareContactFormData(): Promise<ContactFormSectionData | undefined> {
  const headersList = await headers()
  const cloneData = await getCloneAwareHomepageData(headersList)
  
  if (cloneData.data?.components?.contactForm?.data) {
    console.log('Using clone-specific contact form data')
    return cloneData.data.components.contactForm.data as ContactFormSectionData
  }
  
  // Fallback to default contact form data
  try {
    console.log('Using default contact form data')
    const contactFormSectionData = await client.fetch(contactFormSectionQuery)
    return contactFormSectionData
  } catch (error) {
    console.error('Error fetching contact form section data:', error)
    return undefined
  }
}

export default async function Home() {
  const headersList = headers()
  
  // Detailed header logging for debugging
  console.log('--- Headers received on page ---')
  for (const [key, value] of headersList.entries()) {
    console.log(`${key}: ${value}`)
  }
  console.log('---------------------------------')
  
  const cloneId = getCloneIdFromHeaders(headersList)
  const isClone = isCloneDomain(headersList)
  
  console.log(`🏠 Rendering homepage - Clone ID: ${cloneId}, Is Clone: ${isClone}`)
  
  // Fetch clone-aware data
  const headerData = await getCloneAwareHeaderData()
  const heroData = await getCloneAwareHeroData()
  const subjectGridData = await getCloneAwareSubjectGridData()
  const publishedSubjects = await getCloneAwarePublishedSubjects()
  const whyChooseUsData = await getCloneAwareWhyChooseUsData()
  const faqData = await getCloneAwareFAQData()
  const footerData = await getCloneAwareFooterData()
  const contactFormSectionData = await getCloneAwareContactFormData()
  
  // Get clone info for display
  let cloneInfo = null
  if (cloneId && isClone) {
    const cloneData = await getCloneAwareHomepageData(headersList)
    if (cloneData.data?.clone) {
      cloneInfo = {
        id: cloneId,
        name: cloneData.data.clone.cloneName,
        description: cloneData.data.clone.cloneDescription
      }
    }
  }

  // Create SEO data object
  const seoSettings = await getSEOSettings()
  const seoData = {
    metaTitle: seoSettings?.metaTitle,
    metaDescription: seoSettings?.metaDescription,
    noFollowExternal: seoSettings?.noFollowExternal
  }

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false

  return (
    <SEOProvider seoData={seoData}>
      <div className="min-h-screen bg-white">
        {/* Clone Indicator Banner - only show for clone domains */}
        {cloneInfo && (
          <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
            <div className="max-w-7xl mx-auto">
              🔄 <strong>Clone Version:</strong> {cloneInfo.name} 
              <span className="mx-2">•</span>
              <strong>ID:</strong> {cloneInfo.id}
              <span className="mx-2">•</span>
              <Link 
                href="/"
                className="text-blue-200 hover:text-blue-100 underline"
              >
                View Original Site
              </Link>
              <span className="mx-2">•</span>
              <Link 
                href="/admin/clones/"
                className="text-blue-200 hover:text-blue-100 underline"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}

        <Header headerData={headerData} isContactFormActive={isContactFormActive} />
        <main>
          <Hero heroData={heroData} />
          <SubjectGrid 
            subjectGridData={subjectGridData} 
            publishedSubjects={publishedSubjects}
            cloneId={cloneId || undefined}
          />
          <SubjectRequestBanner />
          <WhyChooseUs whyChooseUsData={whyChooseUsData} />
          <FAQ faqData={faqData} />
          {isContactFormActive && (
            <ContactForm contactFormData={contactFormSectionData} />
          )}
        </main>
        <Footer footerData={footerData} isContactFormActive={isContactFormActive} />
      </div>
    </SEOProvider>
  );
}
