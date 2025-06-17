import React from 'react'
import { Metadata } from 'next'
import { getAllClones } from '../../../../lib/cloneUtils'

export const metadata: Metadata = {
  title: 'Clone Management - Admin Dashboard',
  description: 'Manage website clones, view analytics, and configure clone-specific settings',
}

interface CloneStats {
  totalClones: number
  activeClones: number
  inactiveClones: number
  totalPageViews: number
}

export default async function CloneManagementPage() {
  // Fetch all clones for management
  const activeClones = await getAllClones()
  const cloneStats: CloneStats = {
    totalClones: activeClones?.length || 0, // In real implementation, fetch total including inactive
    activeClones: activeClones?.length || 0,
    inactiveClones: 0, // Calculate from total - active
    totalPageViews: 0, // Implement analytics integration
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clone Management</h1>
          <p className="text-gray-600 mt-2">
            Manage website clones, monitor performance, and configure clone-specific settings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🌐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Clones</dt>
                  <dd className="text-lg font-medium text-gray-900">{cloneStats.totalClones}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Clones</dt>
                  <dd className="text-lg font-medium text-gray-900">{cloneStats.activeClones}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏸️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive Clones</dt>
                  <dd className="text-lg font-medium text-gray-900">{cloneStats.inactiveClones}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                  <dd className="text-lg font-medium text-gray-900">{cloneStats.totalPageViews}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span>➕</span>
            Create New Clone
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <span>📤</span>
            Bulk Export
          </button>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <span>📈</span>
            Analytics Report
          </button>
          <a 
            href="/studio" 
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <span>🛠️</span>
            Sanity Studio
          </a>
        </div>

        {/* Clone List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Clones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clone ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                 {activeClones?.map((clone: any) => (
                  <tr key={clone._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {clone.cloneId.current}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {clone.cloneName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {clone.cloneDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        clone.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {clone.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {clone.metadata?.createdAt 
                        ? new Date(clone.metadata.createdAt).toLocaleDateString() 
                        : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`/clone/${clone.cloneId.current}/homepage`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </a>
                        <button className="text-green-600 hover:text-green-900">
                          Edit
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          Duplicate
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-600">test-clone activated</span>
                <span className="ml-auto text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-600">Homepage content updated</span>
                <span className="ml-auto text-gray-400">1 day ago</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-600">New clone created</span>
                <span className="ml-auto text-gray-400">3 days ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Load Time</span>
                <span className="text-sm font-semibold text-green-600">0.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-semibold text-red-600">0.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-semibold text-green-600">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/clone-system-test" className="block text-sm text-blue-600 hover:text-blue-900">
                🧪 Test Dashboard
              </a>
              <a href="/studio" className="block text-sm text-blue-600 hover:text-blue-900">
                🛠️ Sanity Studio
              </a>
              <a href="/admin/analytics" className="block text-sm text-blue-600 hover:text-blue-900">
                📊 Analytics
              </a>
              <a href="/admin/settings" className="block text-sm text-blue-600 hover:text-blue-900">
                ⚙️ Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 30 // Revalidate every 30 seconds for fresh data 