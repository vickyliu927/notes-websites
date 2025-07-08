

export default async function SubjectExamBoardPage({ params }: { params: Promise<{ subject: string, examBoard: string }> }) {
  const { subject, examBoard } = await params
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Subject + Exam Board Page</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Route Parameters:</h2>
          <p className="text-lg">Subject: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{subject}</span></p>
          <p className="text-lg">Exam Board: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{examBoard}</span></p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How this works:</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Clone domains:</strong> <code>/biology</code> → Exam board selection page</li>
              <li>• <strong>Clone domains:</strong> <code>/biology/aqa</code> → This page (Subject + Exam Board content)</li>
              <li>• <strong>Main domain:</strong> <code>/biology</code> → Subject page</li>
              <li>• <strong>Main domain:</strong> <code>/exam-boards/biology</code> → Exam board selection page</li>
              <li>• <strong>Main domain:</strong> <code>/biology/aqa</code> → This page (Subject + Exam Board content)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 