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
    if (now - cacheTime < maxAge) {
      return cachedValue
    }
  }

  try {
    // Query Sanity for clone with matching custom domain
    const query = `
      *[_type == "clone" && metadata.customDomain == $hostname && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    
    const result = await client.fetch(query, { hostname })
    
    if (result?.cloneId?.current) {
      // Cache successful result
      domainCache.set(hostname, result.cloneId.current)
      cacheTimestamps.set(hostname, now)
      return result.cloneId.current
    } else {
      // Cache negative result to prevent repeated queries
      domainCache.set(hostname, null)
      cacheTimestamps.set(hostname, now)
    }
  } catch (error) {
    // Only log errors in production
    console.error('[DOMAIN_LOOKUP] Error:', error instanceof Error ? error.message : String(error))
  }
  
  return null
}

// ===== PRODUCTION MIDDLEWARE =====

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host')?.split(':')[0] || request.nextUrl.hostname
  
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
    
    const cloneIdFromDomain = await getCloneIdByDomain(hostname)
    
    if (cloneIdFromDomain) {
    const response = NextResponse.next()
      response.headers.set('x-clone-id', cloneIdFromDomain)
      response.headers.set('x-clone-source', 'domain')
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