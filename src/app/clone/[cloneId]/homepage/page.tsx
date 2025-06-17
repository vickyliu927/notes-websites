import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { validateCloneId, getCompleteCloneData } from '../../../../../lib/cloneUtils'
import Link from 'next/link'

// ===== TYPES =====

interface CloneHomepageProps {
  params: Promise<{
    cloneId: string
  }>
}

// ===== METADATA =====

export async function generateMetadata({ params }: CloneHomepageProps): Promise<Metadata> {
  const { cloneId } = await params
  
  // Fetch clone data for metadata
  const cloneData = await getCompleteCloneData(cloneId)
  const cloneName = cloneData?.clone?.cloneName || cloneId
  
  return {
    title: `${cloneName} - Homepage | CIE IGCSE Study Notes`,
    description: `Access ${cloneName} variant of comprehensive CIE IGCSE study notes and revision materials.`,
  }
}

// ===== MAIN COMPONENT =====

export default async function CloneHomepage({ params }: CloneHomepageProps) {
  const { cloneId } = await params
  
  // Basic validation
  const isValidFormat = validateCloneId(cloneId)
  if (!isValidFormat) {
    redirect('/404')
  }

  // Fetch complete clone data
  const cloneData = await getCompleteCloneData(cloneId)
  
  // If clone doesn't exist or is inactive, redirect to 404
  if (!cloneData?.clone || !cloneData.clone.isActive) {
    redirect('/404')
  }

  const { clone, components } = cloneData

  return (
    <div className="min-h-screen bg-white">
      {/* Clone Indicator Banner */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
        <div className="max-w-7xl mx-auto">
          🔄 <strong>Clone Version:</strong> {clone.cloneName} 
          <span className="mx-2">•</span>
          <strong>ID:</strong> {cloneId}
          <span className="mx-2">•</span>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Original Site
          </Link>
          <span className="mx-2">•</span>
          <Link 
            href="/admin/clones/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {clone.cloneName}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This is the homepage for the <strong>{clone.cloneName}</strong> clone variant. 
            Experience personalized content and features tailored for this specific version.
          </p>
        </div>

        {/* Component Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Hero Section</h3>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                components.hero?.data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {components.hero?.source?.toUpperCase() || 'NONE'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {components.hero?.data ? 'Active' : 'Using default fallback'}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Subject Grid</h3>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                components.subjectGrid?.data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {components.subjectGrid?.source?.toUpperCase() || 'NONE'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {components.subjectGrid?.data ? 'Active' : 'Using default fallback'}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Why Choose Us</h3>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                components.whyChooseUs?.data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {components.whyChooseUs?.source?.toUpperCase() || 'NONE'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {components.whyChooseUs?.data ? 'Active' : 'Using default fallback'}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">FAQ Section</h3>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                components.faq?.data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {components.faq?.source?.toUpperCase() || 'NONE'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {components.faq?.data ? 'Active' : 'Using default fallback'}
            </p>
          </div>
        </div>

        {/* Clone Information */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Clone Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Clone Name:</dt>
                  <dd className="text-sm text-gray-900">{clone.cloneName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Clone ID:</dt>
                  <dd className="text-sm text-gray-900 font-mono">{cloneId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status:</dt>
                  <dd className={`text-sm ${clone.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {clone.isActive ? 'Active' : 'Inactive'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type:</dt>
                  <dd className="text-sm text-gray-900">
                    {clone.baselineClone ? 'Baseline Clone' : 'Standard Clone'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-sm text-gray-600">
                {clone.cloneDescription || 'No description provided for this clone.'}
              </p>
              
              {clone.metadata && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Metadata</h4>
                  <dl className="space-y-1">
                    {clone.metadata.targetAudience && (
                      <div>
                        <dt className="inline text-xs font-medium text-gray-500">Target Audience: </dt>
                        <dd className="inline text-xs text-gray-900">{clone.metadata.targetAudience}</dd>
                      </div>
                    )}
                    {clone.metadata.region && (
                      <div>
                        <dt className="inline text-xs font-medium text-gray-500">Region: </dt>
                        <dd className="inline text-xs text-gray-900">{clone.metadata.region}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏠 Original Site</h3>
            <p className="text-gray-600 mb-4">
              View the original homepage without clone modifications
            </p>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Main Website
            </Link>
          </div>
          
          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🧪 Test Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Access comprehensive clone system testing tools
            </p>
            <Link 
              href="/clone-system-test/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              System Tests
            </Link>
          </div>
          
          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Admin Panel</h3>
            <p className="text-gray-600 mb-4">
              Manage clones and view system analytics
            </p>
            <Link 
              href="/admin/clones/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Development Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚧</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-900">
                Phase 4 Development
              </h3>
              <p className="mt-2 text-yellow-700">
                This clone homepage is part of Phase 4 implementation. Full component integration 
                with clone-specific styling and content will be available in the next update.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Phase 4: Advanced Clone Features
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ===== REVALIDATION =====

export const revalidate = 60 