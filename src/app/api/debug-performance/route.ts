import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

// Performance metrics storage (in production, use Redis or database)
let performanceMetrics = {
  domainLookups: [] as Array<{
    hostname: string
    timestamp: number
    duration: number
    success: boolean
    cacheHit: boolean
    cloneId: string | null
  }>,
  pageLoads: [] as Array<{
    path: string
    cloneId: string | null
    timestamp: number
    loadTime: number
    source: string
  }>,
  errors: [] as Array<{
    timestamp: number
    error: string
    context: string
    hostname?: string
    cloneId?: string
  }>
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const type = url.searchParams.get('type') || 'all'
  const hours = parseInt(url.searchParams.get('hours') || '24')
  
  const cutoff = Date.now() - (hours * 60 * 60 * 1000)
  
  // Filter metrics by time
  const filteredMetrics = {
    domainLookups: performanceMetrics.domainLookups.filter(m => m.timestamp > cutoff),
    pageLoads: performanceMetrics.pageLoads.filter(m => m.timestamp > cutoff),
    errors: performanceMetrics.errors.filter(m => m.timestamp > cutoff)
  }
  
  // Calculate statistics
  const stats = {
    domainLookups: {
      total: filteredMetrics.domainLookups.length,
      successful: filteredMetrics.domainLookups.filter(m => m.success).length,
      cacheHits: filteredMetrics.domainLookups.filter(m => m.cacheHit).length,
      averageDuration: filteredMetrics.domainLookups.length > 0 
        ? filteredMetrics.domainLookups.reduce((sum, m) => sum + m.duration, 0) / filteredMetrics.domainLookups.length
        : 0,
      uniqueHostnames: new Set(filteredMetrics.domainLookups.map(m => m.hostname)).size
    },
    pageLoads: {
      total: filteredMetrics.pageLoads.length,
      averageLoadTime: filteredMetrics.pageLoads.length > 0
        ? filteredMetrics.pageLoads.reduce((sum, m) => sum + m.loadTime, 0) / filteredMetrics.pageLoads.length
        : 0,
      clonePages: filteredMetrics.pageLoads.filter(m => m.cloneId).length,
      defaultPages: filteredMetrics.pageLoads.filter(m => !m.cloneId).length
    },
    errors: {
      total: filteredMetrics.errors.length,
      recent: filteredMetrics.errors.filter(e => e.timestamp > Date.now() - (60 * 60 * 1000)).length,
      byContext: filteredMetrics.errors.reduce((acc, e) => {
        acc[e.context] = (acc[e.context] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
  
  if (type === 'stats') {
    return NextResponse.json({ stats, timestamp: new Date().toISOString() })
  }
  
  return NextResponse.json({
    metrics: type === 'all' ? filteredMetrics : filteredMetrics[type as keyof typeof filteredMetrics],
    stats,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    switch (type) {
      case 'domainLookup':
        performanceMetrics.domainLookups.push({
          ...data,
          timestamp: Date.now()
        })
        // Keep only last 1000 entries
        if (performanceMetrics.domainLookups.length > 1000) {
          performanceMetrics.domainLookups = performanceMetrics.domainLookups.slice(-1000)
        }
        break
        
      case 'pageLoad':
        performanceMetrics.pageLoads.push({
          ...data,
          timestamp: Date.now()
        })
        if (performanceMetrics.pageLoads.length > 1000) {
          performanceMetrics.pageLoads = performanceMetrics.pageLoads.slice(-1000)
        }
        break
        
      case 'error':
        performanceMetrics.errors.push({
          ...data,
          timestamp: Date.now()
        })
        if (performanceMetrics.errors.length > 500) {
          performanceMetrics.errors = performanceMetrics.errors.slice(-500)
        }
        break
        
      case 'clear':
        const metricType = data.metricType || 'all'
        if (metricType === 'all') {
          performanceMetrics = {
            domainLookups: [],
            pageLoads: [],
            errors: []
          }
        } else if (metricType in performanceMetrics) {
          performanceMetrics[metricType as keyof typeof performanceMetrics] = []
        }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      counts: {
        domainLookups: performanceMetrics.domainLookups.length,
        pageLoads: performanceMetrics.pageLoads.length,
        errors: performanceMetrics.errors.length
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 