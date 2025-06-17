import { 
  getCompleteCloneData,
  getAllClones,
  getBaseline
} from '../../../lib/cloneUtils'

export default async function CloneTestPage() {
  const [allClones, baseline, testCloneData] = await Promise.all([
    getAllClones(),
    getBaseline(),
    getCompleteCloneData('test-clone')
  ])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Enhanced Clone System Test</h1>
      
      <div className="space-y-8">
        
        {/* Clone Management */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Clone Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">All Active Clones ({allClones.length})</h3>
              <div className="space-y-2">
                {allClones.map((clone) => (
                  <div key={clone._id} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">
                      {clone.cloneName} 
                      {clone.baselineClone && <span className="text-blue-600 ml-2">(Baseline)</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      ID: {clone.cloneId.current}
                    </div>
                    {clone.metadata?.region && (
                      <div className="text-sm text-gray-600">
                        Region: {clone.metadata.region}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Baseline Clone</h3>
              {baseline ? (
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium">{baseline.cloneName}</div>
                  <div className="text-sm text-gray-600">ID: {baseline.cloneId.current}</div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No baseline clone found</div>
              )}
            </div>
          </div>
        </section>

        {/* Test Clone Data */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Test Clone: Complete Data</h2>
          
          {testCloneData ? (
            <div className="space-y-6">
              
              {/* Clone Info */}
              <div>
                <h3 className="text-lg font-medium mb-2">Clone Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span> {testCloneData.clone?.cloneName}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {testCloneData.clone?.cloneId.current}
                    </div>
                    <div>
                      <span className="font-medium">Active:</span> {testCloneData.clone?.isActive ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Baseline:</span> {testCloneData.clone?.baselineClone ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Summary */}
              <div>
                <h3 className="text-lg font-medium mb-2">Component Summary</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.entries(testCloneData.summary?.components || {}).map(([key, count]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">{count as number}</div>
                      <div className="text-sm capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Components with Fallback Info */}
              <div>
                <h3 className="text-lg font-medium mb-2">Components (with Fallback Sources)</h3>
                <div className="space-y-4">
                  
                  {/* Homepage */}
                  <div className="border p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Homepage</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        testCloneData.components.homepage.source === 'clone-specific' ? 'bg-green-100 text-green-800' :
                        testCloneData.components.homepage.source === 'baseline' ? 'bg-yellow-100 text-yellow-800' :
                        testCloneData.components.homepage.source === 'default' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Source: {testCloneData.components.homepage.source}
                      </span>
                    </div>
                    {testCloneData.components.homepage.data ? (
                      <div className="text-sm text-gray-600">
                        Title: {(testCloneData.components.homepage.data as any).pageTitle}
                        {(testCloneData.components.homepage.data as any).cloneName && (
                          <span className="ml-2">({(testCloneData.components.homepage.data as any).cloneName})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No data available</div>
                    )}
                  </div>

                  {/* Hero */}
                  <div className="border p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Hero</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        testCloneData.components.hero.source === 'clone-specific' ? 'bg-green-100 text-green-800' :
                        testCloneData.components.hero.source === 'baseline' ? 'bg-yellow-100 text-yellow-800' :
                        testCloneData.components.hero.source === 'default' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Source: {testCloneData.components.hero.source}
                      </span>
                    </div>
                    {testCloneData.components.hero.data ? (
                      <div className="text-sm text-gray-600">
                        Title: {(testCloneData.components.hero.data as any).sectionTitle}
                        {(testCloneData.components.hero.data as any).cloneName && (
                          <span className="ml-2">({(testCloneData.components.hero.data as any).cloneName})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No data available</div>
                    )}
                  </div>

                  {/* Subject Grid */}
                  <div className="border p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Subject Grid</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        testCloneData.components.subjectGrid.source === 'clone-specific' ? 'bg-green-100 text-green-800' :
                        testCloneData.components.subjectGrid.source === 'baseline' ? 'bg-yellow-100 text-yellow-800' :
                        testCloneData.components.subjectGrid.source === 'default' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Source: {testCloneData.components.subjectGrid.source}
                      </span>
                    </div>
                    {testCloneData.components.subjectGrid.data ? (
                      <div className="text-sm text-gray-600">
                        Title: {(testCloneData.components.subjectGrid.data as any).sectionTitleFirstPart} {(testCloneData.components.subjectGrid.data as any).sectionTitleSecondPart}
                        {(testCloneData.components.subjectGrid.data as any).cloneName && (
                          <span className="ml-2">({(testCloneData.components.subjectGrid.data as any).cloneName})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No data available</div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="text-gray-500 italic">No test clone data available</div>
          )}
        </section>

        {/* Raw Data */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Raw Data (for debugging)</h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(testCloneData, null, 2)}
          </pre>
        </section>

      </div>
    </div>
  )
} 