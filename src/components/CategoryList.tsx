'use client'

import { Category } from '@/types/category'
import { useState, useEffect } from 'react'

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
  const [editingName, setEditingName] = useState<Record<string, string>>({})

  // Initialize editing names when categories change
  useEffect(() => {
    const names: Record<string, string> = {}
    categories.forEach(cat => {
      names[cat.id] = cat.name
    })
    setEditingName(names)
  }, [categories])

  const handleAddCategory = () => {
    if (categories.length >= 5 || !newCategory.trim()) return
    onAddCategory(newCategory)
    setNewCategory('')
  }

  const handleCategorySelect = (id?: string) => {
    console.log('Selecting category:', id)
    onSelectCategory(id)
  }

  const handleUpdateCategory = (id: string, name: string) => {
    setEditingName(prev => ({ ...prev, [id]: name }))
  }

  const handleSaveCategory = (id: string) => {
    onUpdateCategory(id, editingName[id])
    setEditingId(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div
          onClick={() => handleCategorySelect(undefined)}
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
                value={editingName[category.id] || category.name}
                onChange={e => handleUpdateCategory(category.id, e.target.value)}
                onBlur={() => handleSaveCategory(category.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveCategory(category.id)
                  if (e.key === 'Escape') setEditingId(undefined)
                }}
                className="flex-1 rounded-lg border p-2 text-gray-900 placeholder:text-gray-500"
              />
            ) : (
              <div
                onClick={() => handleCategorySelect(category.id)}
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
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddCategory()
            }}
          />
          <button
            onClick={handleAddCategory}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            disabled={!newCategory.trim() || categories.length >= 5}
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
