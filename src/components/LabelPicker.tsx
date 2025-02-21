'use client'

import { useState, useRef, useEffect } from 'react'
import { useLabels, useLabelMutations } from '@/app/hooks/api'

interface Props {
  selectedLabels: string[]
  onChange: (labels: string[]) => void
}

export function LabelPicker({ selectedLabels, onChange }: Props) {
  const { data: labels = [], isLoading } = useLabels()
  const [isCreatingLabel, setIsCreatingLabel] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6') // Default blue
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  const { addLabel, deleteLabel } = useLabelMutations()

  // Predefined colors for quick selection
  const predefinedColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#64748b', // slate
  ]

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCreateLabel = () => {
    if (!newLabelName.trim()) return

    addLabel.mutate(
      {
        name: newLabelName.trim(),
        color: newLabelColor,
      },
      {
        onSuccess: newLabel => {
          // Auto-select the newly created label
          onChange([...selectedLabels, newLabel.id])
          setNewLabelName('')
          setIsCreatingLabel(false)
        },
      }
    )
  }

  const handleDeleteLabel = (e: React.MouseEvent, labelId: string) => {
    e.stopPropagation()

    // First remove it from selected labels if it's selected
    if (selectedLabels.includes(labelId)) {
      onChange(selectedLabels.filter(id => id !== labelId))
    }

    // Then delete it
    deleteLabel.mutate(labelId)
  }

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded-full w-full max-w-md"></div>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {labels.map(label => {
          const isSelected = selectedLabels.includes(label.id)
          const bgOpacity = isSelected ? '1' : '0.2'

          return (
            <button
              key={label.id}
              onClick={() => {
                onChange(
                  isSelected
                    ? selectedLabels.filter(id => id !== label.id)
                    : [...selectedLabels, label.id]
                )
              }}
              className={`group relative flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
                isSelected ? 'ring-2 ring-offset-1' : ''
              }`}
              style={{
                backgroundColor: `${label.color}${isSelected ? '' : '33'}`,
                color: isSelected ? 'white' : getContrastingTextColor(label.color),
                ringColor: label.color,
              }}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              <span>{label.name}</span>

              {/* Delete button - appears on hover */}
              <span
                onClick={e => handleDeleteLabel(e, label.id)}
                className="ml-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 cursor-pointer"
                title="Delete label"
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleDeleteLabel(e, label.id)
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </button>
          )
        })}

        {/* Add new label button */}
        {!isCreatingLabel && (
          <button
            onClick={() => setIsCreatingLabel(true)}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Label</span>
          </button>
        )}
      </div>

      {/* Create new label form */}
      {isCreatingLabel && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-3 text-sm font-medium text-gray-700">Create new label</div>
          <div className="flex gap-2">
            <div className="relative">
              <div className="flex flex-col items-center">
                <div
                  className="h-10 w-10 rounded-md border-2 border-gray-300 shadow-sm flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsColorPickerOpen(!isColorPickerOpen)
                    }
                  }}
                  aria-haspopup="true"
                  aria-expanded={isColorPickerOpen}
                  aria-label="Select color"
                >
                  <div className="h-full w-full" style={{ backgroundColor: newLabelColor }}></div>
                </div>
                <span className="mt-1 text-xs font-mono text-gray-600">{newLabelColor}</span>
              </div>

              {/* Color picker dropdown */}
              {isColorPickerOpen && (
                <div
                  ref={colorPickerRef}
                  className="absolute left-0 top-12 z-10 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg min-w-48"
                >
                  <div className="mb-2 text-xs font-medium text-gray-600">Preset colors</div>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-md shadow-sm transition-transform hover:scale-110 ${
                          color === newLabelColor
                            ? 'ring-2 ring-blue-500 ring-offset-1'
                            : 'hover:ring-1 hover:ring-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setNewLabelColor(color)
                          setIsColorPickerOpen(false)
                        }}
                        aria-label={`Select color ${color}`}
                      ></button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="mb-2 text-xs font-medium text-gray-600">Custom color</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-md"
                        style={{ backgroundColor: newLabelColor }}
                      ></div>
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={newLabelColor}
                        onChange={e => setNewLabelColor(e.target.value)}
                        className="h-8 w-full cursor-pointer rounded border border-gray-300 p-0.5"
                        aria-label="Select custom color"
                      />
                    </div>
                    <div className="text-center mt-2 text-xs font-mono text-gray-700">
                      {newLabelColor}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={newLabelName}
                onChange={e => setNewLabelName(e.target.value)}
                placeholder="Enter label name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                autoFocus
                maxLength={15}
              />
              <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-500">Max 15 characters</span>
                <span className="text-xs text-gray-500">{newLabelName.length}/15</span>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setIsCreatingLabel(false)}
                className="h-10 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLabel}
                disabled={!newLabelName.trim()}
                className={`h-10 rounded-md px-4 py-2 text-sm text-white ${
                  newLabelName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to determine contrasting text color
function getContrastingTextColor(hexColor: string): string {
  // Remove the # if present
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
