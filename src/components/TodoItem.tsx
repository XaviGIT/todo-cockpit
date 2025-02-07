import { Label } from '@/types/label'
import { Todo } from '@/types/todo'
import { format } from 'date-fns'
import { useState } from 'react'
import { LabelPicker } from './LabelPicker'

interface Props {
  todo: Todo
  labels: Label[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
}

export function TodoItem({ todo, labels, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <input
        type="checkbox"
        checked={todo.status === 'DONE'}
        onChange={e => onUpdate(todo.id, { status: e.target.checked ? 'DONE' : 'TODO' })}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-gray-900 ${todo.status === 'DONE' ? 'line-through' : ''}`}>
            {todo.title}
          </span>
          <button
            onClick={() => onUpdate(todo.id, { isImportant: !todo.isImportant })}
            className={`text-lg ${todo.isImportant ? 'text-red-500' : 'text-gray-300'}`}
          >
            ★
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            Edit
          </button>
        </div>
        {todo.dueDate && (
          <span className="text-sm text-gray-500">Due: {format(todo.dueDate, 'MMM d, yyyy')}</span>
        )}
        {isEditing ? (
          <div className="mt-2">
            <LabelPicker
              selectedLabels={todo.labels}
              onChange={labels => onUpdate(todo.id, { labels })}
            />
          </div>
        ) : (
          todo.labels.length > 0 && (
            <div className="mt-2 flex gap-2">
              {todo.labels.map(labelId => {
                const label = labels.find(l => l.id === labelId)
                return label ? (
                  <span
                    key={label.id}
                    className="rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                ) : null
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
