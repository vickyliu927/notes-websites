import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const headersList = await headers()
  
  // Read the headers that our middleware sets
  const cloneId = headersList.get('x-clone-id')
  const clonePath = headersList.get('x-clone-path')
  const cloneSource = headersList.get('x-clone-source')
  const browserType = headersList.get('x-browser-type')
  
  // Also include some request information for debugging
  const url = new URL(request.url)
  const userAgent = headersList.get('user-agent') || ''
  const host = headersList.get('host') || ''
  
  // Get all headers for debugging
  const allHeaders: Record<string, string> = {}
  headersList.forEach((value, key) => {
    allHeaders[key] = value
  })
  
  return NextResponse.json({
    cloneId,
    clonePath,
    cloneSource,
    browserType,
    requestInfo: {
      hostname: url.hostname,
      pathname: url.pathname,
      origin: url.origin
    },
    headers: {
      host,
      userAgent,
      referer: headersList.get('referer'),
      acceptLanguage: headersList.get('accept-language'),
      acceptEncoding: headersList.get('accept-encoding')
    },
    allHeaders,
    timestamp: new Date().toISOString()
  })
} 