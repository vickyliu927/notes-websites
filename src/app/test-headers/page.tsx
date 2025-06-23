import { headers } from 'next/headers'

export default async function TestHeadersPage() {
  const headersList = await headers()
  
  const cloneId = headersList.get('x-clone-id')
  const clonePath = headersList.get('x-clone-path') 
  const cloneSource = headersList.get('x-clone-source')
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Header Test Page</h1>
      <div className="space-y-2">
        <p><strong>Clone ID:</strong> {cloneId || 'Not set'}</p>
        <p><strong>Clone Path:</strong> {clonePath || 'Not set'}</p>
        <p><strong>Clone Source:</strong> {cloneSource || 'Not set'}</p>
        <p><strong>Request URL:</strong> {headersList.get('host') || 'Not available'}</p>
        <p><strong>User Agent:</strong> {headersList.get('user-agent')?.substring(0, 50) || 'Not available'}...</p>
      </div>
    </div>
  )
} 