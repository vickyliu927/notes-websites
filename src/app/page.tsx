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
  headerQuery, 
  heroQuery, 
  subjectGridQuery, 
  allSubjectPagesQuery, 
  whyChooseUsQuery, 
  faqQuery, 
  footerQuery,
  contactFormSectionQuery 
} from '../../lib/sanity'
import { 
  getHeaderWithFallback,
  getHeroWithFallback,
  getSubjectGridWithFallback,
  getWhyChooseUsWithFallback,
  getFAQWithFallback,
  getFooterWithFallback,
  getContactFormWithFallback
} from '../../lib/cloneQueries'
import { client } from '../../lib/sanity'
import { SEOProvider } from '../../contexts/SEOContext'
import { 
  HeaderData, 
  HeroData, 
  SubjectGridData, 
  SubjectPageData, 
  WhyChooseUsData, 
  FAQData, 
  FooterData,
  ContactFormSectionData 
} from '../../types/sanity'

// Revalidate every 10 seconds for fresh content during development
export const revalidate = 10;

// Function to get clone ID by domain
async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  console.log(`🔍 [DOMAIN_LOOKUP] Searching for hostname: "${hostname}"`)
  console.log(`🔍 [DOMAIN_LOOKUP] Hostname type: ${typeof hostname}, length: ${hostname.length}`)
  
  try {
    // Query Sanity for clone with matching custom domain from domains array
    const query = `
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    console.log(`🔍 [DOMAIN_LOOKUP] Executing query with hostname: "${hostname}"`)
    
    const result = await client.fetch(query, { hostname })
    console.log(`🔍 [DOMAIN_LOOKUP] Query result:`, JSON.stringify(result, null, 2))
    
    if (result?.cloneId?.current) {
      console.log(`✅ [DOMAIN_LOOKUP] Found clone: ${result.cloneId.current}`)
      return result.cloneId.current
    }
    
    console.log(`❌ [DOMAIN_LOOKUP] No clone found for hostname: "${hostname}"`)
    
    // Debug: Check what domains ARE configured
    const allClones = await client.fetch(`
      *[_type == "clone" && isActive == true] {
        cloneId,
        cloneName,
        "domains": metadata.domains
      }
    `)
    console.log(`🔍 [DOMAIN_LOOKUP] Available clone domains:`, JSON.stringify(allClones, null, 2))
    
    return null
  } catch (error) {
    console.error('❌ [DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Helper function to select best data from fallback query
function selectBestData<T>(fallbackResult: { cloneSpecific?: T; baseline?: T; default?: T }): T | undefined {
  return fallbackResult?.cloneSpecific || fallbackResult?.baseline || fallbackResult?.default
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const hostname = host?.split(':')[0] || 'localhost';
    
    // Check if this is a clone request
    let cloneId = null;
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
      cloneId = await getCloneIdByDomain(hostname);
    }

    // For now, return default metadata (can be enhanced later with clone-specific SEO)
    return {
      title: 'CIE IGCSE Notes',
      description: 'CIE IGCSE Notes'
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'CIE IGCSE Notes',
      description: 'CIE IGCSE Notes'
    }
  }
}

// Clone-aware data fetching functions
async function getHeaderData(cloneId?: string): Promise<HeaderData | undefined> {
  try {
    console.log(`Fetching header data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getHeaderWithFallback(cloneId));
      const headerData = selectBestData(fallbackResult) as HeaderData;
      console.log(`Fetched header data:`, headerData);
      return headerData;
    } else {
    const headerData = await client.fetch(headerQuery);
    console.log('Fetched header data:', headerData);
    return headerData;
    }
  } catch (error) {
    console.error('Error fetching header data:', error);
    return undefined;
  }
}

async function getHeroData(cloneId?: string): Promise<HeroData | undefined> {
  try {
    console.log(`Fetching hero data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getHeroWithFallback(cloneId));
      const heroData = selectBestData(fallbackResult) as HeroData;
      console.log(`Fetched hero data:`, heroData);
      return heroData;
    } else {
    const heroData = await client.fetch(heroQuery);
    console.log('Fetched hero data:', heroData);
    return heroData;
    }
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return undefined;
  }
}

async function getSubjectGridData(cloneId?: string): Promise<SubjectGridData | undefined> {
  try {
    console.log(`Fetching subject grid data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getSubjectGridWithFallback(cloneId));
      const subjectGridData = selectBestData(fallbackResult) as SubjectGridData;
      console.log(`Fetched subject grid data:`, subjectGridData);
      return subjectGridData;
    } else {
    const subjectGridData = await client.fetch(subjectGridQuery);
    console.log('Fetched subject grid data:', subjectGridData);
    return subjectGridData;
    }
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

async function getPublishedSubjectsForClone(cloneId: string): Promise<SubjectPageData[]> {
  try {
    console.log(`Fetching published subjects for clone: ${cloneId}`);
    
    // Get only published subject pages that are specifically assigned to this clone
    const publishedSubjects = await client.fetch(`
      *[_type == "subjectPage" && isPublished == true && 
        cloneReference->cloneId.current == "${cloneId}"
      ] {
        _id,
        title,
        subjectSlug,
        subjectName,
        pageTitle,
        pageDescription,
        seo,
        showContactForm,
        topicBlockBackgroundColor,
        topics,
        cloneReference
      }
    `);
    
    console.log(`Fetched ${publishedSubjects?.length || 0} subjects for clone ${cloneId}:`, publishedSubjects);
    return publishedSubjects || [];
  } catch (error) {
    console.error('Error fetching published subjects for clone:', error);
    return [];
  }
}

async function getWhyChooseUsData(cloneId?: string): Promise<WhyChooseUsData | undefined> {
  try {
    console.log(`Fetching why choose us data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getWhyChooseUsWithFallback(cloneId));
      const whyChooseUsData = selectBestData(fallbackResult) as WhyChooseUsData;
      console.log(`Fetched why choose us data:`, whyChooseUsData);
      return whyChooseUsData;
    } else {
    const whyChooseUsData = await client.fetch(whyChooseUsQuery);
    console.log('Fetched why choose us data:', whyChooseUsData);
    return whyChooseUsData;
    }
  } catch (error) {
    console.error('Error fetching why choose us data:', error);
    return undefined;
  }
}

async function getFAQData(cloneId?: string): Promise<FAQData | undefined> {
  try {
    console.log(`Fetching FAQ data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getFAQWithFallback(cloneId));
      const faqData = selectBestData(fallbackResult) as FAQData;
      console.log(`Fetched FAQ data:`, faqData);
      return faqData;
    } else {
    const faqData = await client.fetch(faqQuery);
    console.log('Fetched FAQ data:', faqData);
    return faqData;
    }
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return undefined;
  }
}

async function getFooterData(cloneId?: string): Promise<FooterData | undefined> {
  try {
    console.log(`Fetching footer data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getFooterWithFallback(cloneId));
      const footerData = selectBestData(fallbackResult) as FooterData;
      console.log(`Fetched footer data:`, footerData);
      return footerData;
    } else {
    const footerData = await client.fetch(footerQuery);
    console.log('Fetched footer data:', footerData);
    return footerData;
    }
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return undefined;
  }
}

async function getContactFormSectionData(cloneId?: string): Promise<ContactFormSectionData | undefined> {
  try {
    console.log(`Fetching contact form section data${cloneId ? ` for clone: ${cloneId}` : ' (default)'}...`);
    
    if (cloneId) {
      const fallbackResult = await client.fetch(getContactFormWithFallback(cloneId));
      const contactFormSectionData = selectBestData(fallbackResult) as ContactFormSectionData;
      console.log(`Fetched contact form section data:`, contactFormSectionData);
      return contactFormSectionData;
    } else {
    const contactFormSectionData = await client.fetch(contactFormSectionQuery);
    console.log('Fetched contact form section data:', contactFormSectionData);
    return contactFormSectionData;
    }
  } catch (error) {
    console.error('Error fetching contact form section data:', error);
    return undefined;
  }
}

async function getSEOSettings() {
  const seoSettings = await client.fetch(`
    *[_type == "seoSettings"][0] {
      metaTitle,
      metaDescription,
      noFollowExternal
    }
  `);
  return seoSettings;
}

export default async function Home() {
  // Read headers to get host information
  const headersList = await headers();
  const host = headersList.get('host');
  const hostname = host?.split(':')[0] || 'localhost';
  
  console.log('🌐 [HOMEPAGE] Raw host header:', host);
  console.log('🌐 [HOMEPAGE] Extracted hostname:', hostname);
  console.log('🌐 [HOMEPAGE] All headers:', Object.fromEntries(headersList.entries()));
  
  // Directly check if this is a custom domain
  let cloneId = null;
  const isLocalDevelopment = hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('.local');
  
  console.log('🌐 [HOMEPAGE] Is local development?', isLocalDevelopment);
  
  if (!isLocalDevelopment) {
    console.log('🌐 [HOMEPAGE] Custom domain detected, checking for clone...');
    cloneId = await getCloneIdByDomain(hostname);
  } else {
    console.log('🌐 [HOMEPAGE] Local development detected, skipping clone lookup');
  }
  
  console.log('🌐 [HOMEPAGE] Final clone detection result:', { 
    host, 
    hostname, 
    isLocalDevelopment, 
    cloneId 
  });

  // Fetch all data with clone awareness
  const headerData = await getHeaderData(cloneId || undefined);
  const heroData = await getHeroData(cloneId || undefined);
  const subjectGridData = await getSubjectGridData(cloneId || undefined);
  
  // Use clone-specific subject filtering if clone is detected
  const publishedSubjects = cloneId 
    ? await getPublishedSubjectsForClone(cloneId)
    : await getPublishedSubjects();
    
  console.log('📍 [HOMEPAGE] Using subjects for', cloneId ? `clone: ${cloneId}` : 'default site');
  
  const whyChooseUsData = await getWhyChooseUsData(cloneId || undefined);
  const faqData = await getFAQData(cloneId || undefined);
  const footerData = await getFooterData(cloneId || undefined);
  const seoSettings = await getSEOSettings();
  const contactFormSectionData = await getContactFormSectionData(cloneId || undefined);

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
          <SubjectGrid subjectGridData={subjectGridData} publishedSubjects={publishedSubjects} cloneId={cloneId || undefined} />
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