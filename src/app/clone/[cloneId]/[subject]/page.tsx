'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CloneSubjectRedirectProps {
  params: Promise<{
    cloneId: string
    subject: string
  }>
}

// This page redirects old clone URLs to the new clean URL structure
export default function CloneSubjectRedirect({ params }: CloneSubjectRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    const redirect = async () => {
      const { subject } = await params
      console.log(`[CLONE_REDIRECT] Redirecting from /clone/*/${subject} to /${subject}`)
      router.replace(`/${subject}`)
    }
    redirect()
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
} 