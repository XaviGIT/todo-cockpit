'use client'

import { Category } from '@/types/category'
import { useState } from 'react'

interface Props {
  categories: Category[]
  selectedCategory?: string
  onSelectCategory: (id?: string) => void
  onUpdateCategory: (id: string, name: string) => void
  onDeleteCategory: (id: string) => void
  onAddCategory: (name: string) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddCategory,
}: Props) {
  const [editingId, setEditingId] = useState<string>()
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    if (categories.length >= 5 || !newCategory.trim()) return
    onAddCategory(newCategory)
    setNewCategory('')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div
          onClick={() => onSelectCategory(undefined)}
          className={`cursor-pointer rounded-lg p-2 ${
            !selectedCategory ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Inbox
        </div>
        {categories.map(category => (
          <div key={category.id} className="flex items-center justify-between">
            {editingId === category.id ? (
              <input
                autoFocus
                value={category.name}
                onChange={e => onUpdateCategory(category.id, e.target.value)}
                onBlur={() => setEditingId(undefined)}
                className="flex-1 rounded-lg border p-2 text-gray-900 placeholder:text-gray-500"
              />
            ) : (
              <div
                onClick={() => onSelectCategory(category.id)}
                className={`flex-1 cursor-pointer rounded-lg p-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setEditingId(category.id)}>✏️</button>
              <button onClick={() => onDeleteCategory(category.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {categories.length < 5 && (
        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1 rounded-lg border p-2 text-gray-900 placeholder:text-gray-500"
          />
          <button
            onClick={handleAddCategory}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
