'use client'

import CategoryList from '@/components/CategoryList'
import TodoList from '@/components/TodoList'
import { Category } from '@/types/category'
import { useState } from 'react'

export default function Home() {
  const [categories] = useState<Category[]>([
    { id: '1', name: 'Work', position: 0 },
    { id: '2', name: 'Personal', position: 1 },
    { id: '3', name: 'Shopping', position: 2 },
    { id: '4', name: 'Health', position: 3 },
    { id: '5', name: 'Projects', position: 4 },
  ])
  const [selectedCategory, setSelectedCategory] = useState<string>()

  return (
    <div className="grid grid-cols-4 gap-6 py-6">
      <div className="col-span-1">
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="col-span-3">
        <TodoList categories={categories} selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
