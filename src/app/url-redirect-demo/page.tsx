import Link from 'next/link'

export default function URLRedirectDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔄 Clone URL Redirection Demo
          </h1>
          
          <div className="space-y-8">
            
            {/* How it works */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How URL Redirection Works</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  The middleware automatically handles URL redirection to hide the clone part from the URL while serving clone-specific content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">For Clone Domains:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">❌</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/clone/test-clone</code>
                        <span>→</span>
                        <span className="text-green-600">Redirects to</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">❌</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/clone/test-clone/maths</code>
                        <span>→</span>
                        <span className="text-green-600">Redirects to</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/maths</code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">For Non-Clone Domains:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">❌</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/clone/test-clone</code>
                        <span>→</span>
                        <span className="text-green-600">Redirects to</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">igcse-questions.com</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Test URLs */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test the Redirection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">✅ Clean URLs (What users see)</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/"
                      className="block text-blue-600 hover:text-blue-800 underline"
                    >
                      Homepage (/)
                    </Link>
                    <Link 
                      href="/clone-test"
                      className="block text-blue-600 hover:text-blue-800 underline"
                    >
                      Clone Test Page (/clone-test)
                    </Link>
                    <Link 
                      href="/clone-system-test"
                      className="block text-blue-600 hover:text-blue-800 underline"
                    >
                      Clone System Test (/clone-system-test)
                    </Link>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">⚠️ Clone URLs (Will redirect)</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/clone/test-clone"
                      className="block text-orange-600 hover:text-orange-800 underline"
                    >
                      Clone Homepage (/clone/test-clone)
                    </Link>
                    <Link 
                      href="/clone/test-clone/homepage"
                      className="block text-orange-600 hover:text-orange-800 underline"
                    >
                      Clone Homepage Detail (/clone/test-clone/homepage)
                    </Link>
                    <Link 
                      href="/clone/test-clone/maths"
                      className="block text-orange-600 hover:text-orange-800 underline"
                    >
                      Clone Subject Page (/clone/test-clone/maths)
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Domain Mapping */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Domain Mapping</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  These domains are configured to serve the <code className="bg-gray-100 px-2 py-1 rounded">test-clone</code>:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <code className="bg-white px-3 py-1 rounded border">igcse-questions.com</code>
                    <span>→</span>
                    <code className="bg-white px-3 py-1 rounded border">test-clone</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <code className="bg-white px-3 py-1 rounded border">www.igcse-questions.com</code>
                    <span>→</span>
                    <code className="bg-white px-3 py-1 rounded border">test-clone</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Debug Info */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Debug Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Check the browser's developer tools Network tab to see the redirect headers:
                </p>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-white px-2 py-1 rounded border">x-clone-id</code> - Shows which clone is being used</div>
                  <div><code className="bg-white px-2 py-1 rounded border">x-clone-redirect</code> - Indicates if a redirect occurred</div>
                  <div><code className="bg-white px-2 py-1 rounded border">x-clone-original-path</code> - Original requested path</div>
                  <div><code className="bg-white px-2 py-1 rounded border">x-clone-rewritten-path</code> - Path after rewriting</div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
} 