import { Category } from '@/types/category'

interface Props {
  value?: string
  onChange: (categoryId?: string) => void
  categories: Category[]
}

export function CategorySelect({ value, onChange, categories }: Props) {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || undefined)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-gray-800 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="">No Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
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
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  )
}
