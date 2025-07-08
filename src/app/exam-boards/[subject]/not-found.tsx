import Link from 'next/link'

export default function ExamBoardNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Exam Board Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The exam board page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been configured yet.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
} 