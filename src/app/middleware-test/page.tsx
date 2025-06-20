'use client'

import { useState, useEffect } from 'react'

export default function MiddlewareTest() {
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
        <div className="text-lg">Loading debug information...</div>
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
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Middleware Debug Test
          </h1>
          
          <div className="space-y-6">
            
            {/* Current Status */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Hostname:</span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                    {debugInfo?.hostname}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Clone ID:</span>
                  <code className={`ml-2 px-2 py-1 rounded ${
                    debugInfo?.currentCloneId ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
                    {debugInfo?.currentCloneId || 'None'}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Is Clone Domain:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    debugInfo?.isCloneDomain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo?.isCloneDomain ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {debugInfo?.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Domain Mapping */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Domain Mapping</h2>
              <div className="space-y-2">
                {Object.entries(debugInfo?.domainMapping || {}).map(([domain, cloneId]) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <code className="bg-white px-3 py-1 rounded border">
                      {domain}
                    </code>
                    <span>→</span>
                    <code className="bg-white px-3 py-1 rounded border">
                      {cloneId as string}
                    </code>
                    {domain === debugInfo?.hostname && (
                      <span className="text-green-600 font-medium">← Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Behavior */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Expected Behavior</h2>
              {debugInfo?.isCloneDomain ? (
                <div className="space-y-2">
                  <p className="text-green-700">
                    ✅ This domain should serve clone content with clean URLs
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><code>/</code> → Should serve <code>/clone/{debugInfo.currentCloneId}/homepage</code> content</li>
                    <li><code>/maths</code> → Should serve <code>/clone/{debugInfo.currentCloneId}/maths</code> content</li>
                    <li><code>/clone/{debugInfo.currentCloneId}</code> → Should redirect to <code>/</code></li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ This domain is not mapped to a clone
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><code>/clone/test-clone</code> → Should redirect to <code>igcse-questions.com</code></li>
                    <li>Regular pages should work normally</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Test Links */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Links</h2>
              <div className="space-y-3">
                <a 
                  href="/"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Test Homepage (/)
                </a>
                <a 
                  href="/clone/test-clone"
                  className="block text-orange-600 hover:text-orange-800 underline"
                >
                  Test Clone URL (/clone/test-clone)
                </a>
                <a 
                  href="/clone/test-clone/homepage"
                  className="block text-orange-600 hover:text-orange-800 underline"
                >
                  Test Clone Homepage (/clone/test-clone/homepage)
                </a>
              </div>
            </div>

            {/* Raw Debug Data */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Raw Debug Data</h2>
              <pre className="bg-white p-4 rounded border overflow-auto text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 