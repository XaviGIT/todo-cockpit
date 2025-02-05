'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  position: number
}

interface Props {
  selectedCategory?: string
  onSelectCategory: (id?: string) => void
}

export default function CategoryList({ selectedCategory, onSelectCategory }: Props) {
   const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Work', position: 0 },
    { id: '2', name: 'Personal', position: 1 },
    { id: '3', name: 'Shopping', position: 2 },
    { id: '4', name: 'Health', position: 3 },
    { id: '5', name: 'Projects', position: 4 },
  ])

  return (
    <div className="space-y-1">
      <div
        onClick={() => onSelectCategory(undefined)}
        className={`cursor-pointer rounded-lg p-2 ${
          !selectedCategory ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        Inbox
      </div>
      {categories.map(category => (
        <div
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`cursor-pointer rounded-lg p-2 ${
            selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  )
}