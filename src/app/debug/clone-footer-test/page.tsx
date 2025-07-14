import { getCompleteCloneData, getAllClones } from '../../../../lib/cloneUtils'

export default async function CloneFooterTestPage() {
  const allClones = await getAllClones()
  
  // Try to find the UK A-Levels Question Bank clone
  const ukClone = allClones.find(clone => 
    clone.cloneName.toLowerCase().includes('uk') || 
    clone.cloneName.toLowerCase().includes('a-level') ||
    clone.cloneName.toLowerCase().includes('question bank')
  )
  
  let ukCloneData = null
  if (ukClone) {
    ukCloneData = await getCompleteCloneData(ukClone.cloneId.current)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Clone Footer Debug Test</h1>
      
      <div className="space-y-8">
        {/* All Clones */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">All Clones ({allClones.length})</h2>
          <div className="space-y-4">
            {allClones.map((clone) => (
              <div key={clone._id} className="bg-gray-50 p-4 rounded border">
                <div className="font-medium text-lg">
                  {clone.cloneName}
                  {clone.baselineClone && <span className="text-blue-600 ml-2">(Baseline)</span>}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>ID:</strong> {clone.cloneId.current}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Active:</strong> {clone.isActive ? 'Yes' : 'No'}
                </div>
                {clone.metadata?.domains && (
                  <div className="text-sm text-gray-600">
                    <strong>Domains:</strong> {clone.metadata.domains.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* UK Clone Specific Data */}
        {ukClone && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">UK A-Levels Clone Data</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium">Clone Info</h3>
                <div className="text-sm">
                  <strong>Name:</strong> {ukClone.cloneName}<br/>
                  <strong>ID:</strong> {ukClone.cloneId.current}<br/>
                  <strong>Active:</strong> {ukClone.isActive ? 'Yes' : 'No'}<br/>
                  <strong>Domains:</strong> {ukClone.metadata?.domains?.join(', ') || 'None'}
                </div>
              </div>
              
              {ukCloneData && (
                <div className="bg-green-50 p-4 rounded">
                  <h3 className="font-medium">Component Data Sources</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Header:</strong> {ukCloneData.components.header?.source || 'None'}</div>
                    <div><strong>Hero:</strong> {ukCloneData.components.hero?.source || 'None'}</div>
                    <div><strong>Subject Grid:</strong> {ukCloneData.components.subjectGrid?.source || 'None'}</div>
                    <div><strong>Why Choose Us:</strong> {ukCloneData.components.whyChooseUs?.source || 'None'}</div>
                    <div><strong>FAQ:</strong> {ukCloneData.components.faq?.source || 'None'}</div>
                    <div><strong>Contact Form:</strong> {ukCloneData.components.contactForm?.source || 'None'}</div>
                    <div><strong>Footer:</strong> {ukCloneData.components.footer?.source || 'None'}</div>
                  </div>
                </div>
              )}
              
              {ukCloneData?.components.footer?.data && (
                <div className="bg-yellow-50 p-4 rounded">
                  <h3 className="font-medium">Footer Data</h3>
                  <pre className="text-xs overflow-auto">
                    {(() => {
                      const footerData = ukCloneData.components.footer.data;
                      return JSON.stringify(footerData, null, 2);
                    })()}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {!ukClone && (
          <section className="bg-red-50 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">UK Clone Not Found</h2>
            <p>No clone found with "UK", "A-Level", or "Question Bank" in the name.</p>
            <p>Available clone names:</p>
            <ul className="list-disc list-inside mt-2">
              {allClones.map(clone => (
                <li key={clone._id}>{clone.cloneName}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
} 