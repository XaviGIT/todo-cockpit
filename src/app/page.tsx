'use client'

import CategoryList from "@/components/CategoryList"
import TodoList from "@/components/TodoList"
import { useState } from "react"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>()

  return (
    <div className="grid grid-cols-4 gap-6 py-6">
      <div className="col-span-1">
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="col-span-3">
        <TodoList selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}