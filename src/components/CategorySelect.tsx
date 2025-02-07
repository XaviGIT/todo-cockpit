import { Category } from '@/types/category'

interface Props {
  value?: string
  onChange: (categoryId?: string) => void
  categories: Category[]
}

export function CategorySelect({ value, onChange, categories }: Props) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value || undefined)}
      className="rounded-lg border p-2 text-gray-500 placeholder:text-gray-500"
    >
      <option value="">No Category</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}
