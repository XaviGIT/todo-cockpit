'use client'

import { useState } from 'react'
import { Label } from '@/types/label'

interface Props {
  selectedLabels: string[]
  onChange: (labels: string[]) => void
}

export function LabelPicker({ selectedLabels, onChange }: Props) {
  const [labels] = useState<Label[]>([
    { id: '1', name: 'Work', color: '#ef4444' },
    { id: '2', name: 'Personal', color: '#3b82f6' },
    { id: '3', name: 'Urgent', color: '#f97316' },
  ])

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map(label => {
        const isSelected = selectedLabels.includes(label.id)
        const bgColor = label.color
        const bgOpacity = isSelected ? '1' : '0.2'
        const textColor = isSelected ? 'white' : getContrastingTextColor(label.color)

        return (
          <button
            key={label.id}
            onClick={() => {
              const isSelected = selectedLabels.includes(label.id)
              onChange(
                isSelected
                  ? selectedLabels.filter(id => id !== label.id)
                  : [...selectedLabels, label.id]
              )
            }}
            className={`relative flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
              isSelected ? 'ring-2 ring-offset-1' : ''
            }`}
            style={{
              backgroundColor: `${bgColor}${isSelected ? '' : '33'}`,
              color: textColor,
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
        )
      })}
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
