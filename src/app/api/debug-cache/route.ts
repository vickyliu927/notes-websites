import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

// This needs to access the same cache as middleware
// Since we can't directly import from middleware due to Next.js constraints,
// we'll create a function that returns cache info based on what we can access

// Cache simulation for debugging (matches middleware cache structure)
let debugCache = {
  domainCache: new Map<string, string | null>(),
  cacheTimestamps: new Map<string, number>(),
  stats: {
    hits: 0,
    misses: 0,
    invalidations: 0,
    lastClearTime: Date.now()
  }
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for production
const NEGATIVE_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes for non-existent domains

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const hostname = url.searchParams.get('hostname')
  const action = url.searchParams.get('action') || 'status'
  
  try {
    switch (action) {
      case 'status':
        return getCacheStatus()
      
      case 'test':
        if (hostname) {
          return await testDomainLookup(hostname)
        }
        return NextResponse.json({ error: 'hostname parameter required for test' }, { status: 400 })
      
      case 'entries':
        return getCacheEntries()
      
      case 'stats':
        return getCacheStats()
      
      case 'validate':
        return await validateCacheData()
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Cache debug error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, hostname, data } = await request.json()
    
    switch (action) {
      case 'clear':
        return clearCache(data?.type)
      
      case 'simulate':
        return simulateCacheOperation(hostname, data)
      
      case 'refresh':
        if (hostname) {
          return await refreshDomainCache(hostname)
        }
        return NextResponse.json({ error: 'hostname required for refresh' }, { status: 400 })
      
      case 'populate':
        return await populateTestData()
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process cache operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Cache status overview
function getCacheStatus() {
  const now = Date.now()
  const entries = Array.from(debugCache.domainCache.entries()).map(([domain, cloneId]) => {
    const timestamp = debugCache.cacheTimestamps.get(domain) || 0
    const age = now - timestamp
    const maxAge = cloneId === null ? NEGATIVE_CACHE_DURATION : CACHE_DURATION
    const isExpired = age > maxAge
    
    return {
      domain,
      cloneId,
      timestamp,
      age: Math.floor(age / 1000), // seconds
      maxAge: Math.floor(maxAge / 1000),
      isExpired,
      expiresIn: isExpired ? 0 : Math.floor((maxAge - age) / 1000)
    }
  })
  
  return NextResponse.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    totalEntries: debugCache.domainCache.size,
    validEntries: entries.filter(e => !e.isExpired).length,
    expiredEntries: entries.filter(e => e.isExpired).length,
    stats: debugCache.stats,
    entries: entries.sort((a, b) => b.timestamp - a.timestamp)
  })
}

// Test domain lookup with cache simulation
async function testDomainLookup(hostname: string) {
  const now = Date.now()
  const startTime = performance.now()
  
  // Check cache first
  const cacheTime = debugCache.cacheTimestamps.get(hostname) || 0
  const cachedValue = debugCache.domainCache.get(hostname)
  let cacheHit = false
  
  if (cachedValue !== undefined) {
    const maxAge = cachedValue === null ? NEGATIVE_CACHE_DURATION : CACHE_DURATION
    if (now - cacheTime < maxAge) {
      cacheHit = true
      debugCache.stats.hits++
    }
  }
  
  let cloneId = null
  let queryTime = 0
  
  if (!cacheHit) {
    debugCache.stats.misses++
    
    // Simulate Sanity query
    const queryStart = performance.now()
    try {
      const result = await client.fetch(`
        *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
          cloneId,
          metadata
        }
      `, { hostname })
      
      cloneId = result?.cloneId?.current || null
      
      // Update cache
      debugCache.domainCache.set(hostname, cloneId)
      debugCache.cacheTimestamps.set(hostname, now)
    } catch (error) {
      console.error('Query error:', error)
    }
    queryTime = performance.now() - queryStart
  } else {
    cloneId = cachedValue
  }
  
  const totalTime = performance.now() - startTime
  
  return NextResponse.json({
    hostname,
    cloneId,
    cacheHit,
    queryTime: Math.round(queryTime * 100) / 100,
    totalTime: Math.round(totalTime * 100) / 100,
    cacheAge: cacheTime ? Math.floor((now - cacheTime) / 1000) : 0,
    timestamp: new Date().toISOString()
  })
}

// Get all cache entries
function getCacheEntries() {
  const entries = Array.from(debugCache.domainCache.entries()).map(([domain, cloneId]) => ({
    domain,
    cloneId,
    timestamp: debugCache.cacheTimestamps.get(domain) || 0,
    age: Math.floor((Date.now() - (debugCache.cacheTimestamps.get(domain) || 0)) / 1000)
  }))
  
  return NextResponse.json({
    entries: entries.sort((a, b) => b.timestamp - a.timestamp),
    total: entries.length
  })
}

// Get cache statistics
function getCacheStats() {
  const totalRequests = debugCache.stats.hits + debugCache.stats.misses
  const hitRate = totalRequests > 0 ? (debugCache.stats.hits / totalRequests) * 100 : 0
  
  return NextResponse.json({
    ...debugCache.stats,
    totalRequests,
    hitRate: Math.round(hitRate * 100) / 100,
    cacheSize: debugCache.domainCache.size,
    uptime: Math.floor((Date.now() - debugCache.stats.lastClearTime) / 1000)
  })
}

// Validate cache data against Sanity
async function validateCacheData() {
  const validationResults = []
  
  for (const [hostname, cloneId] of debugCache.domainCache.entries()) {
    try {
      const result = await client.fetch(`
        *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
          cloneId
        }
      `, { hostname })
      
      const actualCloneId = result?.cloneId?.current || null
      const isValid = cloneId === actualCloneId
      
      validationResults.push({
        hostname,
        cachedCloneId: cloneId,
        actualCloneId,
        isValid,
        status: isValid ? 'valid' : 'stale'
      })
    } catch (error) {
      validationResults.push({
        hostname,
        cachedCloneId: cloneId,
        actualCloneId: null,
        isValid: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  const validCount = validationResults.filter(r => r.isValid).length
  const staleCount = validationResults.filter(r => !r.isValid).length
  
  return NextResponse.json({
    totalEntries: validationResults.length,
    validEntries: validCount,
    staleEntries: staleCount,
    validationRate: validationResults.length > 0 ? (validCount / validationResults.length) * 100 : 0,
    results: validationResults,
    timestamp: new Date().toISOString()
  })
}

// Clear cache
function clearCache(type?: string) {
  const beforeSize = debugCache.domainCache.size
  
  if (type === 'expired') {
    const now = Date.now()
    const toDelete = []
    
    for (const [hostname, cloneId] of debugCache.domainCache.entries()) {
      const timestamp = debugCache.cacheTimestamps.get(hostname) || 0
      const maxAge = cloneId === null ? NEGATIVE_CACHE_DURATION : CACHE_DURATION
      if (now - timestamp > maxAge) {
        toDelete.push(hostname)
      }
    }
    
    toDelete.forEach(hostname => {
      debugCache.domainCache.delete(hostname)
      debugCache.cacheTimestamps.delete(hostname)
    })
    
    debugCache.stats.invalidations += toDelete.length
  } else {
    // Clear all
    debugCache.domainCache.clear()
    debugCache.cacheTimestamps.clear()
    debugCache.stats = {
      hits: 0,
      misses: 0,
      invalidations: 0,
      lastClearTime: Date.now()
    }
  }
  
  const afterSize = debugCache.domainCache.size
  const clearedCount = beforeSize - afterSize
  
  return NextResponse.json({
    success: true,
    clearedEntries: clearedCount,
    remainingEntries: afterSize,
    type: type || 'all',
    timestamp: new Date().toISOString()
  })
}

// Simulate cache operation
function simulateCacheOperation(hostname: string, data: any) {
  const { cloneId, simulate } = data
  
  if (simulate === 'hit') {
    debugCache.domainCache.set(hostname, cloneId)
    debugCache.cacheTimestamps.set(hostname, Date.now())
    debugCache.stats.hits++
  } else if (simulate === 'miss') {
    debugCache.domainCache.delete(hostname)
    debugCache.cacheTimestamps.delete(hostname)
    debugCache.stats.misses++
  }
  
  return NextResponse.json({
    success: true,
    hostname,
    cloneId,
    simulation: simulate,
    cacheSize: debugCache.domainCache.size
  })
}

// Refresh specific domain cache
async function refreshDomainCache(hostname: string) {
  try {
    const result = await client.fetch(`
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `, { hostname })
    
    const cloneId = result?.cloneId?.current || null
    
    debugCache.domainCache.set(hostname, cloneId)
    debugCache.cacheTimestamps.set(hostname, Date.now())
    
    return NextResponse.json({
      success: true,
      hostname,
      cloneId,
      refreshed: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      hostname,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Populate test data
async function populateTestData() {
  const testDomains = [
    'www.igcse-questions.com',
    'igcse-questions.com',
    'example.com',
    'test.example.com'
  ]
  
  for (const domain of testDomains) {
    await testDomainLookup(domain)
  }
  
  return NextResponse.json({
    success: true,
    populatedDomains: testDomains,
    cacheSize: debugCache.domainCache.size
  })
} 