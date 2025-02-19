'use client'

import { Category } from '@/types/category'
import { useState, useEffect, useRef } from 'react'

interface Props {
  categories: Category[]
  selectedCategory?: string
  onSelectCategory: (id?: string) => void
  onUpdateCategory: (id: string, name: string) => void
  onDeleteCategory: (id: string) => void
  onAddCategory: (name: string) => void
  onReorderCategories: (categories: Category[]) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddCategory,
  onReorderCategories,
}: Props) {
  const [editingId, setEditingId] = useState<string>()
  const [newCategory, setNewCategory] = useState('')
  const [editingName, setEditingName] = useState<Record<string, string>>({})
  const [draggedItem, setDraggedItem] = useState<Category | null>(null)
  const [localCategories, setLocalCategories] = useState<Category[]>([])

  // References for drag and drop
  const dragNodeRef = useRef<HTMLDivElement | null>(null)
  const dragOverItemRef = useRef<string | null>(null)

  // Initialize editing names and local categories when categories change
  useEffect(() => {
    const names: Record<string, string> = {}
    categories.forEach(cat => {
      names[cat.id] = cat.name
    })
    setEditingName(names)
    setLocalCategories(categories)
  }, [categories])

  const handleAddCategory = () => {
    if (categories.length >= 5 || !newCategory.trim()) return
    onAddCategory(newCategory)
    setNewCategory('')
  }

  const handleCategorySelect = (id?: string) => {
    onSelectCategory(id)
  }

  const handleUpdateCategory = (id: string, name: string) => {
    setEditingName(prev => ({ ...prev, [id]: name }))
  }

  const handleSaveCategory = (id: string) => {
    onUpdateCategory(id, editingName[id])
    setEditingId(undefined)
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, category: Category) => {
    dragNodeRef.current = e.currentTarget
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', category.id)

    // Add a slight delay to make the drag visual effect work better
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.classList.add('category-dragging')
      }
      setDraggedItem(category)
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    dragOverItemRef.current = categoryId

    // Highlight drop target
    const dropTarget = e.currentTarget
    dropTarget.classList.add('category-drag-over')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('category-drag-over')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('category-drag-over')

    if (!draggedItem || !dragOverItemRef.current) return

    const draggedId = draggedItem.id
    const dropId = dragOverItemRef.current

    if (draggedId === dropId) return

    // Reorder categories
    const reordered = [...localCategories]
    const dragIndex = reordered.findIndex(item => item.id === draggedId)
    const dropIndex = reordered.findIndex(item => item.id === dropId)

    if (dragIndex < 0 || dropIndex < 0) return

    // Remove dragged item
    const [removed] = reordered.splice(dragIndex, 1)
    // Insert at new position
    reordered.splice(dropIndex, 0, removed)

    // Update positions
    const updatedCategories = reordered.map((cat, index) => ({
      ...cat,
      position: index,
    }))

    setLocalCategories(updatedCategories)
    onReorderCategories(updatedCategories)

    // Reset drag state
    setDraggedItem(null)
    dragOverItemRef.current = null
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove('category-dragging')
    }
  }

  const handleDragEnd = () => {
    // Clean up any CSS classes or refs
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove('category-dragging')
    }
    setDraggedItem(null)
    dragOverItemRef.current = null
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

        {/* Display categories with drag and drop */}
        {localCategories.map(category => (
          <div
            key={category.id}
            className="group relative transition-all category-item"
            draggable={editingId !== category.id}
            onDragStart={e => handleDragStart(e, category)}
            onDragOver={e => handleDragOver(e, category.id)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          >
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
                <div className="flex items-center">
                  {/* Drag handle */}
                  <span
                    className="mr-2 opacity-0 group-hover:opacity-100 drag-handle"
                    title="Drag to reorder"
                  >
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
                    >
                      <circle cx="8" cy="8" r="1"></circle>
                      <circle cx="8" cy="16" r="1"></circle>
                      <circle cx="16" cy="8" r="1"></circle>
                      <circle cx="16" cy="16" r="1"></circle>
                    </svg>
                  </span>
                  <span className="block w-full truncate pr-16 font-medium">{category.name}</span>
                </div>

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
