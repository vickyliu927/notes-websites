import { Metadata } from 'next'

interface CloneSEOProps {
  pageTitle?: string
  pageDescription?: string
  cloneSiteTitle?: string
  cloneSiteDescription?: string
  keywords?: string[]
  author?: string
  url?: string
}

export function generateCloneSEOMetadata({
  pageTitle,
  pageDescription,
  cloneSiteTitle,
  cloneSiteDescription,
  keywords = ['CIE IGCSE', 'study notes', 'revision', 'exam preparation', 'IGCSE subjects', 'Cambridge International'],
  author = 'CIE IGCSE Study Notes Team',
  url
}: CloneSEOProps): Metadata {
  // Use clone-specific site title or fallback to default
  const siteTitle = cloneSiteTitle || 'CIE IGCSE Notes'
  
  // Generate full title: "Page Title - Site Title" or just "Site Title"
  const fullTitle = pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle
  
  // Use page description, fallback to clone description, then default
  const description = pageDescription || cloneSiteDescription || 'Access comprehensive IGCSE study notes and revision materials.'

  return {
    title: fullTitle,
    description: description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: fullTitle,
      description: description,
      type: 'website',
      url: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
    },
  }
} 