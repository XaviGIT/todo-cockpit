'use client'

import TodoList from '@/components/TodoList'
import CategoryList from '@/components/CategoryList'
import TodoStatistics from '@/components/TodoStatistics'
import { useCategories, useCategoryMutations } from '@/app/hooks/api'
import { Category } from '@/types/category'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'

export default function Home() {
  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useLocalStorage<string | undefined>(
    'selectedCategory',
    undefined
  )

  const { addCategory, updateCategory, deleteCategory, reorderCategories } = useCategoryMutations()

  const handleAddCategory = (name: string) => {
    addCategory.mutate(name)
  }

  const handleUpdateCategory = (id: string, name: string) => {
    updateCategory.mutate({ id, name })
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id)
    // If the deleted category was selected, return to inbox
    if (selectedCategory === id) {
      setSelectedCategory(undefined)
    }
  }

  const handleReorderCategories = (reorderedCategories: Category[]) => {
    reorderCategories.mutate(reorderedCategories)
  }

  // Get the selected category name
  const selectedCategoryName = selectedCategory
    ? categories.find((c: Category) => c.id === selectedCategory)?.name
    : undefined

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="cockpit.png" alt="ToDo Cockpit" className="w-14 rounded-full" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">ToDo Cockpit</h1>
          </div>

          <div className="text-sm text-gray-500">
            {loadingCategories ? 'Loading...' : `${categories.length}/5 categories`}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-72">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <div className="text-xs text-gray-500">
                  {categories.length > 1 ? 'Drag to reorder' : ''}
                </div>
              </div>
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddCategory={handleAddCategory}
                onReorderCategories={handleReorderCategories}
              />
            </div>

            {/* Main content area */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategoryName : 'Inbox'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCategory ? 'Tasks in this category' : 'Uncategorized tasks'}
                </p>
              </div>

              {/* Statistics Dashboard */}
              <TodoStatistics selectedCategory={selectedCategory} />

              <TodoList
                key={selectedCategory}
                categories={categories}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          ToDo Cockpit &copy; {new Date().getFullYear()} • Your productivity companion
        </div>
      </footer>
    </div>
  )
}
