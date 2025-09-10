import { headers } from 'next/headers'
import { client } from '../../../lib/sanity'

// Types for subject data
interface SubjectData {
  slug: string
  subjectName?: string
  title?: string
  _updatedAt?: string
}

// Function to get clone ID by domain (copied from homepage)
async function getCloneIdByDomain(hostname: string): Promise<string | null> {
  try {
    const query = `
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `
    
    const result = await client.fetch(query, { hostname })
    
    if (result?.cloneId?.current) {
      return result.cloneId.current
    }
    
    return null
  } catch (error) {
    console.error('Error getting clone ID by domain:', error)
    return null
  }
}

// Function to get clone-specific subject slugs
async function getCloneSpecificSubjects(cloneId: string): Promise<SubjectData[]> {
  try {
    const query = `
      *[_type == "subjectPage" && isPublished == true && cloneReference->cloneId.current == $cloneId] {
        "slug": select(
          defined(subjectSlug.current) => subjectSlug.current,
          subjectSlug
        ),
        subjectName,
        title,
        _updatedAt
      }
    `
    
    const subjects = await client.fetch(query, { cloneId })
    return subjects.filter((subject: any) => subject.slug) // Remove any with null slugs
  } catch (error) {
    console.error(`Error fetching subjects for clone ${cloneId}:`, error)
    return []
  }
}

// Function to get default/global subjects (for main site)
async function getGlobalSubjects(): Promise<SubjectData[]> {
  try {
    const query = `
      *[_type == "subjectPage" && isPublished == true && !defined(cloneReference)] {
        "slug": select(
          defined(subjectSlug.current) => subjectSlug.current,
          subjectSlug
        ),
        subjectName,
        title,
        _updatedAt
      }
    `
    
    const subjects = await client.fetch(query)
    return subjects.filter((subject: any) => subject.slug) // Remove any with null slugs
  } catch (error) {
    console.error('Error fetching global subjects:', error)
    return []
  }
}

// Function to get canonical base URL with www. prefix
function getCanonicalBaseUrl(hostname: string, cloneId: string | null): string {
  // For clone domains, ensure www. prefix
  if (cloneId && hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('.local')) {
    // Add www. prefix if not already present
    const canonicalDomain = hostname.startsWith('www.') ? hostname : `www.${hostname}`
    return `https://${canonicalDomain}`
  }
  
  // For development/main site, use environment variable or default
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://igcse-notes.com'
}

export async function GET() {
  try {
    // Get request headers to determine domain and clone
    const headersList = await headers()
    const host = headersList.get('host')
    const hostname = host?.split(':')[0] || 'localhost'
    
    console.log('🗺️ [SITEMAP] Generating sitemap for:', hostname)
    
    // Detect clone from domain
    let cloneId = null
    const isLocalDevelopment = hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('.local')
    
    if (!isLocalDevelopment) {
      cloneId = await getCloneIdByDomain(hostname)
    }
    
    console.log('🗺️ [SITEMAP] Clone ID detected:', cloneId)
    
    // Get canonical base URL with www. prefix
    const baseUrl = getCanonicalBaseUrl(hostname, cloneId)
    console.log('🗺️ [SITEMAP] Using base URL:', baseUrl)
    
    // Get subjects based on clone or global
    let subjects = []
    if (cloneId) {
      subjects = await getCloneSpecificSubjects(cloneId)
      console.log(`🗺️ [SITEMAP] Found ${subjects.length} clone-specific subjects`)
    } else {
      subjects = await getGlobalSubjects()
      console.log(`🗺️ [SITEMAP] Found ${subjects.length} global subjects`)
    }
    
    // Remove duplicates based on slug (in case of data issues)
    const uniqueSubjects = subjects.reduce((acc: SubjectData[], subject: SubjectData) => {
      if (!acc.find((s: SubjectData) => s.slug === subject.slug)) {
        acc.push(subject)
      }
      return acc
    }, [])
    
    console.log(`🗺️ [SITEMAP] After deduplication: ${uniqueSubjects.length} subjects`)
    
    // Generate sitemap XML
    const now = new Date().toISOString()
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${uniqueSubjects.map((subject: SubjectData) => `  <url>
    <loc>${baseUrl}/${subject.slug}</loc>
    <lastmod>${subject._updatedAt || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('🗺️ [SITEMAP] Error generating sitemap:', error)
    
    // Fallback sitemap with canonical URL
    const headersList = await headers()
    const host = headersList.get('host')
    const hostname = host?.split(':')[0] || 'localhost'
    const baseUrl = hostname.startsWith('www.') ? `https://${hostname}` : `https://www.${hostname}`
    const now = new Date().toISOString()
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
} 