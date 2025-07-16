import { NextRequest, NextResponse } from 'next/server'
import { hasActiveExamBoardPages, getExamBoardPage } from '../../../../lib/sanity'

export async function GET(req: NextRequest) {
  try {
    // Check if there are any active exam board pages
    const { hasActive: hasActiveExamBoards, cloneId: examBoardCloneId } = await hasActiveExamBoardPages();
    
    let examBoardPageData = null;
    if (hasActiveExamBoards && examBoardCloneId) {
      examBoardPageData = await getExamBoardPage(examBoardCloneId);
    }

    return NextResponse.json({
      hasActiveExamBoards,
      examBoardCloneId,
      examBoardPageData: examBoardPageData ? {
        title: examBoardPageData.title,
        description: examBoardPageData.description,
        examBoards: examBoardPageData.examBoards?.map((eb: any) => ({
          id: eb.id,
          name: eb.name,
          customTitle: eb.customTitle
        }))
      } : null,
      urlStructure: {
        current: hasActiveExamBoards 
          ? "NEW: /[subject] = exam board selection, /[subject]/[examBoard] = subject content"
          : "OLD: /[subject] = subject content, /[subject]/[examBoard] = exam board selection"
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 