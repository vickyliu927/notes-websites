'use client'

import { useEffect, useState } from 'react'

interface ExtensionTestResults {
  userAgent: string
  hostname: string
  browserInfo: {
    isChrome: boolean
    isIncognito: boolean
    extensionsDetected: boolean
    webstoreAccess: boolean
  }
  headerComparison: {
    normal: any
    afterDelay: any
    differences: string[]
  }
  networkTests: {
    directFetch: any
    corsTest: any
    headerIntegrity: any
  }
  extensionIndicators: {
    modifiedNavigator: boolean
    injectedScripts: boolean
    modifiedHeaders: boolean
    contentScriptDetected: boolean
  }
}

export default function ExtensionTestPage() {
  const [results, setResults] = useState<ExtensionTestResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [testPhase, setTestPhase] = useState('Initializing...')

  const detectChromeInfo = () => {
    const userAgent = navigator.userAgent
    const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edge')
    
    // Detect incognito mode
    let isIncognito = false
    try {
      // This will throw in incognito mode in older Chrome versions
      if ('webkitRequestFileSystem' in window) {
        // @ts-ignore
        window.webkitRequestFileSystem(0, 0, () => {}, () => { isIncognito = true })
      }
    } catch (e) {
      isIncognito = true
    }

    // Try to detect extensions
    let extensionsDetected = false
    let webstoreAccess = false
    
    try {
      // Check for Chrome extension APIs
      if ('chrome' in window && (window as any).chrome.runtime) {
        extensionsDetected = true
      }
      
      // Check for webstore access
      if ('chrome' in window && (window as any).chrome.webstore) {
        webstoreAccess = true
      }
    } catch (e) {
      // Extension APIs might be blocked
    }

    return {
      isChrome,
      isIncognito,
      extensionsDetected,
      webstoreAccess
    }
  }

  const detectExtensionIndicators = () => {
    const indicators = {
      modifiedNavigator: false,
      injectedScripts: false,
      modifiedHeaders: false,
      contentScriptDetected: false
    }

    // Check for modified navigator properties
    const originalNavigatorProps = ['userAgent', 'platform', 'language', 'languages']
    originalNavigatorProps.forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(navigator, prop)
      if (descriptor && descriptor.get && descriptor.get.toString().includes('native')) {
        // Likely modified by extension
        indicators.modifiedNavigator = true
      }
    })

    // Check for injected scripts
    const scripts = Array.from(document.scripts)
    indicators.injectedScripts = scripts.some(script => 
      script.src.includes('extension://') || 
      script.id.includes('extension') ||
      script.className.includes('extension')
    )

    // Check for content script indicators
    const contentScriptIndicators = [
      'data-extension-id',
      'data-adblock',
      'data-reader',
      'data-translator'
    ]
    
    const hasContentScriptElements = contentScriptIndicators.some(attr => 
      document.querySelector(`[${attr}]`) !== null
    )
    
    if (hasContentScriptElements) {
      indicators.contentScriptDetected = true
    }

    return indicators
  }

  const performHeaderTests = async () => {
    const results = {
      normal: null as any,
      afterDelay: null as any,
      differences: [] as string[]
    }

    try {
      // First request - immediate
      setTestPhase('Testing immediate header response...')
      const response1 = await fetch('/api/debug-middleware/', {
        method: 'GET',
        headers: {
          'X-Test-Type': 'immediate',
          'X-Timestamp': Date.now().toString()
        }
      })
      results.normal = await response1.json()

      // Second request - after delay to allow extensions to process
      setTestPhase('Testing delayed header response...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response2 = await fetch('/api/debug-middleware/', {
        method: 'GET',
        headers: {
          'X-Test-Type': 'delayed',
          'X-Timestamp': Date.now().toString()
        }
      })
      results.afterDelay = await response2.json()

      // Compare results
      if (results.normal && results.afterDelay) {
        const normalHeaders = results.normal.allHeaders || {}
        const delayedHeaders = results.afterDelay.allHeaders || {}
        
        // Find differences
        const allKeys = new Set([...Object.keys(normalHeaders), ...Object.keys(delayedHeaders)])
        
        allKeys.forEach(key => {
          if (normalHeaders[key] !== delayedHeaders[key]) {
            results.differences.push(`${key}: "${normalHeaders[key]}" → "${delayedHeaders[key]}"`)
          }
        })
      }
    } catch (error) {
      console.error('Header test error:', error)
    }

    return results
  }

  const performNetworkTests = async () => {
    const results = {
      directFetch: null as any,
      corsTest: null as any,
      headerIntegrity: null as any
    }

    try {
      setTestPhase('Testing direct fetch behavior...')
      
      // Test 1: Direct fetch with custom headers
      const directResponse = await fetch('/api/debug-middleware/', {
        method: 'GET',
        headers: {
          'X-Extension-Test': 'direct-fetch',
          'X-Custom-Domain': 'test-domain.example.com',
          'Host': window.location.host // This might be modified by extensions
        }
      })
      results.directFetch = await directResponse.json()

      // Test 2: CORS-like test (different origin simulation)
      setTestPhase('Testing header integrity...')
      const integrityResponse = await fetch('/api/debug-middleware/', {
        method: 'GET',
        headers: {
          'X-Extension-Test': 'integrity-check',
          'Origin': window.location.origin,
          'Referer': window.location.href
        }
      })
      results.headerIntegrity = await integrityResponse.json()

    } catch (error) {
      console.error('Network test error:', error)
    }

    return results
  }

  useEffect(() => {
    const runTests = async () => {
      try {
        setTestPhase('Detecting browser information...')
        const userAgent = navigator.userAgent
        const hostname = window.location.hostname
        const browserInfo = detectChromeInfo()

        setTestPhase('Detecting extension indicators...')
        const extensionIndicators = detectExtensionIndicators()

        setTestPhase('Performing header comparison tests...')
        const headerComparison = await performHeaderTests()

        setTestPhase('Performing network tests...')
        const networkTests = await performNetworkTests()

        setResults({
          userAgent,
          hostname,
          browserInfo,
          headerComparison,
          networkTests,
          extensionIndicators
        })
      } catch (error) {
        console.error('Test error:', error)
      } finally {
        setLoading(false)
        setTestPhase('Tests completed')
      }
    }

    runTests()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <div className="text-lg mb-2">Running Extension Interference Tests...</div>
          <div className="text-sm text-gray-600">{testPhase}</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-red-600">Failed to run extension tests</div>
      </div>
    )
  }

  const suspiciousActivity = 
    results.extensionIndicators.modifiedNavigator ||
    results.extensionIndicators.injectedScripts ||
    results.extensionIndicators.contentScriptDetected ||
    results.headerComparison.differences.length > 0

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔌 Chrome Extension Interference Test</h1>
      
      {/* Summary Alert */}
      {suspiciousActivity && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-900">⚠️ Extension Interference Detected!</h2>
          <p className="text-red-800 text-sm mt-1">
            Chrome extensions may be interfering with domain routing. See detailed analysis below.
          </p>
        </div>
      )}

      {/* Browser Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🌐 Browser Environment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Browser:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              results.browserInfo.isChrome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {results.browserInfo.isChrome ? 'Chrome' : 'Other'}
            </span>
          </div>
          <div>
            <strong>Incognito Mode:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              results.browserInfo.isIncognito ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {results.browserInfo.isIncognito ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <strong>Extensions API:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              results.browserInfo.extensionsDetected ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {results.browserInfo.extensionsDetected ? 'Accessible' : 'Not accessible'}
            </span>
          </div>
          <div>
            <strong>Webstore Access:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              results.browserInfo.webstoreAccess ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {results.browserInfo.webstoreAccess ? 'Available' : 'Not available'}
            </span>
          </div>
        </div>
      </div>

      {/* Extension Indicators */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔍 Extension Activity Indicators</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(results.extensionIndicators).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {value ? 'Detected' : 'Clean'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Comparison */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Header Comparison Test</h2>
        
        {results.headerComparison.differences.length > 0 ? (
          <div>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-900">Header Changes Detected!</h3>
              <div className="text-red-800 text-sm mt-2">
                <p>Headers changed between immediate and delayed requests:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.headerComparison.differences.map((diff, index) => (
                    <li key={index} className="font-mono text-xs">{diff}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-900">✅ Headers Consistent</h3>
            <p className="text-green-800 text-sm">No header modifications detected between requests.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-medium mb-2">Immediate Request</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div><strong>Clone ID:</strong> {results.headerComparison.normal?.cloneId || 'None'}</div>
              <div><strong>Headers:</strong> {Object.keys(results.headerComparison.normal?.allHeaders || {}).length}</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Delayed Request</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div><strong>Clone ID:</strong> {results.headerComparison.afterDelay?.cloneId || 'None'}</div>
              <div><strong>Headers:</strong> {Object.keys(results.headerComparison.afterDelay?.allHeaders || {}).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Tests */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🌐 Network Integrity Tests</h2>
        <div className="space-y-4">
          {results.networkTests.directFetch && (
            <div>
              <h4 className="font-medium">Direct Fetch Test</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Clone Detection:</strong> {results.networkTests.directFetch.cloneId || 'None'}</div>
                <div><strong>Browser Type:</strong> {results.networkTests.directFetch.browserType || 'Not detected'}</div>
              </div>
            </div>
          )}
          
          {results.networkTests.headerIntegrity && (
            <div>
              <h4 className="font-medium">Header Integrity Test</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Origin Preserved:</strong> {results.networkTests.headerIntegrity.allHeaders?.origin ? 'Yes' : 'No'}</div>
                <div><strong>Referer Preserved:</strong> {results.networkTests.headerIntegrity.allHeaders?.referer ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🛠️ Troubleshooting Guide</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900">Step 1: Test in Incognito Mode</h3>
            <p className="text-blue-800 text-sm mt-1">
              Open Chrome in incognito mode and test your custom domain. Incognito disables most extensions.
            </p>
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Open in New Window
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-semibold text-yellow-900">Step 2: Disable Extensions Systematically</h3>
            <div className="text-yellow-800 text-sm mt-1">
              <p className="mb-2">Go to <code>chrome://extensions/</code> and disable these types of extensions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Ad blockers</strong> (uBlock Origin, AdBlock Plus)</li>
                <li><strong>Privacy tools</strong> (Ghostery, Privacy Badger)</li>
                <li><strong>VPN/Proxy</strong> (Any VPN extensions)</li>
                <li><strong>Developer tools</strong> (React DevTools, Vue DevTools)</li>
                <li><strong>Header modifiers</strong> (ModHeader, Requestly)</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-900">Step 3: Test Domain Routing</h3>
            <div className="text-green-800 text-sm mt-1">
              <ol className="list-decimal list-inside space-y-1">
                <li>Disable all extensions or use incognito mode</li>
                <li>Visit your custom domain</li>
                <li>Check if clone content appears correctly</li>
                <li>Re-enable extensions one by one to identify the culprit</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            🔄 Rerun Tests
          </button>
          <button 
            onClick={() => window.open('chrome://extensions/', '_blank')} 
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            🔌 Open Extensions Manager
          </button>
        </div>
      </div>
    </div>
  )
} 