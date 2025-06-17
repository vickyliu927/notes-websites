'use client'

import { useState, useEffect } from 'react'
import { useCurrentCloneId } from '../contexts/CloneContext'
import {
  getHomepageForClone,
  getHeroForClone,
  getSubjectGridForClone,
  getWhyChooseUsForClone,
  getFAQForClone
} from '../lib/cloneUtils'

// ===== TYPES =====

interface UseCloneContentResult<T> {
  data: T | null
  source: 'clone-specific' | 'baseline' | 'default' | 'none'
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

type ComponentType = 'homepage' | 'hero' | 'subjectGrid' | 'whyChooseUs' | 'faq'

// ===== MAIN HOOK =====

export function useCloneContent<T>(
  componentType: ComponentType,
  fallbackCloneId?: string
): UseCloneContentResult<T> {
  const currentCloneId = useCurrentCloneId()
  const effectiveCloneId = currentCloneId || fallbackCloneId || 'default'
  
  const [data, setData] = useState<T | null>(null)
  const [source, setSource] = useState<'clone-specific' | 'baseline' | 'default' | 'none'>('none')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (): Promise<void> => {
    if (!effectiveCloneId) {
      setData(null)
      setSource('none')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      let result: { data: T | null; source: 'clone-specific' | 'baseline' | 'default' | 'none' }

      switch (componentType) {
        case 'homepage':
          result = await getHomepageForClone(effectiveCloneId) as any
          break
        case 'hero':
          result = await getHeroForClone(effectiveCloneId) as any
          break
        case 'subjectGrid':
          result = await getSubjectGridForClone(effectiveCloneId) as any
          break
        case 'whyChooseUs':
          result = await getWhyChooseUsForClone(effectiveCloneId) as any
          break
        case 'faq':
          result = await getFAQForClone(effectiveCloneId) as any
          break
        default:
          throw new Error(`Unsupported component type: ${componentType}`)
      }

      setData(result.data)
      setSource(result.source)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setData(null)
      setSource('none')
      console.error(`Error fetching ${componentType} for clone ${effectiveCloneId}:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [effectiveCloneId, componentType])

  return {
    data,
    source,
    isLoading,
    error,
    refetch: fetchData
  }
}

// ===== SPECIALIZED HOOKS =====

export function useCloneHomepage(fallbackCloneId?: string) {
  return useCloneContent<any>('homepage', fallbackCloneId)
}

export function useCloneHero(fallbackCloneId?: string) {
  return useCloneContent<any>('hero', fallbackCloneId)
}

export function useCloneSubjectGrid(fallbackCloneId?: string) {
  return useCloneContent<any>('subjectGrid', fallbackCloneId)
}

export function useCloneWhyChooseUs(fallbackCloneId?: string) {
  return useCloneContent<any>('whyChooseUs', fallbackCloneId)
}

export function useCloneFAQ(fallbackCloneId?: string) {
  return useCloneContent<any>('faq', fallbackCloneId)
}

// ===== UTILITY HOOKS =====

export function useCloneAwareData() {
  const currentCloneId = useCurrentCloneId()
  const homepage = useCloneHomepage()
  const hero = useCloneHero()
  const subjectGrid = useCloneSubjectGrid()
  const whyChooseUs = useCloneWhyChooseUs()
  const faq = useCloneFAQ()

  const isLoading = homepage.isLoading || hero.isLoading || subjectGrid.isLoading || 
                   whyChooseUs.isLoading || faq.isLoading

  const hasErrors = !!(homepage.error || hero.error || subjectGrid.error || 
                      whyChooseUs.error || faq.error)

  const refetchAll = async () => {
    await Promise.all([
      homepage.refetch(),
      hero.refetch(),
      subjectGrid.refetch(),
      whyChooseUs.refetch(),
      faq.refetch()
    ])
  }

  return {
    currentCloneId,
    components: {
      homepage,
      hero,
      subjectGrid,
      whyChooseUs,
      faq
    },
    isLoading,
    hasErrors,
    refetchAll
  }
}

// ===== PERFORMANCE HOOKS =====

export function useClonePreload(cloneId: string, components: ComponentType[] = []) {
  useEffect(() => {
    if (!cloneId || components.length === 0) return

    // Preload components in the background
    const preloadPromises = components.map(async (componentType) => {
      try {
        switch (componentType) {
          case 'homepage':
            return await getHomepageForClone(cloneId)
          case 'hero':
            return await getHeroForClone(cloneId)
          case 'subjectGrid':
            return await getSubjectGridForClone(cloneId)
          case 'whyChooseUs':
            return await getWhyChooseUsForClone(cloneId)
          case 'faq':
            return await getFAQForClone(cloneId)
        }
      } catch (error) {
        console.warn(`Failed to preload ${componentType} for clone ${cloneId}:`, error)
      }
    })

    Promise.all(preloadPromises).catch(() => {
      // Ignore preload errors - they're not critical
    })
  }, [cloneId, components])
} 