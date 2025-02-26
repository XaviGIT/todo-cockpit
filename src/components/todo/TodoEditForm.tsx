import DatePicker from 'react-datepicker'

import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { CategorySelect } from '../CategorySelect'
import { LabelPicker } from '../LabelPicker'

interface TodoEditFormProps {
  todo: Todo
  categories: Category[]
  editTitle: string
  editCategoryId: string | undefined
  editDueDate: Date | null
  editLabels: string[]
  onSave: () => void
  onCancel: () => void
  onUpdateCategory: (categoryId: string | undefined) => void
  onUpdateDueDate: (date: Date | null) => void
  onUpdateLabels: (labels: string[]) => void
  onUpdateImportant: (isImportant: boolean) => void
}

export function TodoEditForm({
  todo,
  categories,
  editTitle,
  editCategoryId,
  editDueDate,
  editLabels,
  onSave,
  onCancel,
  onUpdateCategory,
  onUpdateDueDate,
  onUpdateLabels,
  onUpdateImportant,
}: TodoEditFormProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <CategorySelect
          value={editCategoryId}
          onChange={onUpdateCategory}
          categories={categories}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Due date</label>
        <DatePicker
          selected={editDueDate}
          onChange={onUpdateDueDate}
          className="w-full rounded-lg border-gray-300 p-2 text-gray-800"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Labels</label>
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={todo.isImportant}
              onChange={e => onUpdateImportant(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span>Mark as important</span>
          </label>
        </div>
        <LabelPicker selectedLabels={editLabels} onChange={onUpdateLabels} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!editTitle.trim()}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            !editTitle.trim() ? 'cursor-not-allowed bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
