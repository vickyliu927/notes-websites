import React from 'react'

interface ExamBoard {
  id: string
  name: string
  customTitle?: string
  customDescription?: string
  logo?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
    hotspot?: any
    crop?: any
  }
  buttonLabel: string
}

interface ExamBoardPageData {
  title: string
  description: string
  examBoards: ExamBoard[]
  ctaButtons?: {
    isActive: boolean
    studyNotesButton: {
      buttonText: string
      buttonUrl: string
    }
    practiceQuestionsButton: {
      buttonText: string
      buttonUrl: string
    }
  }
  sidebar?: {
    isActive: boolean
    studyNotesButton: {
      blockTitle: string
      blockSubtitle: string
      blockDescription: string
      buttonText: string
      buttonUrl: string
    }
    practiceQuestionsButton: {
      blockTitle: string
      blockSubtitle: string
      blockDescription: string
      buttonText: string
      buttonUrl: string
    }
  }
}



interface ExamBoardPageProps {
  examBoardPageData: ExamBoardPageData
  currentSubject?: string
}

export const ExamBoardPage: React.FC<ExamBoardPageProps> = ({ examBoardPageData, currentSubject }) => {
  // Debug logging - now using sidebar from examBoardPageData
  console.log('ExamBoardPage examBoardPageData.sidebar:', examBoardPageData.sidebar);
  console.log('ExamBoardPage sidebar.isActive:', examBoardPageData.sidebar?.isActive);
  
  // Use sidebar data from examBoardPageData instead of separate prop
  const sidebarConfig = examBoardPageData.sidebar;
  
  const generateExamBoardUrl = (board: ExamBoard): string => {
    if (!currentSubject) {
      return '#'
    }
    
    const examBoardSlug = board.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    
    return `/${currentSubject}/${examBoardSlug}`
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="font-serif font-bold mb-6" style={{fontSize: '55px', color: '#243b53', letterSpacing: '-0.01em', fontWeight: 600}}>
          {examBoardPageData.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          {examBoardPageData.description}
        </p>
      </div>

      {/* CTA Buttons Section */}
      {examBoardPageData.ctaButtons?.isActive && (
        <div className="flex justify-center gap-4 mb-12">
          <a 
            href={examBoardPageData.ctaButtons.studyNotesButton.buttonUrl}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
            style={{ backgroundColor: '#001a96' }}
          >
            {examBoardPageData.ctaButtons.studyNotesButton.buttonText}
          </a>
          <a 
            href={examBoardPageData.ctaButtons.practiceQuestionsButton.buttonUrl}
            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300"
            style={{ backgroundColor: '#fb510f' }}
          >
            {examBoardPageData.ctaButtons.practiceQuestionsButton.buttonText}
          </a>
        </div>
      )}

      {/* Main Section: Exam Boards + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Exam Board Blocks */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
          {examBoardPageData.examBoards?.map((board) => (
            <div key={board.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              {board.logo?.asset?.url && (
                <div className="w-32 h-32 flex items-center justify-center mb-6 bg-gray-50 rounded-lg p-4">
                  <img 
                    src={board.logo.asset.url} 
                    alt={board.logo.alt || board.name} 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{board.customTitle || board.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{board.customDescription}</p>
              <a 
                href={generateExamBoardUrl(board)} 
                className="mt-auto px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium"
              >
                {board.buttonLabel}
              </a>
            </div>
          ))}
        </div>
        {/* Sidebar - Only show if data exists and is active */}
        {sidebarConfig && sidebarConfig.isActive && (
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Premium Study Notes Card */}
            <div className="rounded-2xl p-8 text-white w-full" style={{ backgroundColor: '#001a96' }}>
              <div className="flex items-start gap-4 mb-4">
                {/* Book Icon */}
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                                  <div>
                    <h3 className="text-xl font-bold mb-1">{sidebarConfig.studyNotesButton.blockTitle}</h3>
                    <p className="text-blue-100 text-sm">{sidebarConfig.studyNotesButton.blockSubtitle}</p>
                  </div>
                </div>
                <p className="text-white mb-6 leading-relaxed">
                  {sidebarConfig.studyNotesButton.blockDescription}
                </p>
              <a 
                href={sidebarConfig.studyNotesButton.buttonUrl} 
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                {sidebarConfig.studyNotesButton.buttonText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Practice Questions Card */}
            <div className="rounded-2xl p-8 text-white w-full" style={{ backgroundColor: '#fb510f' }}>
              <div className="flex items-start gap-4 mb-4">
                {/* Checkmark Icon */}
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                                  <div>
                    <h3 className="text-xl font-bold mb-1">{sidebarConfig.practiceQuestionsButton.blockTitle}</h3>
                    <p className="text-orange-100 text-sm">{sidebarConfig.practiceQuestionsButton.blockSubtitle}</p>
                  </div>
                </div>
                <p className="text-white mb-6 leading-relaxed">
                  {sidebarConfig.practiceQuestionsButton.blockDescription}
                </p>
              <a 
                href={sidebarConfig.practiceQuestionsButton.buttonUrl} 
                className="inline-flex items-center gap-2 bg-white text-orange-900 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors duration-200"
              >
                {sidebarConfig.practiceQuestionsButton.buttonText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default ExamBoardPage 