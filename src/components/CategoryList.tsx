'use client'

import { Category } from '@/types/category'

interface Props {
  categories: Category[]
  selectedCategory?: string
  onSelectCategory: (id?: string) => void
}

export default function CategoryList({ categories, selectedCategory, onSelectCategory }: Props) {
  return (
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
        <div
          key={category.id}
          onClick={() => onSelectCategory(category.id)} // Add this
          className={`cursor-pointer rounded-lg p-2 ${
            selectedCategory === category.id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  )
}
