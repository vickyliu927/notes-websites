import { client } from './sanity'
import {
  getCloneData,
  getAllActiveClones,
  getBaselineClone,
  getHomepageWithFallback,
  getHeroWithFallback,
  getSubjectGridWithFallback,
  getWhyChooseUsWithFallback,
  getFAQWithFallback,
  getHeaderWithFallback,
  getFooterWithFallback,
  getContactFormWithFallback,
  getSubjectPageWithFallback,
  getCloneComponentSummary
} from './cloneQueries'

// ===== TYPES =====

export interface CloneData {
  _id: string
  cloneId: {
    current: string
  }
  cloneName: string
  cloneDescription?: string
  isActive: boolean
  baselineClone: boolean
  metadata?: {
    targetAudience?: string
    region?: string
    customDomain?: string
  }
  createdAt: string
  updatedAt: string
}

export interface FallbackResult<T> {
  cloneSpecific: T | null
  baseline: T | null
  default: T | null
}

// ===== CORE FUNCTIONS =====

export async function getClone(cloneId: string): Promise<CloneData | null> {
  try {
    const clone = await client.fetch(getCloneData(cloneId))
    return clone
  } catch (error) {
    console.error('Error fetching clone:', error)
    return null
  }
}

export async function getAllClones(): Promise<CloneData[]> {
  try {
    const clones = await client.fetch(getAllActiveClones)
    return clones || []
  } catch (error) {
    console.error('Error fetching all clones:', error)
    return []
  }
}

export async function getBaseline(): Promise<CloneData | null> {
  try {
    const baseline = await client.fetch(getBaselineClone)
    return baseline
  } catch (error) {
    console.error('Error fetching baseline clone:', error)
    return null
  }
}

// ===== FALLBACK LOGIC =====

export function resolveFallback<T>(fallbackResult: FallbackResult<T>): T | null {
  // Priority: clone-specific → baseline → default → null
  return fallbackResult.cloneSpecific || fallbackResult.baseline || fallbackResult.default || null
}

export function resolveFallbackWithInfo<T>(fallbackResult: FallbackResult<T>): {
  data: T | null
  source: 'clone-specific' | 'baseline' | 'default' | 'none'
} {
  if (fallbackResult.cloneSpecific) {
    return { data: fallbackResult.cloneSpecific, source: 'clone-specific' }
  }
  if (fallbackResult.baseline) {
    return { data: fallbackResult.baseline, source: 'baseline' }
  }
  if (fallbackResult.default) {
    return { data: fallbackResult.default, source: 'default' }
  }
  return { data: null, source: 'none' }
}

// ===== COMPONENT-SPECIFIC FUNCTIONS =====

export async function getHomepageForClone(cloneId: string) {
  try {
    const result = await client.fetch(getHomepageWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching homepage for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getHeroForClone(cloneId: string) {
  try {
    const result = await client.fetch(getHeroWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching hero for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getSubjectGridForClone(cloneId: string) {
  try {
    const result = await client.fetch(getSubjectGridWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching subject grid for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getWhyChooseUsForClone(cloneId: string) {
  try {
    const result = await client.fetch(getWhyChooseUsWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching why choose us for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getFAQForClone(cloneId: string) {
  try {
    const result = await client.fetch(getFAQWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching FAQ for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getHeaderForClone(cloneId: string) {
  try {
    const result = await client.fetch(getHeaderWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching header for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getFooterForClone(cloneId: string) {
  try {
    const result = await client.fetch(getFooterWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching footer for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getContactFormForClone(cloneId: string) {
  try {
    const result = await client.fetch(getContactFormWithFallback(cloneId))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching contact form for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

export async function getSubjectPageForClone(cloneId: string, slug: string) {
  try {
    const result = await client.fetch(getSubjectPageWithFallback(cloneId, slug))
    return resolveFallbackWithInfo(result)
  } catch (error) {
    console.error('Error fetching subject page for clone:', error)
    return { data: null, source: 'none' as const }
  }
}

// ===== COMPREHENSIVE CLONE DATA =====

export async function getCompleteCloneData(cloneId: string) {
  try {
    const [
      clone,
      homepage,
      header,
      hero,
      subjectGrid,
      whyChooseUs,
      faq,
      contactForm,
      footer,
      summary
    ] = await Promise.all([
      getClone(cloneId),
      getHomepageForClone(cloneId),
      getHeaderForClone(cloneId),
      getHeroForClone(cloneId),
      getSubjectGridForClone(cloneId),
      getWhyChooseUsForClone(cloneId),
      getFAQForClone(cloneId),
      getContactFormForClone(cloneId),
      getFooterForClone(cloneId),
      client.fetch(getCloneComponentSummary(cloneId))
    ])

    return {
      clone,
      components: {
        homepage,
        header,
        hero,
        subjectGrid,
        whyChooseUs,
        faq,
        contactForm,
        footer
      },
      summary
    }
  } catch (error) {
    console.error('Error fetching complete clone data:', error)
    return null
  }
}

// ===== VALIDATION FUNCTIONS =====

export function validateCloneId(cloneId: string): boolean {
  // Check if cloneId is a valid slug format
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(cloneId)
}

export function isCloneActive(clone: CloneData | null): boolean {
  return clone?.isActive === true
}

export function isBaselineClone(clone: CloneData | null): boolean {
  return clone?.baselineClone === true && clone?.isActive === true
}

// ===== HELPER FUNCTIONS =====

export function getCloneSlug(clone: CloneData | null): string | null {
  return clone?.cloneId?.current || null
}

export function getCloneName(clone: CloneData | null): string | null {
  return clone?.cloneName || null
}

export function getCloneMetadata(clone: CloneData | null) {
  return clone?.metadata || null
}

// ===== URL GENERATION =====

export function generateCloneUrl(cloneId: string, path: string = ''): string {
  const validCloneId = validateCloneId(cloneId) ? cloneId : 'default'
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/clone/${validCloneId}${cleanPath}`
}

export function parseCloneUrl(url: string): { cloneId: string | null; path: string } {
  const match = url.match(/^\/clone\/([^\/]+)(.*)$/)
  if (match) {
    return {
      cloneId: match[1],
      path: match[2] || '/'
    }
  }
  return {
    cloneId: null,
    path: url
  }
}

// ===== HEADER UTILITIES =====

export function getCloneIdFromHeaders(headers: Headers): string | null {
  try {
    const cloneId = headers.get('x-clone-id')
    console.log('🔍 Extracted clone ID from headers:', cloneId)
    return cloneId
  } catch (error) {
    console.error('Error extracting clone ID from headers:', error)
    return null
  }
}

export function isCloneDomain(headers: Headers): boolean {
  try {
    const isClone = headers.get('x-clone-domain') === 'true'
    console.log('🔍 Is clone domain:', isClone)
    return isClone
  } catch (error) {
    console.error('Error checking if clone domain:', error)
    return false
  }
}

// ===== CLONE-AWARE DATA FETCHING =====

export async function getCloneAwareHomepageData(headers: Headers) {
  const cloneId = getCloneIdFromHeaders(headers)
  
  if (cloneId) {
    console.log(`🏠 Fetching clone-specific homepage data for ${cloneId}`)
    const cloneData = await getCompleteCloneData(cloneId)
    
    if (cloneData?.clone && cloneData.clone.isActive) {
      return {
        data: cloneData,
        source: 'clone-specific' as const,
        cloneId
      }
    }
  }
  
  console.log('🏠 Using default homepage data')
  return {
    data: null,
    source: 'default' as const,
    cloneId: null
  }
}

export async function getCloneAwareSubjectData(subject: string, headers: Headers) {
  const cloneId = getCloneIdFromHeaders(headers)
  
  if (cloneId) {
    console.log(`📚 Fetching clone-specific subject data for ${cloneId}/${subject}`)
    const subjectResult = await getSubjectPageForClone(cloneId, subject)
    
    if (subjectResult.data) {
      return {
        data: subjectResult.data,
        source: subjectResult.source,
        cloneId
      }
    }
  }
  
  console.log(`📚 Using default subject data for ${subject}`)
  return {
    data: null,
    source: 'default' as const,
    cloneId: null
  }
} 