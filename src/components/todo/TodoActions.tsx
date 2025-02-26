import { Todo } from '@/types/todo'

interface TodoActionsProps {
  todo: Todo
  isEditing: boolean
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  onStartEdit: () => void
  onStartFullEdit: () => void
  onSave: () => void
  onCancel: () => void
  editTitle: string
}

export function TodoActions({
  todo,
  isEditing,
  onUpdate,
  onDelete,
  onStartEdit,
  onStartFullEdit,
  onSave,
  onCancel,
  editTitle,
}: TodoActionsProps) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Cancel"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={onSave}
          disabled={!editTitle.trim()}
          className={`rounded p-1.5 ${
            !editTitle.trim()
              ? 'cursor-not-allowed text-gray-300'
              : 'text-green-500 hover:bg-green-50'
          }`}
          title="Save"
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
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    )
  }

  return (
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
        onClick={onStartEdit}
        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Edit title (or double-click on title)"
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
        onClick={onStartFullEdit}
        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Full edit (change category, due date, labels)"
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
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
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
  )
}
