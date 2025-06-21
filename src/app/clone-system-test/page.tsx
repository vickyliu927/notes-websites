'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CloneSystemTest() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const response = await fetch('/api/debug-middleware')
        const data = await response.json()
        setDebugInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading clone system debug information...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔄 Clone System Test
          </h1>

          <div className="space-y-8">
            {/* Current Domain Info */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Domain Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Hostname:</strong> {debugInfo?.hostname}
                  </div>
                  <div>
                    <strong>Is Clone Domain:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      debugInfo?.isCloneDomain ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {debugInfo?.isCloneDomain ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <strong>Clone ID:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      debugInfo?.currentCloneId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {debugInfo?.currentCloneId || 'None'}
                    </span>
                  </div>
                  <div>
                    <strong>Pathname:</strong> {debugInfo?.pathname}
                  </div>
                </div>
              </div>
            </section>

            {/* Domain Mapping */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Domain Mapping Configuration</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  {Object.entries(debugInfo?.domainMapping || {}).map(([domain, cloneId]) => (
                    <div key={domain} className="flex justify-between items-center p-3 bg-white rounded border">
                      <span className="font-mono text-sm">{domain}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        → {cloneId as string}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Test Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Navigation</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Homepage Tests</h3>
                    <div className="space-y-2">
                      <Link 
                        href="/" 
                        className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                      >
                        Test Current Domain Homepage
                      </Link>
                      <Link 
                        href="/clone/test-clone/homepage" 
                        className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
                      >
                        Test Clone Homepage (Direct)
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Subject Page Tests</h3>
                    <div className="space-y-2">
                      <Link 
                        href="/mathematics" 
                        className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                      >
                        Test Mathematics Page
                      </Link>
                      <Link 
                        href="/clone/test-clone/mathematics" 
                        className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
                      >
                        Test Clone Mathematics (Direct)
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Headers Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Response Headers</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  {Object.entries(debugInfo?.headers || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-white rounded border text-sm">
                      <span className="font-mono">{key}:</span>
                      <span className="font-mono text-gray-600">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Expected Behavior */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expected Behavior</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-700">✅ Working Correctly If:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2">
                      <li>Clone domains show clone-specific content on clean URLs (/)</li>
                      <li>Non-clone domains show default content</li>
                      <li>Direct clone URLs redirect to clean URLs for clone domains</li>
                      <li>Direct clone URLs redirect to appropriate domains for non-clone domains</li>
                      <li>Clone indicator banner appears on clone domains</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700">❌ Issues If:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2">
                      <li>Clone domains still show default content</li>
                      <li>URLs are rewritten to /clone/ paths</li>
                      <li>Redirects are not working properly</li>
                      <li>Headers are not being set correctly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 