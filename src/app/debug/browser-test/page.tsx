'use client'

import { useEffect, useState } from 'react'

interface DebugData {
  // Client-side info
  userAgent: string
  hostname: string
  protocol: string
  port: string
  pathname: string
  
  // Server-side headers from API
  serverHeaders: {
    cloneId: string | null
    cloneSource: string | null
    browserType: string | null
    requestInfo: {
      hostname: string
      pathname: string
      origin: string
    }
    headers: {
      host: string
      userAgent: string
      referer: string | null
      acceptLanguage: string | null
      acceptEncoding: string | null
    }
    allHeaders: Record<string, string>
    timestamp: string
  } | null
  
  // Additional browser info
  browserInfo: {
    name: string
    isSafari: boolean
    isChrome: boolean
    isFirefox: boolean
    cookiesEnabled: boolean
    localStorage: boolean
  }
}

export default function BrowserTestPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const detectBrowser = (userAgent: string) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
    const isChrome = /chrome/i.test(userAgent) && !/edge/i.test(userAgent)
    const isFirefox = /firefox/i.test(userAgent)
    
    let name = 'Unknown'
    if (isChrome) name = 'Chrome'
    else if (isSafari) name = 'Safari'
    else if (isFirefox) name = 'Firefox'
    
    return { name, isSafari, isChrome, isFirefox }
  }

  const checkBrowserFeatures = () => {
    return {
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof(Storage) !== "undefined"
    }
  }

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        // Get client-side information
        const userAgent = navigator.userAgent
        const hostname = window.location.hostname
        const protocol = window.location.protocol
        const port = window.location.port
        const pathname = window.location.pathname
        
        const browserInfo = {
          ...detectBrowser(userAgent),
          ...checkBrowserFeatures()
        }

        // Fetch server-side headers
        const response = await fetch('/api/debug-middleware/')
        const serverHeaders = await response.json()

        setDebugData({
          userAgent,
          hostname,
          protocol,
          port,
          pathname,
          serverHeaders,
          browserInfo
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDebugData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Loading browser test data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!debugData) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">No data available</div>
      </div>
    )
  }

  const { browserInfo, serverHeaders } = debugData

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Browser-Specific Domain Detection Test</h1>
      
      {/* Browser Detection */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🌐 Browser Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Browser:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
              browserInfo.isChrome ? 'bg-blue-100 text-blue-800' :
              browserInfo.isSafari ? 'bg-purple-100 text-purple-800' :
              browserInfo.isFirefox ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {browserInfo.name}
            </span>
          </div>
          <div>
            <strong>Cookies:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              browserInfo.cookiesEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {browserInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <strong>localStorage:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              browserInfo.localStorage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {browserInfo.localStorage ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Client-Side Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💻 Client-Side Information</h2>
        <div className="space-y-2">
          <div><strong>Hostname:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{debugData.hostname}</code></div>
          <div><strong>Protocol:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{debugData.protocol}</code></div>
          <div><strong>Port:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{debugData.port || 'default'}</code></div>
          <div><strong>Pathname:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{debugData.pathname}</code></div>
          <div><strong>User Agent:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{debugData.userAgent}</code></div>
        </div>
      </div>

      {/* Server-Side Headers */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔧 Server-Side Headers</h2>
        {serverHeaders ? (
          <div className="space-y-2">
            <div>
              <strong>Clone ID:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                serverHeaders.cloneId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {serverHeaders.cloneId || 'Not detected'}
              </span>
            </div>
            <div>
              <strong>Detection Source:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                serverHeaders.cloneSource === 'domain' ? 'bg-blue-100 text-blue-800' :
                serverHeaders.cloneSource === 'path' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {serverHeaders.cloneSource || 'None'}
              </span>
            </div>
            <div><strong>Server Hostname:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{serverHeaders.requestInfo?.hostname || 'N/A'}</code></div>
            <div><strong>Server User Agent:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{serverHeaders.headers?.userAgent || 'N/A'}</code></div>
            <div><strong>Timestamp:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{serverHeaders.timestamp}</code></div>
          </div>
        ) : (
          <div className="text-red-600">Failed to fetch server headers</div>
        )}
      </div>

      {/* Browser-Specific Issues */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">⚠️ Browser-Specific Analysis</h2>
        
        {browserInfo.isChrome && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-blue-900">Chrome-Specific Checks:</h3>
            <ul className="text-blue-800 text-sm mt-2 space-y-1">
              <li>• Chrome may handle headers differently in dev tools vs regular browsing</li>
              <li>• Check if DevTools is affecting request headers</li>
              <li>• Chrome may cache middleware responses more aggressively</li>
              <li>• Try hard refresh (Ctrl+Shift+R) to bypass cache</li>
            </ul>
          </div>
        )}

        {browserInfo.isSafari && (
          <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-purple-900">Safari-Specific Checks:</h3>
            <ul className="text-purple-800 text-sm mt-2 space-y-1">
              <li>• Safari handles domain resolution differently</li>
              <li>• May have different header parsing behavior</li>
              <li>• Check Safari's Develop menu for additional insights</li>
            </ul>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-900">Comparison Results:</h3>
          <div className="text-yellow-800 text-sm mt-2">
            {debugData.hostname === serverHeaders?.requestInfo?.hostname ? (
              <div className="text-green-700">✅ Client and server hostnames match</div>
            ) : (
              <div className="text-red-700">❌ Hostname mismatch detected!</div>
            )}
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Actions</h2>
        <div className="space-y-2">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            🔄 Hard Refresh
          </button>
          <button 
            onClick={() => {
              // Clear all caches we can access
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name))
                })
              }
              window.location.reload()
            }} 
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 mr-2"
          >
            🗑️ Clear Cache & Reload
          </button>
          <button 
            onClick={() => setDebugData(null)} 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
} 