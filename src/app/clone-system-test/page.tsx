'use client'

import { useState, useEffect } from 'react'
import { CloneProvider, CloneDebugInfo, useClone } from '../../../contexts/CloneContext'
import CloneSwitcher, { CloneSwitcherFloating } from '../../../components/clone/CloneSwitcher'
import { 
  getCompleteCloneData, 
  getAllClones, 
  getBaseline,
  validateCloneId,
  generateCloneUrl,
  parseCloneUrl,
  CloneData
} from '../../../lib/cloneUtils'
import Link from 'next/link'

// ===== TEST COMPONENT =====

function CloneSystemTestContent() {
  const clone = useClone()
  const [testResults, setTestResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [testCloneId, setTestCloneId] = useState('test-clone')

  // Run comprehensive tests
  const runTests = async () => {
    setIsLoading(true)
    const results: any = {}

    try {
      console.log('🧪 Running Clone System Tests...')

      // Test 1: Validation
      console.log('Testing validation...')
      results.validation = {
        validSlug: validateCloneId('test-clone'),
        invalidSlug1: validateCloneId('Test Clone'),
        invalidSlug2: validateCloneId('test_clone'),
        invalidSlug3: validateCloneId('')
      }

      // Test 2: URL Generation
      console.log('Testing URL generation...')
      results.urlGeneration = {
        basicUrl: generateCloneUrl('test-clone'),
        urlWithPath: generateCloneUrl('test-clone', '/subjects'),
        invalidClone: generateCloneUrl('Invalid Clone!', '/test')
      }

      // Test 3: URL Parsing
      console.log('Testing URL parsing...')
      results.urlParsing = {
        cloneUrl: parseCloneUrl('/clone/test-clone/homepage'),
        regularUrl: parseCloneUrl('/about'),
        rootCloneUrl: parseCloneUrl('/clone/test-clone')
      }

      // Test 4: Clone Data Fetching
      console.log('Testing clone data fetching...')
      const [allClones, baseline, completeData] = await Promise.all([
        getAllClones(),
        getBaseline(),
        getCompleteCloneData(testCloneId)
      ])

      results.dataFetching = {
        allClonesCount: allClones.length,
        allClones: allClones.map(c => ({
          id: c.cloneId.current,
          name: c.cloneName,
          isBaseline: c.baselineClone,
          isActive: c.isActive
        })),
        baseline: baseline ? {
          id: baseline.cloneId.current,
          name: baseline.cloneName
        } : null,
        completeData: completeData ? {
          cloneName: completeData.clone?.cloneName,
          componentCount: Object.keys(completeData.components).length,
          components: Object.entries(completeData.components).map(([key, value]) => ({
            name: key,
            hasData: !!value.data,
            source: value.source
          }))
        } : null
      }

      console.log('✅ All tests completed')
      setTestResults(results)
    } catch (error) {
      console.error('❌ Test failed:', error)
      results.error = error instanceof Error ? error.message : 'Unknown error'
      setTestResults(results)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔄 Clone System Test Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive testing interface for the website cloning system
          </p>
          
          {/* Clone Switcher */}
          <div className="mt-4">
            <CloneSwitcher className="inline-block" />
          </div>
        </div>

        {/* Current Clone Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Clone</h3>
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {clone.currentCloneId || 'None'}</div>
              <div><span className="font-medium">Name:</span> {clone.currentClone?.cloneName || 'N/A'}</div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  clone.currentClone?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {clone.currentClone?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Clones</h3>
            <div className="text-2xl font-bold text-blue-600">
              {clone.availableClones.length}
            </div>
            <div className="text-sm text-gray-500">
              {clone.isLoadingClones ? 'Loading...' : 'Total active clones'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Baseline Clone</h3>
            <div className="space-y-1">
              <div className="font-medium">
                {clone.baselineClone?.cloneName || 'Not set'}
              </div>
              <div className="text-sm text-gray-500">
                {clone.baselineClone?.cloneId.current || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="testCloneId" className="text-sm font-medium text-gray-700">
                Test Clone ID:
              </label>
              <input
                id="testCloneId"
                type="text"
                value={testCloneId}
                onChange={(e) => setTestCloneId(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            <button
              onClick={runTests}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Validation Tests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Validation Tests</h3>
            {testResults.validation && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Valid slug (test-clone):</span>
                  <span className={testResults.validation.validSlug ? 'text-green-600' : 'text-red-600'}>
                    {testResults.validation.validSlug ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Invalid slug (Test Clone):</span>
                  <span className={!testResults.validation.invalidSlug1 ? 'text-green-600' : 'text-red-600'}>
                    {!testResults.validation.invalidSlug1 ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Invalid slug (test_clone):</span>
                  <span className={!testResults.validation.invalidSlug2 ? 'text-green-600' : 'text-red-600'}>
                    {!testResults.validation.invalidSlug2 ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* URL Generation Tests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 URL Generation</h3>
            {testResults.urlGeneration && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Basic:</span> 
                  <code className="ml-2 bg-gray-100 px-1 rounded">
                    {testResults.urlGeneration.basicUrl}
                  </code>
                </div>
                <div>
                  <span className="font-medium">With path:</span> 
                  <code className="ml-2 bg-gray-100 px-1 rounded">
                    {testResults.urlGeneration.urlWithPath}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Invalid cleanup:</span> 
                  <code className="ml-2 bg-gray-100 px-1 rounded">
                    {testResults.urlGeneration.invalidClone}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Fetching Results */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Data Fetching Results</h3>
          {testResults.dataFetching && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All Clones */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">All Clones ({testResults.dataFetching.allClonesCount})</h4>
                <div className="space-y-2">
                  {testResults.dataFetching.allClones.map((clone: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <div>
                        <span className="font-medium">{clone.name}</span>
                        <span className="ml-2 text-gray-500">({clone.id})</span>
                      </div>
                      <div className="flex space-x-2">
                        {clone.isBaseline && <span className="text-yellow-600">⭐</span>}
                        {clone.isActive && <span className="text-green-600">✅</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Components */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Test Clone Components ({testResults.dataFetching.completeData?.componentCount || 0})
                </h4>
                <div className="space-y-2">
                  {testResults.dataFetching.completeData?.components.map((comp: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <span className="font-medium">{comp.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          comp.source === 'clone-specific' ? 'bg-green-100 text-green-700' :
                          comp.source === 'baseline' ? 'bg-yellow-100 text-yellow-700' :
                          comp.source === 'default' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {comp.source}
                        </span>
                        {comp.hasData ? <span className="text-green-600">✅</span> : <span className="text-gray-400">⭕</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              → Original Homepage
            </Link>
            <Link href="/clone/test-clone" className="text-blue-600 hover:text-blue-800 text-sm">
              → Test Clone
            </Link>
            <Link href="/clone/test-clone/homepage" className="text-blue-600 hover:text-blue-800 text-sm">
              → Test Clone Homepage
            </Link>
            <Link href="/studio" className="text-blue-600 hover:text-blue-800 text-sm">
              → Sanity Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Clone Switcher */}
      <CloneSwitcherFloating />
    </div>
  )
}

// ===== MAIN COMPONENT =====

export default function CloneSystemTest() {
  return (
    <CloneProvider enableAutoDetection={true}>
      <CloneSystemTestContent />
    </CloneProvider>
  )
} 