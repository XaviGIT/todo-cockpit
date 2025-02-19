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
    <div className="flex flex-col space-y-5 rounded-xl bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <div
          onClick={() => handleCategorySelect(undefined)}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 transition-colors ${
            !selectedCategory
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M22 12h-6l-2 3h-4l-2-3H2" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <span className="font-medium">Inbox</span>
        </div>

        {categories.map(category => (
          <div key={category.id} className="group relative">
            {editingId === category.id ? (
              <div className="relative rounded-lg border border-blue-200 bg-white shadow-sm">
                <input
                  autoFocus
                  value={editingName[category.id] || category.name}
                  onChange={e => handleUpdateCategory(category.id, e.target.value)}
                  onBlur={() => handleSaveCategory(category.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveCategory(category.id)
                    if (e.key === 'Escape') setEditingId(undefined)
                  }}
                  className="w-full rounded-lg bg-transparent py-3 pl-4 pr-20 text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  <button
                    onClick={() => setEditingId(undefined)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Cancel"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSaveCategory(category.id)}
                    className="rounded-md p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    title="Save"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleCategorySelect(category.id)}
                className={`relative cursor-pointer rounded-lg px-4 py-3 transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block w-full truncate pr-16 font-medium">{category.name}</span>

                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setEditingId(category.id)
                    }}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onDeleteCategory(category.id)
                    }}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length < 5 && (
        <div className="mt-auto pt-2">
          <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm">
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="New category"
              className="w-full rounded-lg bg-transparent py-2 pl-3 pr-12 text-gray-800 placeholder:text-gray-400 focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && newCategory.trim()) handleAddCategory()
              }}
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || categories.length >= 5}
              className={`absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 ${
                !newCategory.trim() || categories.length >= 5
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title="Add category"
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
            </button>
          </div>
          {categories.length === 4 && (
            <p className="mt-2 text-xs text-amber-600">
              You can add up to 5 categories. This will be your last one.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
