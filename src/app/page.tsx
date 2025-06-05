import { Metadata } from 'next'
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

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const homepageData = await getHomepageData()
  const seoSettings = await getSEOSettings()
  
  // Create SEO data object
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

async function getHeaderData(): Promise<HeaderData | undefined> {
  try {
    console.log('Fetching header data from Sanity...');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    
    const headerData = await client.fetch(headerQuery);
    console.log('Fetched header data:', headerData);
    return headerData;
  } catch (error) {
    console.error('Error fetching header data:', error);
    return undefined;
  }
}

async function getHeroData(): Promise<HeroData | undefined> {
  try {
    console.log('Fetching hero data from Sanity...');
    
    const heroData = await client.fetch(heroQuery);
    console.log('Fetched hero data:', heroData);
    return heroData;
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return undefined;
  }
}

async function getSubjectGridData(): Promise<SubjectGridData | undefined> {
  try {
    console.log('Fetching subject grid data from Sanity...');
    
    const subjectGridData = await client.fetch(subjectGridQuery);
    console.log('Fetched subject grid data:', subjectGridData);
    return subjectGridData;
  } catch (error) {
    console.error('Error fetching subject grid data:', error);
    return undefined;
  }
}

async function getPublishedSubjects(): Promise<SubjectPageData[]> {
  try {
    console.log('Fetching published subjects from Sanity...');
    
    const publishedSubjects = await client.fetch(allSubjectPagesQuery);
    console.log('Fetched published subjects:', publishedSubjects);
    return publishedSubjects || [];
  } catch (error) {
    console.error('Error fetching published subjects:', error);
    return [];
  }
}

async function getWhyChooseUsData(): Promise<WhyChooseUsData | undefined> {
  try {
    console.log('Fetching why choose us data from Sanity...');
    
    const whyChooseUsData = await client.fetch(whyChooseUsQuery);
    console.log('Fetched why choose us data:', whyChooseUsData);
    return whyChooseUsData;
  } catch (error) {
    console.error('Error fetching why choose us data:', error);
    return undefined;
  }
}

async function getFAQData(): Promise<FAQData | undefined> {
  try {
    console.log('Fetching FAQ data from Sanity...');
    
    const faqData = await client.fetch(faqQuery);
    console.log('Fetched FAQ data:', faqData);
    return faqData;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return undefined;
  }
}

async function getFooterData(): Promise<FooterData | undefined> {
  try {
    console.log('Fetching footer data from Sanity...');
    
    const footerData = await client.fetch(footerQuery);
    console.log('Fetched footer data:', footerData);
    return footerData;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return undefined;
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

export default async function Home() {
  const headerData = await getHeaderData();
  const heroData = await getHeroData();
  const subjectGridData = await getSubjectGridData();
  const publishedSubjects = await getPublishedSubjects();
  const whyChooseUsData = await getWhyChooseUsData();
  const faqData = await getFAQData();
  const footerData = await getFooterData();
  const seoSettings = await getSEOSettings();
  const contactFormSectionData = await getContactFormSectionData();

  // Create SEO data object
  const seoData = {
    metaTitle: seoSettings?.metaTitle,
    metaDescription: seoSettings?.metaDescription,
    noFollowExternal: seoSettings?.noFollowExternal
  }

  // Check if contact form is active
  const isContactFormActive = contactFormSectionData?.isActive ?? false;

  return (
    <SEOProvider seoData={seoData}>
      <div className="min-h-screen bg-white">
        <Header headerData={headerData} isContactFormActive={isContactFormActive} />
        <main>
          <Hero heroData={heroData} />
          <SubjectGrid subjectGridData={subjectGridData} publishedSubjects={publishedSubjects} />
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
