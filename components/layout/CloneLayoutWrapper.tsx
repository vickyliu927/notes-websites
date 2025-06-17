'use client'

import React from 'react'
import { CloneProvider, CloneDebugInfo } from '../../contexts/CloneContext'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface CloneLayoutWrapperProps {
  children: ReactNode
  cloneId?: string
}

// Client component to handle clone detection
function CloneDetector({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [cloneId, setCloneId] = useState<string | null>(null)
  const [isCloneRoute, setIsCloneRoute] = useState(false)

  useEffect(() => {
    // Parse clone ID from pathname
    const cloneMatch = pathname.match(/^\/clone\/([^\/]+)/)
    if (cloneMatch) {
      const detectedCloneId = cloneMatch[1]
      setCloneId(detectedCloneId)
      setIsCloneRoute(true)
    } else {
      setCloneId(null)
      setIsCloneRoute(false)
    }
  }, [pathname])

  // If this is a clone route, wrap with CloneProvider
  if (isCloneRoute && cloneId) {
    return (
      <CloneProvider 
        initialCloneId={cloneId}
        enableAutoDetection={true}
      >
        {children}
        <CloneDebugInfo />
      </CloneProvider>
    )
  }

  // For non-clone routes, render without clone context
  return <>{children}</>
}

// Main wrapper component
export default function CloneLayoutWrapper({
  children,
  cloneId
}: CloneLayoutWrapperProps) {
  return (
    <CloneDetector>
      {children}
    </CloneDetector>
  )
} 