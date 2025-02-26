import { Todo } from '@/types/todo'

interface TodoCheckboxProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
}

export function TodoCheckbox({ todo, onUpdate }: TodoCheckboxProps) {
  return (
    <div className="mt-1.5">
      <input
        type="checkbox"
        checked={todo.status === 'DONE'}
        onChange={e => onUpdate(todo.id, { status: e.target.checked ? 'DONE' : 'TODO' })}
        className={`h-5 w-5 rounded-md border-gray-300 ${
          todo.isImportant
            ? 'text-amber-600 focus:ring-amber-500'
            : 'text-blue-600 focus:ring-blue-500'
        }`}
        aria-label={`Mark "${todo.title}" as ${todo.status === 'DONE' ? 'active' : 'complete'}`}
      />
    </div>
  )
}
