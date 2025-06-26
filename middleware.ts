import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { client } from './lib/sanity'

// Production-ready cache for domain-to-clone mapping
let domainCache = new Map<string, string | null>()
let cacheTimestamps = new Map<string, number>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for production
const NEGATIVE_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes for non-existent domains

// ===== PRODUCTION DOMAIN DETECTION =====

async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  const now = Date.now()
  
  // Check cache first (with per-domain timestamps)
  const cacheTime = cacheTimestamps.get(hostname) || 0
  const cachedValue = domainCache.get(hostname)
  
  if (cachedValue !== undefined) {
    const maxAge = cachedValue === null ? NEGATIVE_CACHE_DURATION : CACHE_DURATION
    const ageInSeconds = Math.floor((now - cacheTime) / 1000)
    
    if (now - cacheTime < maxAge) {
      console.log(`[DOMAIN_LOOKUP] Cache hit for ${hostname}: ${cachedValue} (age: ${ageInSeconds}s)`)
      return cachedValue
    } else {
      console.log(`[DOMAIN_LOOKUP] Cache expired for ${hostname} (age: ${ageInSeconds}s)`)
    }
  } else {
    console.log(`[DOMAIN_LOOKUP] No cache entry for ${hostname}`)
  }

  try {
    console.log(`[DOMAIN_LOOKUP] Querying Sanity for domain: ${hostname}`)
    
    // Query Sanity for clone with matching custom domain
    const query = `
      *[_type == "clone" && metadata.customDomain == $hostname && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    
    const result = await client.fetch(query, { hostname })
    console.log(`[DOMAIN_LOOKUP] Sanity query result for ${hostname}:`, result)
    
    if (result?.cloneId?.current) {
      // Cache successful result
      domainCache.set(hostname, result.cloneId.current)
      cacheTimestamps.set(hostname, now)
      console.log(`[DOMAIN_LOOKUP] Cached successful result: ${hostname} -> ${result.cloneId.current}`)
      return result.cloneId.current
    } else {
      // Cache negative result to prevent repeated queries
      domainCache.set(hostname, null)
      cacheTimestamps.set(hostname, now)
      console.log(`[DOMAIN_LOOKUP] Cached negative result for: ${hostname}`)
    }
  } catch (error) {
    console.error('[DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
  }
  
  return null
}

// ===== PRODUCTION MIDDLEWARE =====

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host')?.split(':')[0] || request.nextUrl.hostname
  const userAgent = request.headers.get('user-agent') || ''
  
  // Enhanced logging for debugging browser differences
  const browserInfo = {
    isChrome: userAgent.includes('Chrome') && !userAgent.includes('Edge'),
    isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome'),
    isFirefox: userAgent.includes('Firefox')
  }
  
  console.log(`[MIDDLEWARE] Request from ${browserInfo.isChrome ? 'Chrome' : browserInfo.isSafari ? 'Safari' : browserInfo.isFirefox ? 'Firefox' : 'Unknown'}: ${hostname}${pathname}`)
  
  // Skip middleware for certain paths
  const skipPaths = [
    '/api/',
    '/studio/',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/debug',
    '/health',
    '/.well-known/'
  ]
  
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Production domain detection - skip development domains
  if (hostname !== 'localhost' && 
      !hostname.includes('127.0.0.1') && 
      !hostname.includes('.local') &&
      !hostname.includes('.vercel.app')) {
    
    console.log(`[MIDDLEWARE] Checking domain: ${hostname} for clone lookup`)
    const cloneIdFromDomain = await getCloneIdByDomain(hostname)
    console.log(`[MIDDLEWARE] Clone lookup result: ${cloneIdFromDomain}`)
    
    if (cloneIdFromDomain) {
      const response = NextResponse.next()
      response.headers.set('x-clone-id', cloneIdFromDomain)
      response.headers.set('x-clone-source', 'domain')
      response.headers.set('x-browser-type', browserInfo.isChrome ? 'chrome' : browserInfo.isSafari ? 'safari' : 'other')
      
      // Add cache-busting headers to prevent browser caching issues
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      response.headers.set('Vary', 'Host, User-Agent')
      
      console.log(`[MIDDLEWARE] Setting headers: clone-id=${cloneIdFromDomain}, source=domain, browser=${response.headers.get('x-browser-type')}`)
      return response
    }
  }
  
  return NextResponse.next()
}

// ===== CONFIGURATION =====

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
} 