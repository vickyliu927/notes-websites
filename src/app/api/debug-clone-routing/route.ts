import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'
import { getSubjectPageWithFallback } from '../../../../lib/cloneQueries'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const subject = url.searchParams.get('subject') || 'biology'
    
    // Get all clones
    const clones = await client.fetch(`*[_type == "clone"] | order(baselineClone desc) {
      _id,
      cloneId,
      cloneName,
      baselineClone,
      isActive,
      metadata
    }`)

    // Get all subject pages for the specified subject
    const subjectPages = await client.fetch(`*[_type == "subjectPage" && subjectSlug == "${subject}"] {
      _id,
      title,
      pageTitle,
      pageDescription,
      isPublished,
      subjectName,
      subjectSlug,
      cloneReference->{
        _id,
        cloneId,
        cloneName,
        baselineClone,
        isActive
      }
    }`)

    // Get all subject pages for comparison
    const allSubjectPages = await client.fetch(`*[_type == "subjectPage"] {
      _id,
      title,
      subjectName,
      subjectSlug,
      isPublished,
      cloneReference->{
        _id,
        cloneId,
        cloneName,
        baselineClone
      }
    }`)

    // Test fallback logic for each clone
    const fallbackTests = []
    for (const clone of clones) {
      const result = await client.fetch(getSubjectPageWithFallback(clone.cloneId.current, subject))
      fallbackTests.push({
        clone: clone.cloneName,
        cloneId: clone.cloneId.current,
        fallbackResult: result
      })
    }

    return NextResponse.json({
      subject,
      clones,
      [`${subject}Pages`]: subjectPages,
      allSubjectPages,
      fallbackTests,
      summary: {
        totalClones: clones.length,
        activeClones: clones.filter((c: any) => c.isActive).length,
        [`${subject}PagesCount`]: subjectPages.length,
        totalSubjectPages: allSubjectPages.length
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 