'use client'

interface Props {
  view: 'categories' | 'important'
  onViewChange: (view: 'categories' | 'important') => void
}

export function ViewToggle({ view, onViewChange }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex shadow-sm">
      <button
        onClick={() => onViewChange('categories')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          view === 'categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
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
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Categories</span>
        </div>
      </button>
      <button
        onClick={() => onViewChange('important')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          view === 'important' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={view === 'important' ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Important</span>
        </div>
      </button>
    </div>
  )
}
