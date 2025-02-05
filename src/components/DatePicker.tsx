'use client'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  selected: Date | null
  onChange: (date: Date | null) => void
  className?: string
}

export function DatePicker({ selected, onChange, className }: Props) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="MMM d, yyyy"
      className={className}
      placeholderText="Due date"
    />
  )
}