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
    // Don't reset category - keep it set to the current selected category
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading todos...</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            className="flex-1 rounded-lg border p-2 text-gray-900 placeholder:text-gray-500"
            placeholder="What's the next concrete step?"
          />
          <CategorySelect
            categories={categories}
            value={newTodoCategory}
            onChange={categoryId => {
              setNewTodoCategory(categoryId)
            }}
          />
          <DatePicker selected={dueDate} onChange={setDueDate} className="rounded-lg border p-2" />
          <button onClick={handleAddTodo} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
            Add
          </button>
        </div>
        <LabelPicker selectedLabels={newTodoLabels} onChange={setNewTodoLabels} />
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setFilter('ALL')}
          className={`${filter === 'ALL' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`${filter === 'ACTIVE' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`${filter === 'COMPLETED' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          {selectedCategory
            ? 'No todos in this category yet. Add one to get started!'
            : 'Your inbox is empty. Add a task to get started!'}
        </div>
      ) : (
        filteredTodos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            labels={labels}
            categories={categories}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))
      )}
    </div>
  )
}
