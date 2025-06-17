import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ===== CLONE DETECTION MIDDLEWARE =====

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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