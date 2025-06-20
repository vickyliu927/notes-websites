import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ===== DOMAIN TO CLONE MAPPING =====
// Add your custom domains and their corresponding clone IDs here
const DOMAIN_TO_CLONE_MAP: Record<string, string> = {
  // Replace 'your-domain.com' with your actual domain
  'www.igcse-questions.com': 'test-clone',
  'igcse-questions.com': 'test-clone',
  // Add more domain mappings as needed
  // 'another-domain.com': 'another-clone-id',
}

// ===== CLONE DETECTION MIDDLEWARE =====

export function middleware(request: NextRequest) {
  console.log('🚨🚨🚨 MIDDLEWARE EXECUTING - pathname:', request.nextUrl.pathname)
  console.log('🚨🚨🚨 MIDDLEWARE EXECUTING - hostname:', request.headers.get('host'))
  console.log('🚨🚨🚨 MIDDLEWARE EXECUTING - full URL:', request.url)
  
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Always log middleware execution
  console.log(`🔥 MIDDLEWARE: Processing request for ${hostname}${pathname}`)
  console.log(`🔥 MIDDLEWARE: Available domains:`, Object.keys(DOMAIN_TO_CLONE_MAP))
  
  // Skip middleware for certain paths
  const skipPaths = [
    '/api/',
    '/studio/',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/clone-test',
    '/debug',
    '/test'
  ]
  
  if (skipPaths.some(path => pathname.startsWith(path))) {
    console.log(`🔥 MIDDLEWARE: Skipping path ${pathname}`)
    return NextResponse.next()
  }
  
  // Check if this domain is mapped to a clone
  const cloneId = DOMAIN_TO_CLONE_MAP[hostname]
  console.log(`🔥 MIDDLEWARE: Domain ${hostname} maps to clone: ${cloneId || 'NONE'}`)
  
  // Handle direct clone URL access (e.g., /clone/test-clone)
  // Redirect to clean URL for clone domains
  if (pathname.startsWith('/clone/') && cloneId) {
    const cloneMatch = pathname.match(/^\/clone\/([^\/]+)(.*)/)
    if (cloneMatch) {
      const [, urlCloneId, remainingPath] = cloneMatch
      
      // If this is the correct clone for this domain, redirect to clean URL
      if (urlCloneId === cloneId) {
        const cleanPath = remainingPath || '/'
        const redirectUrl = new URL(cleanPath, request.url)
        console.log(`🔥 MIDDLEWARE: Redirecting ${pathname} to clean URL ${cleanPath}`)
        
        const response = NextResponse.redirect(redirectUrl)
        response.headers.set('x-clone-id', cloneId)
        response.headers.set('x-clone-redirect', 'true')
        return response
      }
    }
  }
  
  if (cloneId) {
    console.log(`🔥 MIDDLEWARE: Domain ${hostname} mapped to clone ${cloneId}`)
    
    // For homepage requests, rewrite to clone homepage
    if (pathname === '/' || pathname === '') {
      const rewriteUrl = new URL(`/clone/${cloneId}/homepage`, request.url)
      console.log(`🔥 MIDDLEWARE: Rewriting ${pathname} to ${rewriteUrl.pathname}`)
      
      const response = NextResponse.rewrite(rewriteUrl)
      
      // Add debug headers
      response.headers.set('x-clone-id', cloneId)
      response.headers.set('x-clone-original-path', pathname)
      response.headers.set('x-clone-rewritten-path', rewriteUrl.pathname)
      response.headers.set('x-clone-hostname', hostname)
      response.headers.set('x-middleware-cache', 'no-cache')
      
      return response
    }
    
    // For subject pages, rewrite to clone subject pages
    if (pathname.startsWith('/') && !pathname.startsWith('/clone/')) {
      const rewriteUrl = new URL(`/clone/${cloneId}${pathname}`, request.url)
      console.log(`🔥 MIDDLEWARE: Rewriting ${pathname} to ${rewriteUrl.pathname}`)
      
      const response = NextResponse.rewrite(rewriteUrl)
      
      // Add debug headers
      response.headers.set('x-clone-id', cloneId)
      response.headers.set('x-clone-original-path', pathname)
      response.headers.set('x-clone-rewritten-path', rewriteUrl.pathname)
      response.headers.set('x-clone-hostname', hostname)
      response.headers.set('x-middleware-cache', 'no-cache')
      
      return response
    }
  } else {
    // For non-clone domains, handle direct clone URL access
    // Redirect to the appropriate clone domain if available
    if (pathname.startsWith('/clone/')) {
      const cloneMatch = pathname.match(/^\/clone\/([^\/]+)(.*)/)
      if (cloneMatch) {
        const [, urlCloneId, remainingPath] = cloneMatch
        
        // Find which domain this clone should be served from
        const cloneDomain = Object.entries(DOMAIN_TO_CLONE_MAP).find(([, id]) => id === urlCloneId)
        
        if (cloneDomain) {
          const [domain] = cloneDomain
          const cleanPath = remainingPath || '/'
          const redirectUrl = new URL(cleanPath, `https://${domain}`)
          console.log(`🔥 MIDDLEWARE: Redirecting to clone domain ${domain}${cleanPath}`)
          
          const response = NextResponse.redirect(redirectUrl)
          response.headers.set('x-clone-id', urlCloneId)
          response.headers.set('x-clone-redirect', 'true')
          return response
        }
      }
    }
  }
  
  // For non-clone domains, proceed normally
  console.log(`🔥 MIDDLEWARE: No clone mapping for ${hostname}, proceeding normally`)
  return NextResponse.next()
}

// ===== MIDDLEWARE CONFIG =====
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 