import { NextRequest, NextResponse } from 'next/server'

// This needs to access the same cache as middleware
// Since we can't directly import from middleware due to Next.js constraints,
// we'll create a function that returns cache info based on what we can access

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const hostname = url.searchParams.get('hostname')
  
  // We can't directly access middleware cache variables from here
  // But we can provide debugging information about the request
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    requestedHostname: hostname,
    currentUrl: url.toString(),
    headers: {
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      origin: request.headers.get('origin')
    },
    note: 'Cache state is only visible in middleware logs. Check server console for detailed cache information.'
  }
  
  return NextResponse.json(debugInfo)
}

export async function POST(request: NextRequest) {
  // This endpoint could be used to trigger cache clearing if needed
  return NextResponse.json({ 
    message: 'Cache clearing not implemented yet - restart server to clear cache',
    timestamp: new Date().toISOString()
  })
} 