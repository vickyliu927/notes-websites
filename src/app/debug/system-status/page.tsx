'use client'

import { useState, useEffect } from 'react'
import { getCompleteCloneData, getAllClones } from '../../../../lib/cloneUtils'
import Link from 'next/link'

interface SystemStatus {
  timestamp: string
  clones: {
    total: number
    active: number
    inactive: number
    baseline: string | null
  }
  components: {
    [cloneId: string]: {
      cloneName: string
      isActive: boolean
      components: Array<{
        name: string
        hasData: boolean
        source: 'clone-specific' | 'baseline' | 'default' | 'none'
        lastUpdated?: string
      }>
    }
  }
  performance: {
    domainLookups: {
      total: number
      successful: number
      cacheHits: number
      averageDuration: number
    }
    pageLoads: {
      total: number
      averageLoadTime: number
      clonePages: number
      defaultPages: number
    }
    errors: {
      total: number
      recent: number
    }
  }
  cache: {
    totalEntries: number
    validEntries: number
    expiredEntries: number
    hitRate: number
  }
  middleware: {
    active: boolean
    lastCheck: string
    headersPropagating: boolean
  }
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchSystemStatus = async () => {
    try {
      setError(null)
      
      // Fetch all clones and their component data
      const allClones = await getAllClones()
      const componentsData: SystemStatus['components'] = {}
      
      // Get component data for each clone
      for (const clone of allClones) {
        const cloneId = clone.cloneId.current
        const completeData = await getCompleteCloneData(cloneId)
        
        if (completeData) {
          componentsData[cloneId] = {
            cloneName: clone.cloneName,
            isActive: clone.isActive,
            components: Object.entries(completeData.components).map(([name, data]) => ({
              name,
              hasData: !!data.data,
              source: data.source,
              lastUpdated: data.data?._updatedAt || data.data?._createdAt
            }))
          }
        }
      }
      
      // Fetch performance metrics
      const [performanceResponse, cacheResponse, middlewareResponse] = await Promise.all([
        fetch('/api/debug-performance?type=stats').then(r => r.json()).catch(() => ({
          stats: {
            domainLookups: { total: 0, successful: 0, cacheHits: 0, averageDuration: 0 },
            pageLoads: { total: 0, averageLoadTime: 0, clonePages: 0, defaultPages: 0 },
            errors: { total: 0, recent: 0 }
          }
        })),
        fetch('/api/debug-cache?action=stats').then(r => r.json()).catch(() => ({
          totalRequests: 0,
          hitRate: 0,
          cacheSize: 0
        })),
        fetch('/api/debug-middleware').then(r => r.json()).catch(() => null)
      ])
      
      const systemStatus: SystemStatus = {
        timestamp: new Date().toISOString(),
        clones: {
          total: allClones.length,
          active: allClones.filter(c => c.isActive).length,
          inactive: allClones.filter(c => !c.isActive).length,
          baseline: allClones.find(c => c.baselineClone)?.cloneId.current || null
        },
        components: componentsData,
        performance: performanceResponse.stats || {
          domainLookups: { total: 0, successful: 0, cacheHits: 0, averageDuration: 0 },
          pageLoads: { total: 0, averageLoadTime: 0, clonePages: 0, defaultPages: 0 },
          errors: { total: 0, recent: 0 }
        },
        cache: {
          totalEntries: cacheResponse.cacheSize || 0,
          validEntries: 0,
          expiredEntries: 0,
          hitRate: cacheResponse.hitRate || 0
        },
        middleware: {
          active: !!middlewareResponse,
          lastCheck: new Date().toISOString(),
          headersPropagating: !!middlewareResponse?.cloneId || !!middlewareResponse?.cloneSource
        }
      }
      
      setStatus(systemStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system status')
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
      setAutoRefresh(false)
    } else {
      const interval = setInterval(fetchSystemStatus, 30000) // 30 seconds
      setRefreshInterval(interval)
      setAutoRefresh(true)
    }
  }

  useEffect(() => {
    fetchSystemStatus()
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [])

  const getStatusColor = (source: string) => {
    switch (source) {
      case 'clone-specific': return 'bg-green-100 text-green-800'
      case 'baseline': return 'bg-yellow-100 text-yellow-800'
      case 'default': return 'bg-blue-100 text-blue-800'
      case 'none': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthStatus = () => {
    if (!status) return { status: 'unknown', color: 'gray' }
    
    const totalClones = status.clones.total
    const activeClones = status.clones.active
    const hasBaseline = !!status.clones.baseline
    const middlewareActive = status.middleware.active
    const recentErrors = status.performance.errors.recent
    
    if (recentErrors > 5) return { status: 'critical', color: 'red' }
    if (!middlewareActive || !hasBaseline) return { status: 'warning', color: 'yellow' }
    if (activeClones === 0) return { status: 'warning', color: 'yellow' }
    if (activeClones < totalClones) return { status: 'degraded', color: 'orange' }
    
    return { status: 'healthy', color: 'green' }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Loading system status...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={fetchSystemStatus}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!status) return null

  const health = getHealthStatus()

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔍 Clone System Status Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of clone system health and component data sources
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${{
              healthy: 'bg-green-100 text-green-800',
              degraded: 'bg-orange-100 text-orange-800',
              warning: 'bg-yellow-100 text-yellow-800',
              critical: 'bg-red-100 text-red-800',
              unknown: 'bg-gray-100 text-gray-800'
            }[health.status]}`}>
              System: {health.status.toUpperCase()}
            </div>
            <button
              onClick={toggleAutoRefresh}
              className={`px-4 py-2 rounded text-sm font-medium ${
                autoRefresh 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {autoRefresh ? '⏹ Stop Auto-Refresh' : '▶️ Auto-Refresh (30s)'}
            </button>
            <button
              onClick={fetchSystemStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              🔄 Refresh Now
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(status.timestamp).toLocaleString()}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Clone Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{status.clones.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Active:</span>
              <span className="font-medium text-green-600">{status.clones.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Inactive:</span>
              <span className="font-medium text-gray-600">{status.clones.inactive}</span>
            </div>
            <div className="flex justify-between">
              <span>Baseline:</span>
              <span className="font-medium text-blue-600">{status.clones.baseline || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Domain Lookups:</span>
              <span className="font-medium">{status.performance.domainLookups.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Hit Rate:</span>
              <span className="font-medium">{status.cache.hitRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Lookup Time:</span>
              <span className="font-medium">{status.performance.domainLookups.averageDuration.toFixed(1)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Recent Errors:</span>
              <span className={`font-medium ${status.performance.errors.recent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {status.performance.errors.recent}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cache Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Entries:</span>
              <span className="font-medium">{status.cache.totalEntries}</span>
            </div>
            <div className="flex justify-between">
              <span>Valid:</span>
              <span className="font-medium text-green-600">{status.cache.validEntries}</span>
            </div>
            <div className="flex justify-between">
              <span>Expired:</span>
              <span className="font-medium text-red-600">{status.cache.expiredEntries}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Middleware</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-medium ${status.middleware.active ? 'text-green-600' : 'text-red-600'}`}>
                {status.middleware.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Headers:</span>
              <span className={`font-medium ${status.middleware.headersPropagating ? 'text-green-600' : 'text-red-600'}`}>
                {status.middleware.headersPropagating ? 'Working' : 'Not detected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Data Sources by Clone */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Component Data Sources by Clone</h3>
        
        {Object.entries(status.components).map(([cloneId, cloneData]) => (
          <div key={cloneId} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-medium text-gray-900">{cloneData.cloneName}</h4>
                <span className="text-sm text-gray-500">({cloneId})</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  cloneData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {cloneData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <Link 
                href={`/clone/${cloneId}/homepage`}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                View Clone →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cloneData.components.map((component) => (
                <div key={component.name} className="border rounded-lg p-3">
                  <div className="font-medium text-sm mb-1 capitalize">
                    {component.name.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(component.source)}`}>
                    {component.source.toUpperCase()}
                  </div>
                  {!component.hasData && (
                    <div className="text-xs text-red-600 mt-1">No Data</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Debug Tools Quick Access */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Debug Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/debug/middleware-test"
            className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center"
          >
            <div className="font-medium text-blue-900">Middleware Test</div>
            <div className="text-blue-700 text-sm">Test domain detection</div>
          </Link>
          
          <Link 
            href="/debug/browser-test"
            className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center"
          >
            <div className="font-medium text-purple-900">Browser Test</div>
            <div className="text-purple-700 text-sm">Browser compatibility</div>
          </Link>
          
          <Link 
            href="/debug/extension-test"
            className="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-center"
          >
            <div className="font-medium text-orange-900">Extension Test</div>
            <div className="text-orange-700 text-sm">Extension interference</div>
          </Link>
          
          <Link 
            href="/clone-system-test"
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center"
          >
            <div className="font-medium text-green-900">System Test</div>
            <div className="text-green-700 text-sm">Full system validation</div>
          </Link>
        </div>
      </div>
    </div>
  )
} 