import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET(req: NextRequest) {
  try {
    // Get all clones
    const clones = await client.fetch(`
      *[_type == "clone"] | order(baselineClone desc, _createdAt asc) {
        _id,
        cloneId,
        cloneName,
        isActive,
        baselineClone,
        metadata {
          domains,
          siteTitle,
          targetAudience
        }
      }
    `)

    // Get all biology subject pages
    const biologyPages = await client.fetch(`
      *[_type == "subjectPage" && subjectSlug == "biology"] {
        _id,
        title,
        subjectSlug,
        subjectName,
        pageTitle,
        pageDescription,
        isPublished,
        cloneReference->{
          _id,
          cloneId,
          cloneName,
          baselineClone,
          isActive
        }
      }
    `)

    // Get all subject pages for better understanding
    const allSubjectPages = await client.fetch(`
      *[_type == "subjectPage"] | order(subjectSlug asc) {
        _id,
        title,
        subjectSlug,
        subjectName,
        isPublished,
        cloneReference->{
          _id,
          cloneId,
          cloneName,
          baselineClone,
          isActive
        }
      }
    `)

    // Test the fallback query for different clones
    const fallbackTests = []
    for (const clone of clones.filter(c => c.isActive)) {
      const fallbackResult = await client.fetch(`
        {
          "cloneSpecific": *[_type == "subjectPage" && cloneReference->cloneId.current == "${clone.cloneId.current}" && subjectSlug == "biology" && isPublished == true][0] {
            _id,
            title,
            pageTitle,
            cloneReference->{cloneId, cloneName}
          },
          "baseline": *[_type == "subjectPage" && cloneReference->baselineClone == true && subjectSlug == "biology" && isPublished == true][0] {
            _id,
            title,
            pageTitle,
            cloneReference->{cloneId, cloneName}
          },
          "default": *[_type == "subjectPage" && !defined(cloneReference) && subjectSlug == "biology" && isPublished == true][0] {
            _id,
            title,
            pageTitle
          }
        }
      `)
      
      fallbackTests.push({
        clone: clone.cloneName,
        cloneId: clone.cloneId.current,
        fallbackResult
      })
    }

    return NextResponse.json({
      clones,
      biologyPages,
      allSubjectPages,
      fallbackTests,
      summary: {
        totalClones: clones.length,
        activeClones: clones.filter(c => c.isActive).length,
        biologyPagesCount: biologyPages.length,
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