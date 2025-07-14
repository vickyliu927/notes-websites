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
  buttonUrl: string
}

interface ExamBoardPageData {
  title: string
  description: string
  examBoards: ExamBoard[]
}

export const ExamBoardPage: React.FC<{ examBoardPageData: ExamBoardPageData }> = ({ examBoardPageData }) => {
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
      {/* Main Section: Exam Boards + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Exam Board Blocks */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
          {examBoardPageData.examBoards?.map((board) => (
            <div key={board.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
              {board.logo?.asset?.url && (
                <img src={board.logo.asset.url} alt={board.logo.alt || board.name} className="h-16 mb-4" />
              )}
              <h2 className="text-xl font-bold mb-2">{board.customTitle || board.name}</h2>
              <p className="text-gray-600 mb-4">{board.customDescription}</p>
              <a href={board.buttonUrl} target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                {board.buttonLabel}
              </a>
            </div>
          ))}
        </div>
        {/* Sidebar/Advert Placeholder */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">Premium Study Notes</h3>
            <p className="text-sm text-blue-900 mb-4">Expert-crafted summaries. Save hours of prep time with structured notes.</p>
            <a href="#" className="block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-center">Access Notes</a>
          </div>
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="font-bold text-orange-800 mb-2">Practice Questions</h3>
            <p className="text-sm text-orange-900 mb-4">Master exam techniques with targeted practice questions. Get instant feedback and detailed explanations.</p>
            <a href="#" className="block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-center">Start Practice</a>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ExamBoardPage 