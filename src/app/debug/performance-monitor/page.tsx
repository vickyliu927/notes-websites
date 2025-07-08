'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetric {
  hostname: string
  timestamp: number
  duration: number
  success: boolean
  cacheHit: boolean
  cloneId: string | null
}

interface PerformanceStats {
  domainLookups: {
    total: number
    successful: number
    cacheHits: number
    averageDuration: number
    uniqueHostnames: number
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
    byContext: Record<string, number>
  }
}

export default function PerformanceMonitorPage() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('24')

  const fetchMetrics = async () => {
    try {
      setError(null)
      
      const [statsResponse, metricsResponse] = await Promise.all([
        fetch(`/api/debug-performance?type=stats&hours=${timeRange}`),
        fetch(`/api/debug-performance?type=domainLookups&hours=${timeRange}`)
      ])
      
      if (!statsResponse.ok || !metricsResponse.ok) {
        throw new Error('Failed to fetch performance data')
      }
      
      const statsData = await statsResponse.json()
      const metricsData = await metricsResponse.json()
      
      setStats(statsData.stats)
      setMetrics(metricsData.metrics || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  const clearMetrics = async (type: string = 'all') => {
    try {
      const response = await fetch('/api/debug-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'clear',
          data: { metricType: type }
        })
      })
      
      if (response.ok) {
        fetchMetrics()
      }
    } catch (err) {
      setError('Failed to clear metrics')
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
      const interval = setInterval(fetchMetrics, 10000) // 10 seconds
      setRefreshInterval(interval)
      setAutoRefresh(true)
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [timeRange])

  const formatDuration = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`
    if (ms < 1000) return `${ms.toFixed(1)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getPerformanceGrade = (avgDuration: number) => {
    if (avgDuration < 10) return { grade: 'A', color: 'green', description: 'Excellent' }
    if (avgDuration < 50) return { grade: 'B', color: 'blue', description: 'Good' }
    if (avgDuration < 100) return { grade: 'C', color: 'yellow', description: 'Fair' }
    if (avgDuration < 200) return { grade: 'D', color: 'orange', description: 'Poor' }
    return { grade: 'F', color: 'red', description: 'Critical' }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Loading performance metrics...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={fetchMetrics}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const performanceGrade = stats ? getPerformanceGrade(stats.domainLookups.averageDuration) : null

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Performance Monitor
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of clone detection performance and domain lookup metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="1">Last 1 hour</option>
              <option value="6">Last 6 hours</option>
              <option value="24">Last 24 hours</option>
              <option value="168">Last 7 days</option>
            </select>
            <button
              onClick={toggleAutoRefresh}
              className={`px-4 py-2 rounded text-sm font-medium ${
                autoRefresh 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {autoRefresh ? '⏹ Stop Auto-Refresh' : '▶️ Auto-Refresh'}
            </button>
            <button
              onClick={fetchMetrics}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Performance Grade</h3>
              {performanceGrade && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white bg-${performanceGrade.color}-600`}>
                  {performanceGrade.grade}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {performanceGrade?.description} - {formatDuration(stats.domainLookups.averageDuration)} avg
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain Lookups</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{stats.domainLookups.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Successful:</span>
                <span className="font-medium text-green-600">{stats.domainLookups.successful}</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Hits:</span>
                <span className="font-medium text-blue-600">{stats.domainLookups.cacheHits}</span>
              </div>
              <div className="flex justify-between">
                <span>Unique Domains:</span>
                <span className="font-medium">{stats.domainLookups.uniqueHostnames}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Loads</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{stats.pageLoads.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Clone Pages:</span>
                <span className="font-medium text-purple-600">{stats.pageLoads.clonePages}</span>
              </div>
              <div className="flex justify-between">
                <span>Default Pages:</span>
                <span className="font-medium text-gray-600">{stats.pageLoads.defaultPages}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Load Time:</span>
                <span className="font-medium">{formatDuration(stats.pageLoads.averageLoadTime)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Errors</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{stats.errors.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Recent (1h):</span>
                <span className={`font-medium ${stats.errors.recent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.errors.recent}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Performance */}
      {stats && stats.domainLookups.total > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Cache Performance</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {((stats.domainLookups.cacheHits / stats.domainLookups.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {((stats.domainLookups.successful / stats.domainLookups.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatDuration(stats.domainLookups.averageDuration)}
              </div>
              <div className="text-sm text-gray-600">Average Duration</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Domain Lookups */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Recent Domain Lookups</h3>
          <button
            onClick={() => clearMetrics('domainLookups')}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Clear History
          </button>
        </div>
        
        {metrics.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No domain lookup data available for the selected time range
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hostname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clone ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cache
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.slice(0, 50).map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {metric.hostname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {metric.cloneId ? (
                        <span className="text-blue-600 font-medium">{metric.cloneId}</span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(metric.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        metric.cacheHit 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {metric.cacheHit ? 'HIT' : 'MISS'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        metric.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {metric.success ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => clearMetrics('all')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑️ Clear All Metrics
          </button>
          <button
            onClick={() => window.open('/api/debug-performance?type=stats', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📊 View Raw Stats API
          </button>
          <button
            onClick={() => window.open('/debug/system-status', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🔍 System Status Dashboard
          </button>
        </div>
      </div>
    </div>
  )
} 