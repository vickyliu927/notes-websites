'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { SubjectTopic, SubjectSubtopic } from '../../types/sanity'
import { SmartLink } from '../../components/SmartLink'

interface SubjectTopicGridProps {
  topics: SubjectTopic[]
}

interface TopicCardProps {
  topic: SubjectTopic
}

interface SubtopicItemProps {
  subtopic: SubjectSubtopic
}

const SubtopicItem: React.FC<SubtopicItemProps> = ({ subtopic }) => {
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false)
  const hasSubSubtopics = subtopic.subSubtopics && subtopic.subSubtopics.length > 0

  const toggleSubDropdown = () => {
    setIsSubDropdownOpen(!isSubDropdownOpen)
  }

  // If subtopic has no name, skip rendering
  if (!subtopic.subtopicName) {
    return null
  }

  if (subtopic.isComingSoon) {
    return (
      <div className="p-3 text-gray-400 cursor-not-allowed flex items-center justify-between">
        <span className="font-semibold">{subtopic.subtopicName}</span>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      </div>
    )
  }

  if (hasSubSubtopics) {
    return (
      <div>
        <button
          onClick={toggleSubDropdown}
          className="w-full p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center justify-between"
        >
          <span className="font-semibold">{subtopic.subtopicName}</span>
          {isSubDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {isSubDropdownOpen && (
          <div className="ml-4">
            {subtopic.subSubtopics?.map((subSubtopic, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                {subSubtopic.isComingSoon ? (
                  <div className="p-2 pl-4 text-gray-400 cursor-not-allowed flex items-center justify-between text-sm bg-white">
                    <span className="font-semibold">{subSubtopic.subSubtopicName}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <SmartLink
                    href={subSubtopic.subSubtopicUrl}
                    className="block p-2 pl-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 bg-white"
                  >
                    <span className="font-semibold">{subSubtopic.subSubtopicName}</span>
                  </SmartLink>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Regular subtopic with direct URL
  if (subtopic.subtopicUrl) {
    return (
      <SmartLink
        href={subtopic.subtopicUrl}
        className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
      >
        <span className="font-semibold">{subtopic.subtopicName}</span>
      </SmartLink>
    )
  }

  // Subtopic without URL and no sub-subtopics (shouldn't happen with validation)
  return (
    <div className="p-3 text-gray-400 cursor-not-allowed">
      <span className="font-semibold">{subtopic.subtopicName}</span>
    </div>
  )
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Map Tailwind color classes to actual hex values
  const getBackgroundColor = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-purple-500': '#e67e50',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-teal-500': '#14b8a6',
      'bg-orange-500': '#f97316',
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-cyan-500': '#06b6d4'
    }
    return colorMap[colorClass] || '#e67e50' // Default to orange
  }

  // Check if topic has any valid subtopics
  const hasValidSubtopics = topic.subtopics && topic.subtopics.length > 0 && topic.subtopics.some(subtopic => subtopic.subtopicName)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Clickable Topic Header - only make clickable if has subtopics */}
      {hasValidSubtopics ? (
        <button
          onClick={toggleDropdown}
          className="w-full p-6 text-left hover:opacity-90 transition-opacity duration-200"
          style={{ 
            backgroundColor: getBackgroundColor(topic.color),
            color: 'white'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">{topic.topicName || 'Topic Name Missing'}</h3>
              {topic.topicDescription && (
                <p className="opacity-90 text-sm">{topic.topicDescription}</p>
              )}
            </div>
            <div className="flex flex-col items-center ml-4">
              {isDropdownOpen ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <ChevronDownIcon className="h-6 w-6" />
              )}
            </div>
          </div>
        </button>
      ) : (
        <div
          className="w-full p-6"
          style={{ 
            backgroundColor: getBackgroundColor(topic.color),
            color: 'white'
          }}
        >
          <div>
            <h3 className="text-xl font-bold mb-2">{topic.topicName || 'Topic Name Missing'}</h3>
            {topic.topicDescription && (
              <p className="opacity-90 text-sm">{topic.topicDescription}</p>
            )}
          </div>
        </div>
      )}

      {/* Dropdown Menu - only show if has subtopics and is open */}
      {hasValidSubtopics && isDropdownOpen && (
        <div className="bg-white border-t-2 border-gray-300">
          {(topic.subtopics || []).filter(subtopic => subtopic.subtopicName).map((subtopic, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <SubtopicItem subtopic={subtopic} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SubjectTopicGrid: React.FC<SubjectTopicGridProps> = ({ topics }) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No topics available for this subject at the moment.</p>
      </div>
    )
  }

  // Sort topics by display order
  const sortedTopics = [...topics].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedTopics.map((topic, index) => (
        <TopicCard key={index} topic={topic} />
      ))}
    </div>
  )
}

export default SubjectTopicGrid 