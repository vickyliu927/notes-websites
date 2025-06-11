export async function GET() {
  const robotsTxt = `User-Agent: *
Allow: /

Sitemap: https://www.igcse-notes.com/sitemap.xml`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=60', // Cache for 60 seconds, consistent with page revalidation
    },
  })
} 