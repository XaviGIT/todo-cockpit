import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'
import { Category } from '@/types/category'
import { Label } from '@/types/label'
import { Todo } from '@/types/todo'

interface TodoMetadataProps {
  todo: Todo
  categories: Category[]
  labels: Label[]
  loadingLabels: boolean
}

export function TodoMetadata({ todo, categories, labels, loadingLabels }: TodoMetadataProps) {
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
        <div className={`flex items-center gap-1 ${getDueDateColor(new Date(todo.dueDate))}`}>
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
            const label = labels.find(l => l.id === labelId)
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
  )
}
