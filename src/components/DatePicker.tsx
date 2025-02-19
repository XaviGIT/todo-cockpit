'use client'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  selected: Date | null
  onChange: (date: Date | null) => void
  className?: string
}

export function DatePicker({ selected, onChange, className = '' }: Props) {
  return (
    <div className="relative">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MMM d, yyyy"
        className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${className}`}
        placeholderText="Select due date"
        popperClassName="react-datepicker-popper"
        wrapperClassName="w-full"
        showPopperArrow={false}
        isClearable
      />
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {/* Add custom styling for datepicker */}
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .react-datepicker-popper {
          z-index: 40;
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding-top: 0.75rem;
        }
        .react-datepicker__current-month {
          font-weight: 600;
          color: #111827;
        }
        .react-datepicker__day-name {
          color: #4b5563;
          font-weight: 500;
        }
        .react-datepicker__day--selected {
          background-color: #3b82f6;
          border-radius: 0.25rem;
        }
        .react-datepicker__day:hover {
          background-color: #dbeafe;
          border-radius: 0.25rem;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #bfdbfe;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  )
}
