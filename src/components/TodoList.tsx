'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { DatePicker } from './DatePicker'
import { Label } from '@/types/label'
import { LabelPicker } from './LabelPicker'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [labels] = useState<Label[]>([
    { id: '1', name: 'Work', color: '#ef4444' },
    { id: '2', name: 'Personal', color: '#3b82f6' },
    { id: '3', name: 'Urgent', color: '#f97316' },
    ])
   const [newTodoLabels, setNewTodoLabels] = useState<string[]>([])


  const addTodo = () => {
    if (!newTodoTitle.trim()) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTodoTitle,
      dueDate: dueDate ?? undefined,
      isImportant: false,
      status: 'INBOX',
      labels: newTodoLabels
    }

    setTodos(prev => [...prev, newTodo])
    setNewTodoTitle('')
    setDueDate(null)
    setNewTodoLabels([])
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            className="flex-1 rounded-lg border p-2"
            placeholder="Add new todo..."
          />
          <DatePicker
            selected={dueDate}
            onChange={setDueDate}
            className="rounded-lg border p-2"
          />
          <button onClick={addTodo} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
            Add
          </button>
        </div>
        <LabelPicker selectedLabels={newTodoLabels} onChange={setNewTodoLabels} />
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} labels={labels} onUpdate={updateTodo} />
        ))}
      </div>
    </div>
  )
}