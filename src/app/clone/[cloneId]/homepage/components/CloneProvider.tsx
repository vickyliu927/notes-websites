'use client'

import { CloneProvider as BaseCloneProvider, CloneDebugInfo } from '../../../../../../contexts/CloneContext'

interface CloneProviderProps {
  cloneId: string
  children: React.ReactNode
}

export default function CloneProvider({ cloneId, children }: CloneProviderProps) {
  return (
    <BaseCloneProvider 
      initialCloneId={cloneId}
      enableAutoDetection={false} // We're explicitly setting the clone
    >
      {children}
      <CloneDebugInfo />
    </BaseCloneProvider>
  )
} 