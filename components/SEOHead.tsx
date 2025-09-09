import { Metadata } from 'next'
import { SEOData } from '../types/sanity'

interface SEOHeadProps {
  title?: string
  description?: string
  seoData?: SEOData
}

export function generateSEOMetadata({
  title,
  description,
  seoData,
}: SEOHeadProps): Metadata {
  // Robust fallback system with multiple layers of safety
  const metaTitle = (seoData?.metaTitle && seoData.metaTitle.trim()) || 
                   (title && title.trim()) || 
                   'CIE IGCSE Study Notes';
  
  const metaDescription = (seoData?.metaDescription && seoData.metaDescription.trim()) || 
                         (description && description.trim()) || 
                         'Expert study notes and resources to help you excel in your CIE IGCSE exams with confidence.';
  
  // Ensure titles are reasonable length (avoid too long titles)
  const finalTitle = metaTitle.length > 60 ? metaTitle.substring(0, 57) + '...' : metaTitle;
  const finalDescription = metaDescription.length > 160 ? metaDescription.substring(0, 157) + '...' : metaDescription;
  
  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    robots: {
      index: true,
      follow: !seoData?.noFollowExternal, // Use noFollowExternal setting if available
    },
  }

  // Add debug logging to track SEO generation
  console.log('🔍 [SEO] Generated metadata:', {
    finalTitle,
    finalDescription,
    usedSeoData: !!seoData,
    seoTitle: seoData?.metaTitle,
    seoDescription: seoData?.metaDescription,
    noFollow: !!seoData?.noFollowExternal
  });

  return metadata
} 