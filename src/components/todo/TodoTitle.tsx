import { useRef, useEffect } from 'react'
import { Todo } from '@/types/todo'

interface TodoTitleProps {
  todo: Todo
  isEditing: boolean
  editTitle: string
  setEditTitle: (title: string) => void
  onSave: () => void
  onCancel: () => void
  onStartEdit: () => void
}

export function TodoTitle({
  todo,
  isEditing,
  editTitle,
  setEditTitle,
  onSave,
  onCancel,
  onStartEdit,
}: TodoTitleProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditing])

  if (isEditing) {
    return (
      <input
        ref={titleInputRef}
        autoFocus
        value={editTitle}
        onChange={e => setEditTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && editTitle.trim()) onSave()
          if (e.key === 'Escape') onCancel()
        }}
        onBlur={() => {
          // Save on blur if title is not empty
          if (editTitle.trim()) onSave()
          else onCancel()
        }}
        className="w-full rounded-lg border-gray-300 p-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Task title"
      />
    )
  }

  return (
    <div className="flex gap-2">
      {todo.isImportant && (
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
        className={`text-base cursor-pointer ${
          todo.status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'
        }`}
        onDoubleClick={onStartEdit}
        title="Double-click to edit title"
      >
        {todo.title}
      </span>
    </div>
  )
}
