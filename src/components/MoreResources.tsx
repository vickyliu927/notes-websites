import { MoreResourcesSection } from '../../types/sanity'

interface MoreResourcesProps {
  moreResourcesData?: MoreResourcesSection
}

export default function MoreResources({ moreResourcesData }: MoreResourcesProps) {
  if (!moreResourcesData?.isActive || !moreResourcesData?.resources?.length) {
    return null
  }

  const sectionTitle = moreResourcesData.sectionTitle || 'More Resources'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-semibold font-serif mb-4" style={{ color: '#243b53', fontSize: '42px' }}>
            {sectionTitle}
          </h2>
        </div>

        <div className="bg-gray-50 rounded-3xl shadow-lg p-8">
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {moreResourcesData.resources.map((resource, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3 mt-1">•</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    {resource.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
} 