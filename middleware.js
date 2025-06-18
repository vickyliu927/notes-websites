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
  console.log('🚨🚨🚨 MIDDLEWARE EXECUTING - pathname:', request.nextUrl.pathname)
  console.log('🚨🚨🚨 MIDDLEWARE EXECUTING - hostname:', request.headers.get('host'))
  
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Always log middleware execution
  console.log(`🔍 Middleware processing: ${hostname}${pathname}`)
  
  // Check if domain should be mapped to a clone
  const cloneId = DOMAIN_TO_CLONE_MAP[hostname]
  
  if (cloneId) {
    console.log(`✅ Domain ${hostname} mapped to clone: ${cloneId}`)
    
    // Only rewrite homepage and subject pages to clone
    if (pathname === '/' || !pathname.startsWith('/clone/')) {
      const newUrl = new URL(`/clone/${cloneId}/homepage`, request.url)
      console.log(`🔄 Rewriting ${pathname} to ${newUrl.pathname}`)
      
      const response = NextResponse.rewrite(newUrl)
      response.headers.set('x-clone-id', cloneId)
      response.headers.set('x-clone-original-path', pathname)
      response.headers.set('x-clone-rewritten-to', newUrl.pathname)
      
      console.log(`📤 Middleware rewrite complete for ${hostname}`)
      return response
    }
  } else {
    console.log(`❌ No clone mapping found for domain: ${hostname}`)
  }
  
  // Default response
  const response = NextResponse.next()
  response.headers.set('x-middleware-processed', 'true')
  return response
}

// Configure middleware to run on all routes
export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 