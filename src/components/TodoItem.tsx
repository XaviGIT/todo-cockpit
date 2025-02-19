import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { Label } from '@/types/label'
import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { LabelPicker } from './LabelPicker'
import { CategorySelect } from './CategorySelect'
import { DatePicker } from './DatePicker'

interface Props {
  todo: Todo
  labels: Label[]
  categories: Category[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoItem({
  todo,
  labels,
  categories,
  onUpdate,
}: Props & { categories: Category[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editCategoryId, setEditCategoryId] = useState<string | undefined>(todo.categoryId)
  const [editDueDate, setEditDueDate] = useState<Date | null>(
    todo.dueDate ? new Date(todo.dueDate) : null
  )
  const [editLabels, setEditLabels] = useState<string[]>(todo.labels || [])

  // Reset edit state when todo changes or when exiting edit mode
  useEffect(() => {
    setEditTitle(todo.title)
    setEditCategoryId(todo.categoryId)
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null)
    setEditLabels(todo.labels || [])
  }, [todo, isEditing])

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      categoryId: editCategoryId,
      dueDate: editDueDate ?? undefined,
      labels: editLabels,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form values to original todo values
    setEditTitle(todo.title)
    setEditCategoryId(todo.categoryId)
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null)
    setEditLabels(todo.labels || [])
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
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
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
          {isEditing ? (
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleCancel}
                className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <CategorySelect
              value={editCategoryId}
              onChange={categoryId => setEditCategoryId(categoryId)}
              categories={categories}
            />
            <DatePicker
              selected={editDueDate}
              onChange={date => setEditDueDate(date)}
              className="rounded-lg border p-2"
            />
            <LabelPicker selectedLabels={editLabels} onChange={labels => setEditLabels(labels)} />
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
