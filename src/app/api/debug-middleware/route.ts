import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const headersList = await headers()
  
  // Read the headers that our middleware sets
  const cloneId = headersList.get('x-clone-id')
  const clonePath = headersList.get('x-clone-path')
  const cloneSource = headersList.get('x-clone-source')
  
  // Also include some request information for debugging
  const url = new URL(request.url)
  
  return NextResponse.json({
    cloneId,
    clonePath,
    cloneSource,
    requestInfo: {
      hostname: url.hostname,
      pathname: url.pathname,
      origin: url.origin
    },
    timestamp: new Date().toISOString()
  })
} 