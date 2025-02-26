'use client'

import { useState, useRef, useMemo } from 'react'
import { Todo } from '@/types/todo'
import { TodoItem } from './todo/TodoItem'
import { DatePicker } from './DatePicker'
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
  // Set 'ACTIVE' as the default filter
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE')
  const [showAddForm, setShowAddForm] = useState(false)

  // State for drag and drop reordering
  const draggedTodoRef = useRef<Todo | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)
  const dragOverItemRef = useRef<string | null>(null)

  const { addTodo, updateTodo, deleteTodo, reorderTodos } = useTodoMutations()

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return

    addTodo.mutate({
      title: newTodoTitle,
      dueDate: dueDate ?? undefined,
      isImportant: false,
      status: 'INBOX',
      labels: newTodoLabels,
      categoryId: newTodoCategory,
      position: 0, // New todos go at the top
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

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    // Filter todos based on the current filter
    const filtered = todos.filter((todo: Todo) => {
      if (filter === 'ALL') return true
      if (filter === 'ACTIVE') return todo.status !== 'DONE'
      if (filter === 'COMPLETED') return todo.status === 'DONE'
      return true
    })

    // Organize todos - important first, then by status, then by position
    return [...filtered].sort((a, b) => {
      // First sort by status (active before completed)
      if (a.status !== b.status) {
        return a.status === 'DONE' ? 1 : -1
      }

      // Then by importance
      if (a.isImportant !== b.isImportant) {
        return a.isImportant ? -1 : 1
      }

      // Then by custom order (if exists)
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position
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
  }, [todos, filter])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, todo: Todo) => {
    dragNodeRef.current = e.currentTarget
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', todo.id)

    // Add a slight delay for better visual effect
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.classList.add('todo-dragging')
      }
      draggedTodoRef.current = todo
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, todoId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    dragOverItemRef.current = todoId

    // Add visual feedback
    const dropTarget = e.currentTarget
    dropTarget.classList.add('todo-drag-over')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('todo-drag-over')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('todo-drag-over')

    if (!draggedTodoRef.current || !dragOverItemRef.current) return

    const draggedId = draggedTodoRef.current.id
    const dropId = dragOverItemRef.current

    if (draggedId === dropId) return

    // Only allow reordering within same status and category
    const draggedTodoItem = todos.find((t: Todo) => t.id === draggedId)
    const dropTodoItem = todos.find((t: Todo) => t.id === dropId)

    if (!draggedTodoItem || !dropTodoItem) return

    // Don't reorder across different statuses or categories
    if (
      draggedTodoItem.status !== dropTodoItem.status ||
      draggedTodoItem.categoryId !== dropTodoItem.categoryId
    ) {
      return
    }

    // Find all todos in the same category and status
    const sameCategoryAndStatus = todos.filter(
      (t: Todo) =>
        t.categoryId === draggedTodoItem.categoryId && t.status === draggedTodoItem.status
    )

    // Create a copy for reordering
    const reorderedGroup = [...sameCategoryAndStatus]

    // Find indices
    const dragIndex = reorderedGroup.findIndex((t: Todo) => t.id === draggedId)
    const dropIndex = reorderedGroup.findIndex((t: Todo) => t.id === dropId)

    if (dragIndex < 0 || dropIndex < 0) return

    // Reorder the array (move dragged item to new position)
    const [removed] = reorderedGroup.splice(dragIndex, 1)
    reorderedGroup.splice(dropIndex, 0, removed)

    // Update positions
    const todosToUpdate = reorderedGroup.map((todo, index) => ({
      ...todo,
      position: index,
    }))

    // Send update to server
    reorderTodos.mutate(todosToUpdate)

    // Reset drag state
    draggedTodoRef.current = null
    dragOverItemRef.current = null
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove('todo-dragging')
    }
  }

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove('todo-dragging')
    }
    draggedTodoRef.current = null
    dragOverItemRef.current = null
  }

  // Update category when it changes
  if (newTodoCategory !== selectedCategory) {
    setNewTodoCategory(selectedCategory)
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

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {filteredAndSortedTodos.length} {filteredAndSortedTodos.length === 1 ? 'task' : 'tasks'}
          </div>

          {/* Only show reordering hint when there are multiple active todos */}
          {filteredAndSortedTodos.filter(todo => todo.status !== 'DONE').length > 1 && (
            <div className="text-xs text-gray-500 hidden sm:block">
              <span className="flex items-center">
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
                  className="mr-1"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                Drag to reorder
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredAndSortedTodos.length === 0 ? (
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
            {filter === 'ACTIVE'
              ? 'No active tasks'
              : filter === 'COMPLETED'
                ? 'No completed tasks'
                : selectedCategory
                  ? 'No tasks in this category yet'
                  : 'Your inbox is empty'}
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
          {filteredAndSortedTodos.map(todo => (
            <div
              key={todo.id}
              className={`todo-item relative ${todo.status === 'DONE' ? '' : 'draggable-todo'}`}
              draggable={todo.status !== 'DONE'}
              onDragStart={todo.status !== 'DONE' ? e => handleDragStart(e, todo) : undefined}
              onDragOver={e => handleDragOver(e, todo.id)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            >
              <TodoItem
                todo={todo}
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
