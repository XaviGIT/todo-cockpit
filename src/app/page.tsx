'use client'

import CategoryList from '@/components/CategoryList'
import TodoList from '@/components/TodoList'
import { Category } from '@/types/category'
import { useState } from 'react'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Work', position: 0 },
    { id: '2', name: 'Personal', position: 1 },
    { id: '3', name: 'Shopping', position: 2 },
    { id: '4', name: 'Health', position: 3 },
    { id: '5', name: 'Projects', position: 4 },
  ])
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const handleUpdateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, name } : cat)))
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
    if (selectedCategory === id) setSelectedCategory(undefined)
  }

  const handleAddCategory = (name: string) => {
    setCategories(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        position: prev.length,
      },
    ])
  }

  return (
    <div className="grid grid-cols-4 gap-6 py-6">
      <div className="col-span-1">
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
        />
      </div>
      <div className="col-span-3">
        <TodoList categories={categories} selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
