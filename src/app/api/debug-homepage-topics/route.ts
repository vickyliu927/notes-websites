import { NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET() {
  try {
    const query = `
      *[_type == "homepage" && isActive == true][0] {
        _id,
        title,
        pageTitle,
        sections,
        "singleSubject": topicBlocksSubject->{
          _id,
          title,
          pageTitle,
          "topicCount": count(topics),
          topics[0...3] {
            topicName,
            "subtopicCount": count(subtopics)
          }
        },
        "multipleSubjects": topicBlocksSubjects[]->{
          _id,
          title,
          pageTitle,
          "topicCount": count(topics),
          topics[0...3] {
            topicName,
            "subtopicCount": count(subtopics)
          }
        }
      }
    `
    
    const data = await client.fetch(query)
    
    return NextResponse.json({
      success: true,
      data,
      debug: {
        hasData: !!data,
        showTopicBlocks: data?.sections?.showTopicBlocks,
        singleSubjectExists: !!data?.singleSubject,
        multipleSubjectsCount: data?.multipleSubjects?.length || 0,
        subjects: data?.multipleSubjects?.map((subject: any) => ({
          id: subject._id,
          title: subject.pageTitle,
          topicCount: subject.topicCount
        })) || []
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Debug homepage topics error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
