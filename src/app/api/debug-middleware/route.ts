import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || 'unknown'
  const url = request.url
  const pathname = new URL(url).pathname
  
  // Domain mapping from middleware
  const DOMAIN_TO_CLONE_MAP: Record<string, string> = {
    'www.igcse-questions.com': 'test-clone',
    'igcse-questions.com': 'test-clone',
  }
  
  const cloneId = DOMAIN_TO_CLONE_MAP[hostname]
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    hostname,
    pathname,
    url,
    domainMapping: DOMAIN_TO_CLONE_MAP,
    currentCloneId: cloneId,
    isCloneDomain: !!cloneId,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
  }
  
  return NextResponse.json(debugInfo, {
    headers: {
      'x-debug-hostname': hostname,
      'x-debug-clone-id': cloneId || 'none',
      'x-debug-is-clone': cloneId ? 'true' : 'false',
    }
  })
} 