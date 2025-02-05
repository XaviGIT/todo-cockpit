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
    <div className="flex gap-2">
      {labels.map(label => (
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
          className={`rounded-full px-3 py-1 text-sm ${
            selectedLabels.includes(label.id) ? 'opacity-100' : 'opacity-50'
          }`}
          style={{ backgroundColor: label.color, color: 'white' }}
        >
          {label.name}
        </button>
      ))}
    </div>
  )
}