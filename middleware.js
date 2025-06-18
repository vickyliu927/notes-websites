import { NextResponse } from 'next/server'

// ===== DOMAIN TO CLONE MAPPING =====
// Add your custom domains and their corresponding clone IDs here
const DOMAIN_TO_CLONE_MAP = {
  // Replace 'your-domain.com' with your actual domain
  'www.igcse-questions.com': 'test-clone',
  'igcse-questions.com': 'test-clone',
  // Add more domain mappings as needed
  // 'another-domain.com': 'another-clone-id',
}

// ===== CLONE DETECTION MIDDLEWARE =====

export default function middleware(request) {
  console.log('🔥 MIDDLEWARE EXECUTING - pathname:', request.nextUrl.pathname)
  console.log('🔥 MIDDLEWARE EXECUTING - hostname:', request.headers.get('host'))
  
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
    console.log('🔥 MIDDLEWARE SKIPPING - path:', pathname)
    return NextResponse.next()
  }
  
  // ===== DOMAIN-BASED ROUTING =====
  // Check if the request is coming from a mapped custom domain
  const mappedCloneId = DOMAIN_TO_CLONE_MAP[hostname]
  console.log('🔥 MIDDLEWARE - mappedCloneId:', mappedCloneId, 'for hostname:', hostname)
  
  if (mappedCloneId) {
    if (!pathname.startsWith('/clone/')) {
      let targetPath
      
      if (pathname === '/') {
        // Root path goes to clone homepage
        targetPath = `/clone/${mappedCloneId}/homepage`
      } else {
        // Other paths go to clone-specific subject pages
        targetPath = `/clone/${mappedCloneId}${pathname}`
      }
      
      console.log('🔥 MIDDLEWARE REWRITING:', pathname, '->', targetPath)
      
      // Create the rewrite
      const url = request.nextUrl.clone()
      url.pathname = targetPath
      
      // Add helpful headers for debugging
      const response = NextResponse.rewrite(url)
      response.headers.set('x-clone-id', mappedCloneId)
      response.headers.set('x-clone-domain', hostname)
      response.headers.set('x-original-path', pathname)
      response.headers.set('x-rewritten-path', targetPath)
      
      console.log('🔥 MIDDLEWARE RESPONSE HEADERS SET')
      return response
    }
  }
  
  // ===== EXISTING CLONE URL DETECTION =====
  // Check if URL already contains clone information (for existing /clone/[id] URLs)
  const cloneMatch = pathname.match(/^\/clone\/([^\/]+)/)
  if (cloneMatch) {
    const cloneId = cloneMatch[1]
    
    console.log('🔥 MIDDLEWARE - existing clone URL detected:', cloneId)
    
    // Add clone information to headers for debugging
    const response = NextResponse.next()
    response.headers.set('x-clone-id', cloneId)
    response.headers.set('x-clone-source', 'url-based')
    response.headers.set('x-original-path', pathname)
    
    return response
  }
  
  // ===== DEFAULT HANDLING =====
  // For all other requests, proceed normally
  console.log('🔥 MIDDLEWARE - default handling for:', pathname)
  return NextResponse.next()
}

// ===== CONFIGURATION =====

export const config = {
  matcher: [
    /*
     * Match all requests except static files and API routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 