'use client'

import { useEffect, useState } from 'react'
import { headers } from 'next/headers'

interface MiddlewareTestData {
  hostname: string
  pathname: string
  cloneId: string | null
  clonePath: string | null
  cloneSource: string | null
  timestamp: string
}

export default function MiddlewareTestPage() {
  const [testData, setTestData] = useState<MiddlewareTestData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current request information
    const hostname = window.location.hostname
    const pathname = window.location.pathname
    
    // Try to read headers that middleware should have set
    fetch('/api/debug-middleware')
      .then(res => res.json())
      .then(data => {
        setTestData({
          hostname,
          pathname,
          cloneId: data.cloneId,
          clonePath: data.clonePath,
          cloneSource: data.cloneSource,
          timestamp: new Date().toISOString()
        })
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching middleware data:', error)
        setTestData({
          hostname,
          pathname,
          cloneId: null,
          clonePath: null,
          cloneSource: null,
          timestamp: new Date().toISOString()
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading middleware test data...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Middleware Domain Detection Test</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Request Information</h2>
        <div className="space-y-2">
          <div><strong>Hostname:</strong> {testData?.hostname}</div>
          <div><strong>Pathname:</strong> {testData?.pathname}</div>
          <div><strong>Timestamp:</strong> {testData?.timestamp}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Middleware Detection Results</h2>
        <div className="space-y-2">
          <div>
            <strong>Clone ID:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              testData?.cloneId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {testData?.cloneId || 'Not detected'}
            </span>
          </div>
          <div>
            <strong>Clone Path:</strong> 
            <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {testData?.clonePath || 'N/A'}
            </span>
          </div>
          <div>
            <strong>Detection Source:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              testData?.cloneSource === 'domain' ? 'bg-blue-100 text-blue-800' :
              testData?.cloneSource === 'path' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              {testData?.cloneSource || 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• <strong>Domain Detection:</strong> Visit this page with a custom domain configured in Sanity</li>
          <li>• <strong>Path Detection:</strong> Visit <code>/clone/[cloneId]/debug/middleware-test</code></li>
          <li>• <strong>No Detection:</strong> Visit from main domain without clone path</li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Test URLs:</h3>
        <div className="space-y-1 text-sm font-mono">
          <div>• {window.location.origin}/debug/middleware-test</div>
          <div>• {window.location.origin}/clone/test-clone/debug/middleware-test</div>
          <div>• custom-domain.com/debug/middleware-test</div>
        </div>
      </div>
    </div>
  )
} 