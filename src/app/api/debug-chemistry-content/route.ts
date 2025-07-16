import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET(request: NextRequest) {
  try {
    // Check what chemistry subject pages exist for each clone
    const allChemistryPages = await client.fetch(`
      *[_type == "subjectPage" && subjectSlug.current == "chemistry"] {
        _id,
        title,
        subjectSlug,
        cloneVersion,
        isPublished,
        "cloneName": cloneVersion->cloneName,
        "cloneId": cloneVersion->cloneId.current,
        topics,
        hero
      }
    `)

    // Also check exam board pages for chemistry
    const allChemistryExamBoards = await client.fetch(`
      *[_type == "examBoardPage" && subjectSlug.current == "chemistry"] {
        _id,
        title,
        subjectSlug,
        examBoardSlug,
        cloneVersion,
        isPublished,
        "cloneName": cloneVersion->cloneName,
        "cloneId": cloneVersion->cloneId.current,
        "examBoardName": associatedExamBoard->name
      }
    `)

    return NextResponse.json({
      subjectPages: allChemistryPages,
      examBoardPages: allChemistryExamBoards,
      totalSubjectPages: allChemistryPages.length,
      totalExamBoardPages: allChemistryExamBoards.length,
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('Chemistry content debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch chemistry content',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 