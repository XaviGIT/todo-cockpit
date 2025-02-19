'use client'

import { useState } from 'react'
import { Label } from '@/types/label'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'

interface Props {
  selectedLabels: string[]
  onChange: (labels: string[]) => void
}

export function LabelPicker({ selectedLabels, onChange }: Props) {
  // Store labels in localStorage to persist custom labels
  const [labels, setLabels] = useLocalStorage<Label[]>('todo_labels', [
    { id: '1', name: 'Work', color: '#ef4444' },
    { id: '2', name: 'Personal', color: '#3b82f6' },
    { id: '3', name: 'Urgent', color: '#f97316' },
    { id: '4', name: 'Low Priority', color: '#10b981' },
    { id: '5', name: 'Waiting', color: '#8b5cf6' },
  ])

  const [showLabelForm, setShowLabelForm] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#3b82f6')

  // Predefined colors
  const colorOptions = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#d946ef', // fuchsia
    '#ec4899', // pink
  ]

  const addNewLabel = () => {
    if (!newLabelName.trim()) return

    const newLabel: Label = {
      id: Date.now().toString(),
      name: newLabelName.trim(),
      color: selectedColor,
    }

    setLabels([...labels, newLabel])
    setNewLabelName('')
    setSelectedColor('#3b82f6')
    setShowLabelForm(false)
  }

  const deleteLabel = (id: string) => {
    // Remove the label
    setLabels(labels.filter(label => label.id !== id))

    // Remove the label from selected labels if present
    if (selectedLabels.includes(id)) {
      onChange(selectedLabels.filter(labelId => labelId !== id))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {labels.map(label => {
          const isSelected = selectedLabels.includes(label.id)
          const bgColor = label.color
          const bgOpacity = isSelected ? '1' : '0.15'

          return (
            <div key={label.id} className="relative group">
              <button
                onClick={() => {
                  onChange(
                    isSelected
                      ? selectedLabels.filter(id => id !== label.id)
                      : [...selectedLabels, label.id]
                  )
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
                  isSelected ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: `${bgColor}${isSelected ? '' : '26'}`,
                  color: isSelected ? getContrastingTextColor(bgColor) : bgColor,
                  ringColor: bgColor,
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
              </button>

              {/* Delete button, only shows on hover and for custom labels (id > 5) */}
              {parseInt(label.id) > 5 && (
                <button
                  onClick={() => deleteLabel(label.id)}
                  className="absolute -right-1 -top-1 hidden rounded-full bg-white p-0.5 text-gray-500 shadow-sm hover:bg-red-50 hover:text-red-500 group-hover:block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
                </button>
              )}
            </div>
          )
        })}

        {/* Add new label button */}
        {!showLabelForm && (
          <button
            onClick={() => setShowLabelForm(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
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

      {/* New Label Form */}
      {showLabelForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-3">
            <label htmlFor="label-name" className="mb-1 block text-sm font-medium text-gray-700">
              Label Name
            </label>
            <input
              id="label-name"
              type="text"
              value={newLabelName}
              onChange={e => setNewLabelName(e.target.value)}
              placeholder="Enter label name"
              className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-gray-700">Label Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-6 w-6 rounded-full ${
                    selectedColor === color ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color, ringColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowLabelForm(false)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addNewLabel}
              disabled={!newLabelName.trim()}
              className={`rounded-md px-3 py-1.5 text-sm text-white ${
                newLabelName.trim()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Add Label
            </button>
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
