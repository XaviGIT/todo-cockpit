'use client'

import { useState } from 'react'
import TodoList from '@/components/TodoList'
import CategoryList from '@/components/CategoryList'
import { useCategories, useCategoryMutations } from '@/app/hooks/api'
import { Category } from '@/types/category'

export default function Home() {
  const { data: categories = [] } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const { addCategory, updateCategory, deleteCategory } = useCategoryMutations()

  const handleAddCategory = (name: string) => {
    addCategory.mutate(name)
  }

  const handleUpdateCategory = (id: string, name: string) => {
    updateCategory.mutate({ id, name })
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id)
  }

  // Debug the selected category
  console.log('Selected category:', selectedCategory)
  console.log('Available categories:', categories)

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl gap-8 p-8">
      <div className="w-64 shrink-0">
        <h2 className="mb-4 text-xl font-bold">Categories</h2>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
        />
      </div>
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-bold">
          {selectedCategory
            ? categories.find((c: Category) => c.id === selectedCategory)?.name ||
              'Selected Category'
            : 'Inbox'}
        </h1>
        <TodoList
          key={selectedCategory} // Force re-render when category changes
          categories={categories}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  )
}
