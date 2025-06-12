export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cie-igcse-notes.vercel.app'
  
  const robotsTxt = `User-Agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=3600', // Cache for 1 hour
    },
  })
} 