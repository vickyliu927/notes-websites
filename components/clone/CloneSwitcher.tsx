'use client'

import { useState } from 'react'
import { useClone } from '../../contexts/CloneContext'

interface Clone {
  cloneId: string
  cloneName: string
}

interface CloneSwitcherProps {
  showInProduction?: boolean
  className?: string
  currentCloneId?: string
  onCloneSelect?: (cloneId: string) => void
}

export default function CloneSwitcher({ 
  showInProduction = false, 
  className = '',
  currentCloneId,
  onCloneSelect
}: CloneSwitcherProps) {
  const { 
    currentClone, 
    availableClones, 
    baselineClone, 
    isLoading, 
    switchToClone, 
    switchToBaseline 
  } = useClone()
  
  const [isExpanded, setIsExpanded] = useState(false)

  // Hide in production unless explicitly shown
  if (!showInProduction && process.env.NODE_ENV === 'production') {
    return null
  }

  const handleCloneSwitch = async (cloneId: string) => {
    try {
      await switchToClone(cloneId)
      setIsExpanded(false)
    } catch (error) {
      console.error('Error switching clone:', error)
    }
  }

  const handleBaselineSwitch = async () => {
    try {
      await switchToBaseline()
      setIsExpanded(false)
    } catch (error) {
      console.error('Error switching to baseline:', error)
    }
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Current Clone Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isLoading}
      >
        <span className="mr-2">🔄</span>
        {isLoading ? (
          'Loading...'
        ) : (
          currentClone?.cloneName || currentCloneId || 'No Clone'
        )}
        <svg
          className={`-mr-1 ml-2 h-4 w-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isExpanded && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* Current Clone Info */}
            {currentClone && (
              <div className="px-4 py-2 text-xs text-gray-500 border-b">
                <div className="font-semibold">Current: {currentClone.cloneName}</div>
                <div>ID: {currentCloneId}</div>
                {currentClone.metadata?.targetAudience && (
                  <div>Audience: {currentClone.metadata.targetAudience}</div>
                )}
              </div>
            )}

            {/* No Clone Option */}
            <button
              onClick={() => {
                window.location.href = '/'
                setIsExpanded(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="mr-2">🏠</span>
              Original Site (No Clone)
            </button>

            {/* Baseline Clone */}
            {baselineClone && (
              <button
                onClick={handleBaselineSwitch}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentCloneId === baselineClone.cloneId.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-2">⭐</span>
                {baselineClone.cloneName} (Baseline)
              </button>
            )}

            {/* Available Clones */}
            {availableClones.map((clone) => (
              <button
                key={clone._id}
                onClick={() => handleCloneSwitch(clone.cloneId.current)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentCloneId === clone.cloneId.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-2">
                  {clone.baselineClone ? '⭐' : '🔄'}
                </span>
                {clone.cloneName}
                {clone.metadata?.targetAudience && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({clone.metadata.targetAudience})
                  </span>
                )}
              </button>
            ))}

            {/* No Clones Available */}
            {availableClones.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 italic">
                No clones available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}

// ===== COMPACT VERSION =====

export function CloneSwitcherCompact({ className = '' }: { className?: string }) {
  const { currentClone, currentCloneId } = useClone()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      Clone: {currentClone?.cloneName || currentCloneId || 'None'}
    </div>
  )
}

// ===== FLOATING VERSION =====

export function CloneSwitcherFloating() {
  const [isVisible, setIsVisible] = useState(true)

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isVisible ? (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Clone Switcher</span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <CloneSwitcher />
        </div>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
          title="Show Clone Switcher"
        >
          🔄
        </button>
      )}
    </div>
  )
} 