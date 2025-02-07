'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { DatePicker } from './DatePicker'
import { Label } from '@/types/label'
import { LabelPicker } from './LabelPicker'
import { CategorySelect } from './CategorySelect'
import { Category } from '@/types/category'

interface Props {
  categories: Category[]
  selectedCategory?: string
}

export default function TodoList({ categories, selectedCategory }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoCategory, setNewTodoCategory] = useState<string | undefined>(undefined)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [labels] = useState<Label[]>([
    { id: '1', name: 'Work', color: '#ef4444' },
    { id: '2', name: 'Personal', color: '#3b82f6' },
    { id: '3', name: 'Urgent', color: '#f97316' },
  ])
  const [newTodoLabels, setNewTodoLabels] = useState<string[]>([])
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL')

  const filteredTodos = todos.filter(todo => {
    // Category filtering
    const categoryMatch = selectedCategory
      ? todo.categoryId === selectedCategory // Show only todos in selected category
      : !todo.categoryId // Show only todos without category in Inbox

    // Status filtering
    const statusMatch =
      filter === 'ALL'
        ? true
        : filter === 'COMPLETED'
          ? todo.status === 'DONE'
          : todo.status !== 'DONE'

    return categoryMatch && statusMatch
  })

  const addTodo = () => {
    if (!newTodoTitle.trim()) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTodoTitle,
      dueDate: dueDate ?? undefined,
      isImportant: false,
      status: 'INBOX',
      labels: newTodoLabels,
      categoryId: newTodoCategory,
    }

    setTodos(prev => [...prev, newTodo])
    setNewTodoTitle('')
    setDueDate(null)
    setNewTodoLabels([])
    setNewTodoCategory(undefined)
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, ...updates } : todo)))
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
          <button onClick={addTodo} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
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

      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} labels={labels} onUpdate={updateTodo} />
      ))}
    </div>
  )
}
