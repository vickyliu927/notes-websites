'use client'

import { useEffect, useState } from 'react'

interface QuickTestResult {
  timestamp: string
  testMode: 'normal' | 'incognito' | 'unknown'
  cloneDetected: boolean
  headerCount: number
  suspiciousHeaders: string[]
  extensionSignals: {
    chromeExtensionAPI: boolean
    modifiedUserAgent: boolean
    injectedContent: boolean
  }
}

export default function QuickExtensionTestPage() {
  const [result, setResult] = useState<QuickTestResult | null>(null)
  const [loading, setLoading] = useState(true)

  const detectTestMode = (): 'normal' | 'incognito' | 'unknown' => {
    // Try to detect incognito mode
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        // Modern way to detect incognito
        return 'unknown' // Will be determined by storage test
      }
      
      // Fallback detection methods
      if (window.outerHeight < window.innerHeight) {
        return 'incognito'
      }
      
      // Check for extension APIs (usually not available in incognito)
      if ('chrome' in window && (window as any).chrome.runtime) {
        return 'normal'
      }
      
      return 'unknown'
    } catch {
      return 'incognito'
    }
  }

  const detectExtensionSignals = () => {
    const signals = {
      chromeExtensionAPI: false,
      modifiedUserAgent: false,
      injectedContent: false
    }

    // Check for Chrome extension API
    try {
      if ('chrome' in window && (window as any).chrome.runtime) {
        signals.chromeExtensionAPI = true
      }
    } catch {}

    // Check for modified user agent
    const ua = navigator.userAgent
    if (ua.includes('Extension') || ua.includes('addon') || ua.length > 200) {
      signals.modifiedUserAgent = true
    }

    // Check for injected content
    const hasExtensionElements = !!(
      document.querySelector('[data-extension-id]') ||
      document.querySelector('[class*="extension"]') ||
      document.querySelector('[id*="extension"]') ||
      document.querySelector('script[src*="extension://"]')
    )
    
    if (hasExtensionElements) {
      signals.injectedContent = true
    }

    return signals
  }

  useEffect(() => {
    const runQuickTest = async () => {
      try {
        // Detect test environment
        const testMode = detectTestMode()
        const extensionSignals = detectExtensionSignals()

        // Quick header check
        const response = await fetch('/api/debug-middleware/', {
          headers: {
            'X-Quick-Test': 'true',
            'X-Test-Timestamp': Date.now().toString()
          }
        })
        
        const data = await response.json()
        
        // Analyze headers for suspicious activity
        const allHeaders = data.allHeaders || {}
        const suspiciousHeaders: string[] = []
        
        Object.keys(allHeaders).forEach(header => {
          const value = allHeaders[header]
          if (
            header.includes('extension') ||
            header.includes('addon') ||
            header.includes('modified') ||
            value.includes('extension://') ||
            value.includes('addon')
          ) {
            suspiciousHeaders.push(`${header}: ${value}`)
          }
        })

        setResult({
          timestamp: new Date().toISOString(),
          testMode,
          cloneDetected: !!data.cloneId,
          headerCount: Object.keys(allHeaders).length,
          suspiciousHeaders,
          extensionSignals
        })
      } catch (error) {
        console.error('Quick test failed:', error)
      } finally {
        setLoading(false)
      }
    }

    runQuickTest()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">⚡ Quick Extension Test</h1>
          <div className="animate-pulse">Running quick extension interference test...</div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center text-red-600">Test failed</div>
      </div>
    )
  }

  const hasExtensionInterference = 
    result.suspiciousHeaders.length > 0 ||
    (result.extensionSignals.chromeExtensionAPI && result.testMode === 'normal') ||
    result.extensionSignals.modifiedUserAgent ||
    result.extensionSignals.injectedContent

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">⚡ Quick Extension Interference Test</h1>
      
      {/* Quick Result */}
      <div className={`p-6 rounded-lg mb-6 ${
        hasExtensionInterference 
          ? 'bg-red-50 border-2 border-red-200' 
          : 'bg-green-50 border-2 border-green-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-2 ${
          hasExtensionInterference ? 'text-red-900' : 'text-green-900'
        }`}>
          {hasExtensionInterference ? '⚠️ Extension Interference Likely' : '✅ No Obvious Interference'}
        </h2>
        <p className={`text-sm ${
          hasExtensionInterference ? 'text-red-800' : 'text-green-800'
        }`}>
          {hasExtensionInterference 
            ? 'Chrome extensions may be interfering with domain routing.' 
            : 'No obvious signs of extension interference detected.'}
        </p>
      </div>

      {/* Test Details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📊 Test Results</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Test Mode:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              result.testMode === 'incognito' ? 'bg-purple-100 text-purple-800' :
              result.testMode === 'normal' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {result.testMode.charAt(0).toUpperCase() + result.testMode.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Clone Detected:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              result.cloneDetected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {result.cloneDetected ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Header Count:</span>
            <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
              {result.headerCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Suspicious Headers:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              result.suspiciousHeaders.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {result.suspiciousHeaders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Extension Signals */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Extension Activity</h3>
        <div className="space-y-2">
          {Object.entries(result.extensionSignals).map(([key, detected]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                detected ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {detected ? 'Detected' : 'Clean'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suspicious Headers Details */}
      {result.suspiciousHeaders.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🚨 Suspicious Headers</h3>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <ul className="space-y-1 text-sm font-mono text-red-800">
              {result.suspiciousHeaders.map((header, index) => (
                <li key={index}>{header}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🛠️ Next Steps</h3>
        
        {hasExtensionInterference ? (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h4 className="font-medium text-yellow-900">Recommended Actions:</h4>
              <ol className="list-decimal list-inside text-sm text-yellow-800 mt-2 space-y-1">
                <li>Test your custom domain in incognito mode</li>
                <li>Disable extensions one by one to identify the culprit</li>
                <li>Check Chrome extension settings</li>
              </ol>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open(window.location.origin, '_blank')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
              >
                🕵️ Test in Incognito
              </button>
              <button 
                onClick={() => window.open('chrome://extensions/', '_blank')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
              >
                🔌 Manage Extensions
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800 text-sm">
              No obvious extension interference detected. The issue might be elsewhere.
            </p>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          🔄 Rerun Test
        </button>
      </div>
    </div>
  )
} 