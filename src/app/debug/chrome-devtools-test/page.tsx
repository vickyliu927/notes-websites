'use client'

import { useEffect, useState } from 'react'

interface TestResults {
  devToolsOpen: boolean
  consoleDetected: boolean
  debuggerDetected: boolean
  performanceDetected: boolean
  userAgent: string
  hostname: string
  serverHeaders: any
}

export default function ChromeDevToolsTestPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(true)

  const detectDevTools = () => {
    let devToolsOpen = false
    let consoleDetected = false
    let debuggerDetected = false
    let performanceDetected = false

    // Method 1: Console detection
    try {
      const element = new Image()
      Object.defineProperty(element, 'id', {
        get: function () {
          consoleDetected = true
          devToolsOpen = true
          return 'devtools-detector'
        }
      })
      console.log(element)
    } catch (e) {
      // Ignore errors
    }

    // Method 2: Debugger detection
    try {
      const start = performance.now()
      debugger
      const end = performance.now()
      if (end - start > 100) {
        debuggerDetected = true
        devToolsOpen = true
      }
    } catch (e) {
      // Ignore errors
    }

    // Method 3: Performance timing detection
    try {
      const start = performance.now()
      console.clear()
      const end = performance.now()
      if (end - start > 10) {
        performanceDetected = true
        devToolsOpen = true
      }
    } catch (e) {
      // Ignore errors
    }

    // Method 4: Window size detection
    const threshold = 160
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      devToolsOpen = true
    }

    return {
      devToolsOpen,
      consoleDetected,
      debuggerDetected,
      performanceDetected
    }
  }

  useEffect(() => {
    const runTests = async () => {
      // Detect DevTools
      const devToolsInfo = detectDevTools()
      
      // Get browser info
      const userAgent = navigator.userAgent
      const hostname = window.location.hostname

      // Fetch server headers
      let serverHeaders = null
      try {
        const response = await fetch('/api/debug-middleware/')
        serverHeaders = await response.json()
      } catch (e) {
        console.error('Failed to fetch server headers:', e)
      }

      setResults({
        ...devToolsInfo,
        userAgent,
        hostname,
        serverHeaders
      })
      setLoading(false)
    }

    runTests()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Running Chrome DevTools detection tests...</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-red-600">Failed to run tests</div>
      </div>
    )
  }

  const isChrome = results.userAgent.includes('Chrome') && !results.userAgent.includes('Edge')

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Chrome DevTools Detection Test</h1>
      
      {/* Browser Detection */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🌐 Browser Information</h2>
        <div className="space-y-2">
          <div>
            <strong>Browser:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              isChrome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isChrome ? 'Chrome' : 'Other'}
            </span>
          </div>
          <div><strong>Hostname:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{results.hostname}</code></div>
          <div><strong>User Agent:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{results.userAgent}</code></div>
        </div>
      </div>

      {/* DevTools Detection Results */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔍 DevTools Detection Results</h2>
        <div className="space-y-3">
          <div>
            <strong>DevTools Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded font-medium ${
              results.devToolsOpen ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {results.devToolsOpen ? '⚠️ OPEN (May affect headers)' : '✅ CLOSED'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className={`p-3 rounded ${results.consoleDetected ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <div className="font-medium">Console</div>
                <div className="text-sm">{results.consoleDetected ? 'Detected' : 'Not detected'}</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`p-3 rounded ${results.debuggerDetected ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <div className="font-medium">Debugger</div>
                <div className="text-sm">{results.debuggerDetected ? 'Detected' : 'Not detected'}</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`p-3 rounded ${results.performanceDetected ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <div className="font-medium">Performance</div>
                <div className="text-sm">{results.performanceDetected ? 'Detected' : 'Not detected'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Headers Impact */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📡 Server Headers Analysis</h2>
        {results.serverHeaders ? (
          <div className="space-y-2">
            <div>
              <strong>Clone Detection:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                results.serverHeaders.cloneId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {results.serverHeaders.cloneId || 'None'}
              </span>
            </div>
            <div>
              <strong>Browser Type (Server):</strong> 
              <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                {results.serverHeaders.browserType || 'Not detected'}
              </span>
            </div>
            <div><strong>Headers Count:</strong> {Object.keys(results.serverHeaders.allHeaders || {}).length}</div>
          </div>
        ) : (
          <div className="text-red-600">Failed to fetch server headers</div>
        )}
      </div>

      {/* Chrome-Specific Warnings */}
      {isChrome && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">⚠️ Chrome-Specific Issues</h2>
          
          {results.devToolsOpen && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-900">🚨 DevTools Impact Detected!</h3>
              <div className="text-red-800 text-sm mt-2">
                <p>Chrome DevTools can interfere with:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Request header processing</li>
                  <li>Middleware execution timing</li>
                  <li>Host header values</li>
                  <li>Domain resolution behavior</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="space-y-2 text-yellow-800 text-sm">
            <h4 className="font-semibold">Troubleshooting Steps:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Close DevTools completely</strong> and test domain routing</li>
              <li>Try opening the site in an <strong>incognito window</strong></li>
              <li>Disable Chrome extensions temporarily</li>
              <li>Clear browser cache and cookies</li>
              <li>Test in regular browsing mode vs. with DevTools open</li>
            </ol>
          </div>
        </div>
      )}

      {/* Test Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Next Steps</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900">For Domain Testing:</h3>
            <ol className="text-blue-800 text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>Close Chrome DevTools completely</li>
              <li>Visit your custom domain (e.g., school-test.example.com)</li>
              <li>Check if clone content appears correctly</li>
              <li>Compare behavior with Safari</li>
            </ol>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔄 Rerun Tests
          </button>
        </div>
      </div>
    </div>
  )
} 