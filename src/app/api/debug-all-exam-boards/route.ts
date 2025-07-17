import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET(request: NextRequest) {
  try {
    // Get ALL exam board pages including drafts
    const allExamBoards = await client.fetch(`
      *[_type == "examBoardPage"] {
        _id,
        _rev,
        title,
        subjectSlug,
        examBoardSlug,
        isActive,
        isPublished,
        cloneVersion,
        "cloneName": cloneVersion->cloneName,
        "cloneId": cloneVersion->cloneId.current,
        "examBoardName": associatedExamBoard->name,
        "examBoardSlug": associatedExamBoard->slug.current,
        associatedExamBoard,
        _createdAt,
        _updatedAt
      }
    `)

    // Separate published vs draft
    const published = allExamBoards.filter((board: any) => !board._id.startsWith('drafts.'))
    const drafts = allExamBoards.filter((board: any) => board._id.startsWith('drafts.'))

    // Look specifically for chemistry-related pages
    const chemistryPages = allExamBoards.filter((board: any) => 
      board.title?.toLowerCase().includes('chemistry') ||
      board.subjectSlug?.current === 'chemistry' ||
      board.title?.toLowerCase().includes('aqa')
    )

    return NextResponse.json({
      total: allExamBoards.length,
      published: published.length,
      drafts: drafts.length,
      allExamBoards,
      publishedBoards: published,
      draftBoards: drafts,
      chemistryRelated: chemistryPages,
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('All exam boards debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch all exam board pages',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 