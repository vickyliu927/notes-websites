import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8udeaunz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'question-bank'
const apiVersion = '2023-12-01'
const token = process.env.SANITY_API_TOKEN

if (projectId === 'your_project_id_here') {
  console.warn('⚠️  Please set NEXT_PUBLIC_SANITY_PROJECT_ID in your .env.local file')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  // Add cache busting for development
  stega: {
    studioUrl: '/studio',
  },
})

// Cache-busting client for development
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  // Force fresh data by adding timestamp to requests in development
  perspective: process.env.NODE_ENV === 'development' ? 'previewDrafts' : 'published',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Enhanced GROQ query to properly fetch logo data with asset URL
export const headerQuery = `*[_type == "header" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  logo{
    asset->{
      _id,
      _ref,
      url
    },
    alt,
    hotspot,
    crop
  },
  navigation[]{
    label,
    href
  },
  ctaButton{
    text,
    href
  }
}`

// GROQ query to fetch hero section data
export const heroQuery = `*[_type == "hero" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  premiumTag,
  sectionTitle,
  sectionTitleHighlighted,
  sectionTitleNoHighlight,
  description,
  ctaButtons{
    primaryButton{
      text,
      href
    },
    secondaryButton{
      text,
      href
    }
  },
  statistics{
    studentsHelped{
      text,
      stats
    },
    subjectsCovered{
      text,
      stats
    },
    successRate{
      text,
      stats
    }
  },
  floatingCards[]{
    title,
    description,
    maxCharactersPerLine
  }
}`

// GROQ query to fetch subject grid data
export const subjectGridQuery = `*[_type == "subjectGrid" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  sectionTitleFirstPart,
  sectionTitleSecondPart,
  sectionDescription,
  subjects[]{
    name,
    image{
      asset->{
        _id,
        _ref,
        url
      },
      alt,
      hotspot,
      crop
    },
    description,
    color,
    dateUpdated,
    viewNotesButton{
      text,
      url
    }
  },
  viewAllButton{
    text,
    url
  },

}`

// GROQ query to fetch why choose us data
export const whyChooseUsQuery = `*[_type == "whyChooseUs" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  sectionTitleFirstPart,
  sectionTitleSecondPart,
  sectionDescription,
  highlight1{
    title,
    description
  },
  highlight2{
    title,
    description
  },
  highlight3{
    title,
    description
  },
  highlight4{
    title,
    description
  }
}`

// GROQ query to fetch FAQ data
export const faqQuery = `*[_type == "faq" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  sectionTitle,
  sectionDescription,
  faqs[]{
    question,
    answer
  },
  contactSupport{
    description,
    buttonText,
    buttonLink
  }
}`

// GROQ query to fetch contact form section data
export const contactFormSectionQuery = `*[_type == "contactFormSection" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  isActive,
  sectionTitle,
  sectionDescription,
  tutorChaseLink,
  backgroundStyle{
    gradientFrom,
    gradientTo
  },
  formSettings{
    successMessage{
      title,
      description
    },
    submitButtonText
  }
}`



// GROQ query to fetch footer data
export const footerQuery = `*[_type == "footer" && isActive == true && !defined(cloneReference)][0]{
  _id,
  title,
  isActive,
  websiteTitle,
  websiteDescription,
  quickLinks{
    sectionTitle,
    links[]{
      label,
      href
    }
  },
  popularSubjects{
    sectionTitle,
    links[]{
      label,
      href
    }
  },
  support{
    sectionTitle,
    links[]{
      label,
      href
    }
  },
  socialMedia{
    facebook,
    twitter,
    instagram,
    linkedin,
    youtube
  },
  contactInfo{
    sectionTitle,
    email{
      address,
      subtitle
    },
    phone{
      number,
      subtitle
    },
    location{
      address,
      subtitle
    }
  },
  layoutSettings{
    adaptiveSpacing,
    showCopyright,
    copyrightText
  }
}`

// GROQ query to fetch subjects page data
export const subjectsPageQuery = `*[_type == "subjectsPage" && isActive == true][0]{
  _id,
  title,
  pageTitle,
  pageDescription,
  subjectGridDisplayOrder,
  showAdditionalSubjects,
  additionalSubjects[]{
    name,
    image{
      asset->{
        _id,
        _ref,
        url
      },
      alt,
      hotspot,
      crop
    },
    description,
    color,
    dateUpdated,
    viewNotesButton{
      text,
      href
    },
    displayOrder
  },
  additionalSubjectRequestTitle,
  additionalSubjectRequestDescription,
  additionalSubjectRequestButton{
    text,
    href
  },
  seo{
    metaTitle,
    metaDescription,
    keywords
  }
}`

// GROQ query to fetch all published subject pages (for dynamic routing)
export const allSubjectPagesQuery = `*[_type == "subjectPage" && isPublished == true]{
  _id,
  title,
  subjectSlug,
  subjectName,
  pageTitle,
  pageDescription,
  topicBlockBackgroundColor,
  topics[]{
    topicName,
    topicDescription,
    color,
    subtopics[]{
      subtopicName,
      subtopicUrl,
      isComingSoon,
      subSubtopics[]{
        subSubtopicName,
        subSubtopicUrl,
        isComingSoon
      }
    },
    displayOrder
  },
  isPublished,
  showContactForm,
  seo{
    metaTitle,
    metaDescription,
    keywords
  }
}`

// GROQ query to fetch a specific subject page by slug
export const subjectPageBySlugQuery = (slug: string) => `*[_type == "subjectPage" && subjectSlug.current == "${slug}" && isPublished == true][0]{
  _id,
  title,
  subjectSlug,
  subjectName,
  pageTitle,
  pageDescription,
  topicBlockBackgroundColor,
  topics[]{
    topicName,
    topicDescription,
    color,
    subtopics[]{
      subtopicName,
      subtopicUrl,
      isComingSoon,
      subSubtopics[]{
        subSubtopicName,
        subSubtopicUrl,
        isComingSoon
      }
    },
    displayOrder
  },
  isPublished,
  showContactForm,
  moreResources{
    isActive,
    sectionTitle,
    resources[]{
      text,
      url
    }
  },
  seo{
    metaTitle,
    metaDescription,
    keywords,
    noFollowExternal
  }
}`

// GROQ query to fetch all subject page slugs (for static generation)
export const allSubjectSlugsQuery = `*[_type == "subjectPage" && isPublished == true].subjectSlug.current`

// Legacy GROQ query to fetch maths page data (for backward compatibility)
export const mathsPageQuery = `*[_type == "mathsPage"][0]{
  _id,
  title,
  pageTitle,
  pageDescription,
  topics[]{
    topicName,
    topicDescription,
    color,
    subtopics[]{
      subtopicName,
      subtopicUrl,
      isComingSoon,
      subSubtopics[]{
        subSubtopicName,
        subSubtopicUrl,
        isComingSoon
      }
    },
    displayOrder
  },
  seo{
    metaTitle,
    metaDescription,
    keywords,
    noFollowExternal
  }
}`

// GROQ query to fetch exam board page for a given clone and subject
export const examBoardPageQuery = (cloneId: string, subjectPageId: string) => `*[_type == "examBoardPage" && cloneReference->cloneId.current == "${cloneId}" && subjectPageReference._ref == "${subjectPageId}" && isActive == true][0]{
  _id,
  title,
  description,
  isActive,
  examBoards[] {
    id,
    name,
    customTitle,
    customDescription,
    logo {
      asset->{
        _id,
        url
      },
      alt,
      hotspot,
      crop
    },
    buttonLabel,
    buttonUrl
  }
}`;

// Helper function to get the appropriate client based on environment
function getClient() {
  return process.env.NODE_ENV === 'development' ? freshClient : client
}

// Homepage data query
export async function getHomepageData() {
  const query = `
    *[_type == "homepage" && isActive == true][0] {
      _id,
      title,
      pageTitle,
      pageDescription,
      sections
    }
  `
  
  try {
    const clientToUse = getClient()
    const data = await clientToUse.fetch(query)
    return data
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return null
  }
}

// SEO Settings query
export async function getSEOSettings() {
  const query = `
    *[_type == "homepageSEO" && isActive == true][0] {
      _id,
      title,
      metaTitle,
      metaDescription,
      noFollowExternal
    }
  `
  
  try {
    const clientToUse = getClient()
    const data = await clientToUse.fetch(query)
    return data
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return null
  }
}

// Global SEO settings query (fallback)
export async function getGlobalSEOSettings() {
  const query = `
    *[_type == "seoSettings" && isGlobal == true][0] {
      "seo": seo {
        metaTitle,
        metaDescription,
        noFollowExternal
      }
    }
  `
  
  try {
    const clientToUse = getClient()
    const data = await clientToUse.fetch(query)
    return data?.seo || null
  } catch (error) {
    console.error('Error fetching global SEO settings:', error)
    return null
  }
}

// Subject page data query (updated to include SEO)
export async function getSubjectPageData(slug: string) {
  const query = `
    *[_type == "subjectPage" && subjectSlug.current == $slug && isPublished == true][0] {
      _id,
      title,
      subjectSlug,
      subjectName,
      pageTitle,
      pageDescription,
      topicBlockBackgroundColor,
      isPublished,
      showContactForm,
      moreResources{
        isActive,
        sectionTitle,
        resources[]{
          text,
          url
        }
      },
      seo{
        metaTitle,
        metaDescription,
        keywords,
        noFollowExternal
      },
      topics[] {
        topicName,
        topicDescription,
        color,
        displayOrder,
        subtopics[] {
          subtopicName,
          subtopicUrl,
          isComingSoon,
          subSubtopics[] {
            subSubtopicName,
            subSubtopicUrl,
            isComingSoon
          }
        }
      }
    }
  `
  
  try {
    console.log('Fetching subject page data for slug:', slug)
    const clientToUse = getClient()
    const data = await clientToUse.fetch(query, { slug })
    console.log('Fetched data:', {
      slug,
      topicBlockBackgroundColor: data?.topicBlockBackgroundColor,
      hasTopics: !!data?.topics?.length
    })
    return data
  } catch (error) {
    console.error('Error fetching subject page data:', error)
    return null
  }
}

// Fetch function for exam board page
export async function getExamBoardPage(cloneId: string, subjectPageId: string) {
  const query = examBoardPageQuery(cloneId, subjectPageId);
  try {
    const clientToUse = getClient();
    const data = await clientToUse.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching exam board page:', error);
    return null;
  }
}