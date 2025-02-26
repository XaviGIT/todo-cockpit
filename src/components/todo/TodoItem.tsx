import { useState, useEffect } from 'react'
import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { useLabels } from '@/app/hooks/api'
import { TodoCheckbox } from './TodoCheckbox'
import { TodoTitle } from './TodoTitle'
import { TodoMetadata } from './TodoMetadata'
import { TodoActions } from './TodoActions'
import { TodoEditForm } from './TodoEditForm'

interface TodoItemProps {
  todo: Todo
  categories: Category[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, categories, onUpdate, onDelete }: TodoItemProps) {
  // State management
  const [isEditing, setIsEditing] = useState(false)
  const [isFullEditing, setIsFullEditing] = useState(false)
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
  }, [todo, isEditing, isFullEditing])

  // Handle quick title edit
  const handleStartEdit = () => {
    setIsEditing(true)
    setIsFullEditing(false)
    setEditTitle(todo.title)
  }

  // Handle full edit mode
  const handleStartFullEdit = () => {
    setIsFullEditing(true)
    setIsEditing(false)
  }

  // Handle save for both quick edits and full edits
  const handleSave = () => {
    if (!editTitle.trim()) return

    if (isEditing) {
      // Only update the title
      onUpdate(todo.id, { title: editTitle })
      setIsEditing(false)
    } else if (isFullEditing) {
      // Update all edited fields
      onUpdate(todo.id, {
        title: editTitle,
        categoryId: editCategoryId,
        dueDate: editDueDate ?? undefined,
        labels: editLabels,
      })
      setIsFullEditing(false)
    }
  }

  // Handle cancel for both quick edits and full edits
  const handleCancel = () => {
    // Reset form values to original todo values
    setEditTitle(todo.title)
    setEditCategoryId(todo.categoryId)
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null)
    setEditLabels(todo.labels || [])

    setIsEditing(false)
    setIsFullEditing(false)
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault()
      handleStartEdit()
    } else if (e.key === ' ' && e.ctrlKey) {
      e.preventDefault()
      onUpdate(todo.id, { status: todo.status === 'DONE' ? 'TODO' : 'DONE' })
    }
  }

  return (
    <div
      className={`group rounded-xl border ${
        todo.isImportant ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
      } p-4 transition-all ${
        isEditing || isFullEditing ? 'shadow-md' : 'hover:border-gray-300 hover:shadow-sm'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onContextMenu={e => {
        e.preventDefault()
        handleStartEdit()
      }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <TodoCheckbox todo={todo} onUpdate={onUpdate} />

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Title Component */}
              <TodoTitle
                todo={todo}
                isEditing={isEditing}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onSave={handleSave}
                onCancel={handleCancel}
                onStartEdit={handleStartEdit}
              />
            </div>

            {/* Action buttons */}
            <div
              className={`flex items-center gap-2 ${
                !isEditing && !isFullEditing && !isHovering ? 'invisible group-hover:visible' : ''
              }`}
            >
              <TodoActions
                todo={todo}
                isEditing={isEditing}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onStartEdit={handleStartEdit}
                onStartFullEdit={handleStartFullEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editTitle={editTitle}
              />
            </div>
          </div>

          {/* Metadata display (category, due date, labels) */}
          {!isEditing && !isFullEditing && (
            <TodoMetadata
              todo={todo}
              categories={categories}
              labels={labels}
              loadingLabels={loadingLabels}
            />
          )}

          {/* Edit form - only shown in full edit mode */}
          {isFullEditing && (
            <TodoEditForm
              todo={todo}
              categories={categories}
              editTitle={editTitle}
              editCategoryId={editCategoryId}
              editDueDate={editDueDate}
              editLabels={editLabels}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdateCategory={setEditCategoryId}
              onUpdateDueDate={setEditDueDate}
              onUpdateLabels={setEditLabels}
              onUpdateImportant={isImportant => onUpdate(todo.id, { isImportant })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
