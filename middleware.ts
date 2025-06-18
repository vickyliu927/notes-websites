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
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
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
    return NextResponse.next()
  }
  
  // ===== DOMAIN-BASED ROUTING =====
  // Check if the request is coming from a mapped custom domain
  const mappedCloneId = DOMAIN_TO_CLONE_MAP[hostname]
  
  if (mappedCloneId) {
    if (!pathname.startsWith('/clone/')) {
      let rewritePath = `/clone/${mappedCloneId}`
      
      if (pathname === '/') {
        rewritePath += '/homepage'
      } else {
        rewritePath += pathname
      }
      
      const rewriteUrl = new URL(rewritePath, request.url)
      const response = NextResponse.rewrite(rewriteUrl)
      
      response.headers.set('x-clone-id', mappedCloneId)
      response.headers.set('x-clone-domain', hostname)
      response.headers.set('x-original-path', pathname)
      
      return response
    }
  }
  
  // Handle clone URL patterns
  const cloneMatch = pathname.match(/^\/clone\/([^\/]+)(?:\/(.*))?$/)
  
  if (cloneMatch) {
    const [, cloneId, remainingPath] = cloneMatch
    
    // Add clone headers for downstream components
    const response = NextResponse.next()
    response.headers.set('x-clone-id', cloneId)
    response.headers.set('x-clone-path', remainingPath || '')
    
    return response
  }
  
  // Handle query parameter clone detection
  const cloneParam = request.nextUrl.searchParams.get('clone')
  if (cloneParam) {
    // Redirect to clone URL structure
    const newUrl = new URL(`/clone/${cloneParam}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 