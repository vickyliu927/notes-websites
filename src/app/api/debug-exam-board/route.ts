import { NextRequest, NextResponse } from 'next/server'
import { getExamBoardPage } from '../../../../lib/sanity'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cloneId = searchParams.get('cloneId')

  if (!cloneId) {
    return NextResponse.json({ error: 'Missing cloneId' }, { status: 400 })
  }

  try {
    const data = await getExamBoardPage(cloneId)
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
} 