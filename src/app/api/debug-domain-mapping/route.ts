import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET(request: NextRequest) {
  try {
    // Get all active clones with their domain configurations
    const allClones = await client.fetch(`
      *[_type == "clone" && isActive == true] {
        cloneId,
        cloneName,
        isActive,
        metadata {
          domains,
          targetAudience,
          region
        }
      }
    `)

    // Get current hostname from request
    const url = new URL(request.url)
    const hostname = url.hostname

    // Try to find matching clone for current hostname
    const matchingClone = allClones.find((clone: any) => 
      clone.metadata?.domains?.includes(hostname)
    )

    return NextResponse.json({
      currentHostname: hostname,
      matchingClone: matchingClone || null,
      allClones: allClones,
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('Domain mapping debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch domain mappings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 