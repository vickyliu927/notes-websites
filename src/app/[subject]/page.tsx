import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header, Footer, SubjectTopicGrid, ContactForm, MoreResources } from '@/components'
import { client, headerQuery, footerQuery, getSubjectPageData, getGlobalSEOSettings, allSubjectSlugsQuery, contactFormSectionQuery } from '../../../lib/sanity'
import { HeaderData, FooterData, ContactFormSectionData } from '../../../types/sanity'
import { generateSEOMetadata } from '../../../components/SEOHead'
import { SEOProvider } from '../../../contexts/SEOContext'

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

interface SubjectPageProps {
  params: Promise<{
    subject: string
  }>
}

async function getHeaderData(): Promise<HeaderData | undefined> {
  try {
    const headerData = await client.fetch(headerQuery)
    return headerData
  } catch (error) {
    console.error('Error fetching header data:', error)
    return undefined
  }
}

async function getFooterData(): Promise<FooterData | undefined> {
  try {
    const footerData = await client.fetch(footerQuery)
    return footerData
  } catch (error) {
    console.error('Error fetching footer data:', error)
    return undefined
  }
}

async function getContactFormSectionData(): Promise<ContactFormSectionData | undefined> {
  try {
    console.log('Fetching contact form section data from Sanity...');
    
    const contactFormSectionData = await client.fetch(contactFormSectionQuery);
    console.log('Fetched contact form section data:', contactFormSectionData);
    return contactFormSectionData;
  } catch (error) {
    console.error('Error fetching contact form section data:', error);
    return undefined;
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
  const subjectPageData = await getSubjectPageData(subject)
  
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
  const headerData = await getHeaderData()
  const footerData = await getFooterData()
  const subjectPageData = await getSubjectPageData(subject)
  const contactFormSectionData = await getContactFormSectionData()

  if (!subjectPageData) {
    notFound()
  }

  // Debug log to check the data
  console.log('Subject page data:', {
    subject,
    topicBlockBackgroundColor: subjectPageData.topicBlockBackgroundColor,
    topics: subjectPageData.topics?.length
  })

  // Ensure topicBlockBackgroundColor has a default value if not set
  const backgroundColorClass = subjectPageData.topicBlockBackgroundColor || 'bg-blue-500'

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false;
  const showContactFormOnThisPage = subjectPageData.showContactForm ?? true; // Default to true for backward compatibility
  const shouldShowContactForm = isContactFormActive && showContactFormOnThisPage;

  return (
    <SEOProvider seoData={subjectPageData.seo}>
      <div className="min-h-screen bg-white">
        <Header headerData={headerData} isContactFormActive={shouldShowContactForm} />
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