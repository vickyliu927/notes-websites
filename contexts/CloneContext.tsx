'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CloneData, getClone, getAllClones, getBaseline } from '../lib/cloneUtils'

// ===== TYPES =====

interface CloneContextType {
  // Current clone state
  currentClone: CloneData | null
  currentCloneId: string | null
  
  // Available clones
  availableClones: CloneData[]
  baselineClone: CloneData | null
  
  // Loading states
  isLoading: boolean
  isLoadingClones: boolean
  
  // Actions
  setCurrentCloneId: (cloneId: string | null) => Promise<void>
  switchToClone: (cloneId: string) => Promise<void>
  switchToBaseline: () => Promise<void>
  refreshClones: () => Promise<void>
  
  // Utilities
  isCloneActive: (cloneId: string) => boolean
  getCloneBySlug: (slug: string) => CloneData | null
}

interface CloneProviderProps {
  children: ReactNode
  initialCloneId?: string | null
  enableAutoDetection?: boolean
}

// ===== CONTEXT CREATION =====

const CloneContext = createContext<CloneContextType | undefined>(undefined)

// ===== PROVIDER COMPONENT =====

export function CloneProvider({ 
  children, 
  initialCloneId = null,
  enableAutoDetection = true 
}: CloneProviderProps) {
  // State
  const [currentClone, setCurrentClone] = useState<CloneData | null>(null)
  const [currentCloneId, setCurrentCloneIdState] = useState<string | null>(initialCloneId)
  const [availableClones, setAvailableClones] = useState<CloneData[]>([])
  const [baselineClone, setBaselineClone] = useState<CloneData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingClones, setIsLoadingClones] = useState(true)

  // ===== UTILITIES =====

  const isCloneActive = (cloneId: string): boolean => {
    return availableClones.some(clone => 
      clone.cloneId.current === cloneId && clone.isActive
    )
  }

  const getCloneBySlug = (slug: string): CloneData | null => {
    return availableClones.find(clone => clone.cloneId.current === slug) || null
  }

  // ===== ACTIONS =====

  const setCurrentCloneId = async (cloneId: string | null): Promise<void> => {
    setIsLoading(true)
    try {
      setCurrentCloneIdState(cloneId)
      
      if (cloneId) {
        const clone = await getClone(cloneId)
        setCurrentClone(clone)
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentCloneId', cloneId)
        }
      } else {
        setCurrentClone(null)
        
        // Remove from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentCloneId')
        }
      }
    } catch (error) {
      console.error('Error setting current clone:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToClone = async (cloneId: string): Promise<void> => {
    if (!isCloneActive(cloneId)) {
      console.warn(`Clone ${cloneId} is not active or does not exist`)
      return
    }
    
    await setCurrentCloneId(cloneId)
    
    // Update URL if enableAutoDetection is true
    if (enableAutoDetection && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const newUrl = `/clone/${cloneId}${currentPath}`
      window.history.pushState({}, '', newUrl)
    }
  }

  const switchToBaseline = async (): Promise<void> => {
    if (baselineClone) {
      await switchToClone(baselineClone.cloneId.current)
    } else {
      console.warn('No baseline clone available')
    }
  }

  const refreshClones = async (): Promise<void> => {
    setIsLoadingClones(true)
    try {
      const [clones, baseline] = await Promise.all([
        getAllClones(),
        getBaseline()
      ])
      
      setAvailableClones(clones)
      setBaselineClone(baseline)
    } catch (error) {
      console.error('Error refreshing clones:', error)
    } finally {
      setIsLoadingClones(false)
    }
  }

  // ===== EFFECTS =====

  // Load available clones on mount
  useEffect(() => {
    refreshClones()
  }, [])

  // Auto-detect clone from URL on mount
  useEffect(() => {
    if (enableAutoDetection && typeof window !== 'undefined') {
      const path = window.location.pathname
      const cloneMatch = path.match(/^\/clone\/([^\/]+)/)
      
      if (cloneMatch) {
        const detectedCloneId = cloneMatch[1]
        setCurrentCloneId(detectedCloneId)
      } else {
        // Try to restore from localStorage
        const storedCloneId = localStorage.getItem('currentCloneId')
        if (storedCloneId) {
          setCurrentCloneId(storedCloneId)
        }
      }
    }
  }, [enableAutoDetection])

  // ===== CONTEXT VALUE =====

  const contextValue: CloneContextType = {
    // Current clone state
    currentClone,
    currentCloneId,
    
    // Available clones
    availableClones,
    baselineClone,
    
    // Loading states
    isLoading,
    isLoadingClones,
    
    // Actions
    setCurrentCloneId,
    switchToClone,
    switchToBaseline,
    refreshClones,
    
    // Utilities
    isCloneActive,
    getCloneBySlug
  }

  return (
    <CloneContext.Provider value={contextValue}>
      {children}
    </CloneContext.Provider>
  )
}

// ===== HOOK =====

export function useClone(): CloneContextType {
  const context = useContext(CloneContext)
  if (context === undefined) {
    throw new Error('useClone must be used within a CloneProvider')
  }
  return context
}

// ===== CONVENIENCE HOOKS =====

export function useCurrentClone(): CloneData | null {
  const { currentClone } = useClone()
  return currentClone
}

export function useCurrentCloneId(): string | null {
  const { currentCloneId } = useClone()
  return currentCloneId
}

export function useAvailableClones(): CloneData[] {
  const { availableClones } = useClone()
  return availableClones
}

export function useBaselineClone(): CloneData | null {
  const { baselineClone } = useClone()
  return baselineClone
}

// ===== DEBUG HELPERS (Development only) =====

export function CloneDebugInfo(): React.JSX.Element | null {
  const clone = useClone()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50 max-w-xs">
      <div className="font-bold">Clone Debug</div>
      <div>Current: {clone.currentCloneId || 'None'}</div>
      <div>Available: {clone.availableClones.length}</div>
      <div>Loading: {clone.isLoading ? 'Yes' : 'No'}</div>
      {clone.currentClone && (
        <div>Name: {clone.currentClone.cloneName}</div>
      )}
    </div>
  )
} 