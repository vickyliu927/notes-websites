import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const action = body.action || 'create' // default to create for backward compatibility

    // First, let's get the current situation
    const currentState = await client.fetch(`
      {
        "clones": *[_type == "clone"] | order(baselineClone desc) {
          _id,
          cloneId,
          cloneName,
          baselineClone,
          isActive
        },
        "biologyPages": *[_type == "subjectPage" && subjectSlug == "biology"] {
          _id,
          title,
          pageTitle,
          pageDescription,
          isPublished,
          cloneReference->{
            _id,
            cloneId,
            cloneName,
            baselineClone
          }
        }
      }
    `)

    const baselineClone = currentState.clones.find((c: any) => c.baselineClone === true)
    const ukAlevelClone = currentState.clones.find((c: any) => c.cloneId.current === 'uk-a-levels-qb')
    
    if (!baselineClone) {
      return NextResponse.json({ error: 'No baseline clone found' }, { status: 400 })
    }

    // Check if baseline clone already has a biology page
    const baselineBiologyPage = currentState.biologyPages.find((p: any) => 
      p.cloneReference?.cloneId?.current === baselineClone.cloneId.current
    )

    if (action === 'delete_baseline_page') {
      if (!baselineBiologyPage) {
        return NextResponse.json({ 
          message: 'No baseline clone biology page to delete',
          currentState
        })
      }

      // Delete the baseline clone biology page
      await client.delete(baselineBiologyPage._id)

      // Verify the deletion and get updated state
      const updatedState = await client.fetch(`
        {
          "biologyPages": *[_type == "subjectPage" && subjectSlug == "biology"] {
            _id,
            title,
            pageTitle,
            pageDescription,
            isPublished,
            cloneReference->{
              _id,
              cloneId,
              cloneName,
              baselineClone
            }
          }
        }
      `)

      return NextResponse.json({
        success: true,
        message: 'Baseline clone biology page deleted successfully',
        deletedPageId: baselineBiologyPage._id,
        updatedState,
        summary: {
          action: 'Deleted baseline clone biology page',
          result: 'Main website will now use the default biology page (blank Clone Version)'
        }
      })
    }

    if (baselineBiologyPage) {
      return NextResponse.json({ 
        message: 'Baseline clone already has a biology page',
        baselineBiologyPage,
        currentState
      })
    }

    // Get the default biology page to use as a template
    const defaultBiologyPage = currentState.biologyPages.find((p: any) => !p.cloneReference)
    
    if (!defaultBiologyPage) {
      return NextResponse.json({ error: 'No default biology page found to use as template' }, { status: 400 })
    }

    // Create a biology page specifically for the baseline clone (IGCSE Notes)
    const newBiologyPage = await client.create({
      _type: 'subjectPage',
      title: 'Biology - IGCSE Notes',
      subjectSlug: 'biology',
      subjectName: 'Biology',
      pageTitle: 'IGCSE Biology Study Notes',
      pageDescription: 'Comprehensive IGCSE Biology study materials, revision notes, and exam preparation resources.',
      topicBlockBackgroundColor: 'bg-green-500',
      isPublished: true,
      showContactForm: true,
      cloneReference: {
        _type: 'reference',
        _ref: baselineClone._id
      },
      topics: [
        {
          topicName: 'Cell Structure and Organisation',
          topicDescription: 'Study of cells, tissues, organs and organ systems',
          color: 'bg-green-500',
          displayOrder: 1,
          subtopics: [
            {
              subtopicName: 'Cell Structure',
              subtopicUrl: '#',
              isComingSoon: true
            },
            {
              subtopicName: 'Cell Organisation',
              subtopicUrl: '#',
              isComingSoon: true
            }
          ]
        },
        {
          topicName: 'Biological Molecules',
          topicDescription: 'Carbohydrates, lipids, proteins and nucleic acids',
          color: 'bg-blue-500',
          displayOrder: 2,
          subtopics: [
            {
              subtopicName: 'Carbohydrates',
              subtopicUrl: '#',
              isComingSoon: true
            },
            {
              subtopicName: 'Proteins',
              subtopicUrl: '#',
              isComingSoon: true
            }
          ]
        }
      ],
      seo: {
        metaTitle: 'IGCSE Biology Study Notes | Comprehensive Revision Materials',
        metaDescription: 'Access comprehensive IGCSE Biology study notes, revision materials, and exam preparation resources. Expert-curated content for IGCSE Biology success.',
        keywords: 'IGCSE Biology, study notes, revision, exam preparation, cell biology, biological molecules'
      }
    })

    // Verify the fix by checking the routing again
    const verificationResult = await client.fetch(`
      {
        "originalCloneResult": *[_type == "subjectPage" && cloneReference->cloneId.current == "${baselineClone.cloneId.current}" && subjectSlug == "biology" && isPublished == true][0] {
          _id,
          title,
          pageTitle,
          cloneReference->{cloneId, cloneName}
        },
        "ukCloneResult": *[_type == "subjectPage" && cloneReference->cloneId.current == "uk-a-levels-qb" && subjectSlug == "biology" && isPublished == true][0] {
          _id,
          title,
          pageTitle,
          cloneReference->{cloneId, cloneName}
        }
      }
    `)

    return NextResponse.json({
      success: true,
      message: 'Biology page routing fixed successfully',
      newBiologyPage,
      verificationResult,
      summary: {
        baselineClone: `${baselineClone.cloneName} (${baselineClone.cloneId.current})`,
        ukClone: `${ukAlevelClone?.cloneName} (${ukAlevelClone?.cloneId.current})`,
        action: 'Created biology page for baseline clone to fix routing'
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 