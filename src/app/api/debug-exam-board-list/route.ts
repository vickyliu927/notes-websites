import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET(req: NextRequest) {
  const query = `*[_type == "examBoardPage"]{
    _id,
    title,
    isActive,
    cloneReference->{_id, cloneId, cloneName},
    subjectPageReference->{_id, title, subjectSlug, subjectName}
  }`
  try {
    const data = await client.fetch(query)
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
} 