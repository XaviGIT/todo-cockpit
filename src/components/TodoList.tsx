'use client'

import { useState, useEffect } from 'react'
import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { DatePicker } from './DatePicker'
import { Label } from '@/types/label'
import { LabelPicker } from './LabelPicker'
import { CategorySelect } from './CategorySelect'
import { Category } from '@/types/category'
import { useTodoMutations, useTodos } from '@/app/hooks/api'

interface Props {
  categories: Category[]
  selectedCategory?: string
}

export default function TodoList({ categories, selectedCategory }: Props) {
  // Pass selectedCategory to the useTodos hook to filter todos
  const { data: todos = [], isLoading } = useTodos(selectedCategory)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoCategory, setNewTodoCategory] = useState<string | undefined>(selectedCategory)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [newTodoLabels, setNewTodoLabels] = useState<string[]>([])
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)
  const [labels] = useState<Label[]>([
    { id: '1', name: 'Work', color: '#ef4444' },
    { id: '2', name: 'Personal', color: '#3b82f6' },
    { id: '3', name: 'Urgent', color: '#f97316' },
  ])

  const { addTodo, updateTodo, deleteTodo } = useTodoMutations()

  // Update newTodoCategory when selectedCategory changes
  useEffect(() => {
    setNewTodoCategory(selectedCategory)
  }, [selectedCategory])

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return

    addTodo.mutate({
      title: newTodoTitle,
      dueDate: dueDate ?? undefined,
      isImportant: false,
      status: 'INBOX',
      labels: newTodoLabels,
      categoryId: newTodoCategory,
    })

    setNewTodoTitle('')
    setDueDate(null)
    setNewTodoLabels([])
    setShowAddForm(false)
  }

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo.mutate({ id, ...updates })
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo.mutate(id)
  }

  // Filter todos based on the current filter
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'ALL') return true
    if (filter === 'ACTIVE') return todo.status !== 'DONE'
    if (filter === 'COMPLETED') return todo.status === 'DONE'
    return true
  })

  // Organize todos - important first, then by status
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // First sort by status (active before completed)
    if (a.status !== b.status) {
      return a.status === 'DONE' ? 1 : -1
    }

    // Then by importance
    if (a.isImportant !== b.isImportant) {
      return a.isImportant ? -1 : 1
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
          <span>Loading tasks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Add Task Button or Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-gray-500 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span className="font-medium">Add new task</span>
        </button>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-3 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="What needs to be done?"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddTodo()
                if (e.key === 'Escape') setShowAddForm(false)
              }}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <CategorySelect
                  categories={categories}
                  value={newTodoCategory}
                  onChange={categoryId => setNewTodoCategory(categoryId)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Due date</label>
                <DatePicker
                  selected={dueDate}
                  onChange={setDueDate}
                  className="w-full rounded-lg border-gray-300 p-3"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Labels</label>
              <LabelPicker selectedLabels={newTodoLabels} onChange={setNewTodoLabels} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodoTitle.trim()}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  !newTodoTitle.trim()
                    ? 'cursor-not-allowed bg-blue-300'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div className="text-sm text-gray-500">
          {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {/* Task List */}
      {sortedTodos.length === 0 ? (
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
            className="mb-2 text-gray-400"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <p className="text-gray-500">
            {selectedCategory ? 'No tasks in this category yet' : 'Your inbox is empty'}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              labels={labels}
              categories={categories}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
