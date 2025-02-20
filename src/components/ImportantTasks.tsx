'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Todo } from '@/types/todo'
import { Label } from '@/types/label'
import { Category } from '@/types/category'
import { useTodoMutations } from '@/app/hooks/api'
import { TodoItem } from './TodoItem'

interface Props {
  categories: Category[]
}

export function ImportantTasks({ categories }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE')
  const { updateTodo, deleteTodo } = useTodoMutations()

  // Fetch ALL todos to filter important ones across categories
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos', 'all'],
    queryFn: () => fetch('/api/todos/all').then(res => res.json()),
  })

  const [labels] = useState<Label[]>([])

  // Filter important todos
  const importantTodos = todos
    .filter((todo: Todo) => todo.isImportant)
    .filter((todo: Todo) => {
      if (filter === 'ALL') return true
      if (filter === 'ACTIVE') return todo.status !== 'DONE'
      if (filter === 'COMPLETED') return todo.status === 'DONE'
      return true
    })

  // Sort by status (active first), then by due date
  const sortedImportantTodos = [...importantTodos].sort((a, b) => {
    // First by status
    if (a.status !== b.status) {
      return a.status === 'DONE' ? 1 : -1
    }

    // Then by due date (if exists)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // Items with due dates come before those without
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1

    return 0
  })

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo.mutate({ id, ...updates })
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading important tasks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              filter === 'ALL' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
            {filter === 'ALL' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              filter === 'ACTIVE' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active
            {filter === 'ACTIVE' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              filter === 'COMPLETED' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed
            {filter === 'COMPLETED' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {sortedImportantTodos.length} important{' '}
            {sortedImportantTodos.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
      </div>

      {/* Important Tasks List */}
      {sortedImportantTodos.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2 text-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <p className="text-gray-500">
            {filter === 'ACTIVE'
              ? 'No active important tasks'
              : filter === 'COMPLETED'
                ? 'No completed important tasks'
                : 'No important tasks found'}
          </p>
          <p className="mt-2 text-sm text-gray-400">Mark tasks as important to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedImportantTodos.map(todo => (
            <div key={todo.id} className="todo-item relative">
              <TodoItem
                todo={todo}
                labels={labels}
                categories={categories}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
