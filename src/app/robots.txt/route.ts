import { headers } from 'next/headers'

export async function GET() {
  try {
    // Get request headers to determine domain
    const headersList = await headers()
    const host = headersList.get('host')
    const hostname = host?.split(':')[0] || 'localhost'
    
    // Generate canonical base URL with www. prefix for production domains
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://igcse-notes.com'
    
    // For production domains (not localhost), ensure www. prefix
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
      const canonicalDomain = hostname.startsWith('www.') ? hostname : `www.${hostname}`
      baseUrl = `https://${canonicalDomain}`
    }
    
    const robotsTxt = `User-agent: *
Allow: /

# Disallow admin areas
Disallow: /studio/
Disallow: /api/

# Disallow sensitive or irrelevant directories
Disallow: /_next/
Disallow: /.*

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (helps with server load)
Crawl-delay: 1`

    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 's-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    
    // Fallback robots.txt
    const fallbackRobotsTxt = `User-agent: *
Allow: /

Sitemap: https://igcse-notes.com/sitemap.xml`

    return new Response(fallbackRobotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
} 