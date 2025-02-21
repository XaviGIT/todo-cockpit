import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'
import { useState, useEffect } from 'react'
import { Label } from '@/types/label'
import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { LabelPicker } from './LabelPicker'
import { CategorySelect } from './CategorySelect'
import { DatePicker } from './DatePicker'
import { useLabels } from '@/app/hooks/api'

interface Props {
  todo: Todo
  categories: Category[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoItem({
  todo,
  categories,
  onUpdate,
  onDelete,
}: Props & { categories: Category[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editCategoryId, setEditCategoryId] = useState<string | undefined>(todo.categoryId)
  const [editDueDate, setEditDueDate] = useState<Date | null>(
    todo.dueDate ? new Date(todo.dueDate) : null
  )
  const [editLabels, setEditLabels] = useState<string[]>(todo.labels || [])
  const [isHovering, setIsHovering] = useState(false)

  const { data: labels = [], isLoading: loadingLabels } = useLabels()

  // Reset edit state when todo changes or when exiting edit mode
  useEffect(() => {
    setEditTitle(todo.title)
    setEditCategoryId(todo.categoryId)
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null)
    setEditLabels(todo.labels || [])
  }, [todo, isEditing])

  const handleSave = () => {
    if (!editTitle.trim()) return

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

  // Get the category name if it exists
  const categoryName = todo.categoryId
    ? categories.find(c => c.id === todo.categoryId)?.name
    : undefined

  // Format due date with special handling for today/tomorrow and overdue
  const formatDueDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today'
    } else if (isTomorrow(date)) {
      return 'Tomorrow'
    } else if (isPast(date)) {
      return `Overdue: ${format(date, 'MMM d')}`
    } else if (isPast(addDays(new Date(), 7)) && !isPast(date)) {
      // Within the next week
      return format(date, 'EEEE') // Day name
    } else {
      return format(date, 'MMM d, yyyy')
    }
  }

  // Determine due date color
  const getDueDateColor = (date: Date) => {
    if (isPast(date) && todo.status !== 'DONE') {
      return 'text-red-600 font-medium'
    } else if (isToday(date)) {
      return 'text-amber-600 font-medium'
    } else if (isTomorrow(date)) {
      return 'text-amber-500'
    }
    return 'text-gray-500'
  }

  return (
    <div
      className={`group rounded-xl border ${todo.isImportant ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'} p-4 transition-all ${
        isEditing ? 'shadow-md' : 'hover:border-gray-300 hover:shadow-sm'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox with improved styling */}
        <div className="mt-1.5">
          <input
            type="checkbox"
            checked={todo.status === 'DONE'}
            onChange={e => onUpdate(todo.id, { status: e.target.checked ? 'DONE' : 'TODO' })}
            className={`h-5 w-5 rounded-md border-gray-300 ${todo.isImportant ? 'text-amber-600 focus:ring-amber-500' : 'text-blue-600 focus:ring-blue-500'}`}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Task title"
                />
              ) : (
                <div className="flex gap-2">
                  {todo.isImportant && !isEditing && (
                    <span className="text-amber-500 mr-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </span>
                  )}
                  <span
                    className={`text-base ${todo.status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'}`}
                  >
                    {todo.title}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div
              className={`flex items-center gap-2 ${!isEditing && !isHovering ? 'invisible group-hover:visible' : ''}`}
            >
              {!isEditing && (
                <>
                  <button
                    onClick={() => onUpdate(todo.id, { isImportant: !todo.isImportant })}
                    className={`rounded p-1.5 transition-colors ${
                      todo.isImportant
                        ? 'text-amber-500 hover:bg-amber-100'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                    }`}
                    title={todo.isImportant ? 'Remove importance' : 'Mark as important'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={todo.isImportant ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Edit task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Metadata display (category, due date, labels) */}
          {!isEditing && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {categoryName && (
                <div className="flex items-center gap-1 text-gray-500">
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
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>{categoryName}</span>
                </div>
              )}

              {todo.dueDate && (
                <div
                  className={`flex items-center gap-1 ${getDueDateColor(new Date(todo.dueDate))}`}
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
                    className={
                      isPast(new Date(todo.dueDate)) && todo.status !== 'DONE' ? 'text-red-600' : ''
                    }
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{formatDueDate(new Date(todo.dueDate))}</span>
                </div>
              )}

              {todo.labels.length > 0 && !loadingLabels && (
                <div className="flex flex-wrap gap-1.5">
                  {todo.labels.map(labelId => {
                    const label = labels.find((l: Label) => l.id === labelId)
                    return label ? (
                      <span
                        key={label.id}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </span>
                    ) : null
                  })}
                </div>
              )}
            </div>
          )}

          {/* Edit form fields */}
          {isEditing && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <CategorySelect
                  value={editCategoryId}
                  onChange={categoryId => setEditCategoryId(categoryId)}
                  categories={categories}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Due date</label>
                <DatePicker
                  selected={editDueDate}
                  onChange={date => setEditDueDate(date)}
                  className="w-full rounded-lg border-gray-300 p-2 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Labels</label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={todo.isImportant}
                      onChange={e => onUpdate(todo.id, { isImportant: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Mark as important</span>
                  </label>
                </div>
                <LabelPicker
                  selectedLabels={editLabels}
                  onChange={labels => setEditLabels(labels)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    !editTitle.trim()
                      ? 'cursor-not-allowed bg-blue-300'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
