import { format } from 'date-fns'
import { useState } from 'react'
import { Label } from '@/types/label'
import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { LabelPicker } from './LabelPicker'
import { CategorySelect } from './CategorySelect'
import { DatePicker } from './DatePicker'

interface Props {
  todo: Todo
  labels: Label[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
}

export function TodoItem({
  todo,
  labels,
  categories,
  onUpdate,
}: Props & { categories: Category[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleSave = () => {
    onUpdate(todo.id, { title: editTitle })
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <input
        type="checkbox"
        checked={todo.status === 'DONE'}
        onChange={e => onUpdate(todo.id, { status: e.target.checked ? 'DONE' : 'TODO' })}
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="flex-1 rounded-lg border p-2 text-gray-900 placeholder:text-gray-500"
            />
          ) : (
            <span className={`text-gray-900 ${todo.status === 'DONE' ? 'line-through' : ''}`}>
              {todo.title}
            </span>
          )}
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
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <CategorySelect
              value={todo.categoryId}
              onChange={categoryId => onUpdate(todo.id, { categoryId })}
              categories={categories}
            />
            <DatePicker
              selected={todo.dueDate ? new Date(todo.dueDate) : null}
              onChange={date => onUpdate(todo.id, { dueDate: date ?? undefined })}
              className="rounded-lg border p-2"
            />
            <LabelPicker
              selectedLabels={todo.labels}
              onChange={labels => onUpdate(todo.id, { labels })}
            />
          </div>
        ) : (
          <>
            {todo.dueDate && (
              <span className="text-sm text-gray-500">
                Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {todo.labels.length > 0 && (
              <div className="flex gap-2">
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
