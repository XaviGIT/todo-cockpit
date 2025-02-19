import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize with initialValue and try to get from localStorage
  useEffect(() => {
    // Check if we're in a browser environment with localStorage
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Get from localStorage
      const item = window.localStorage.getItem(key)

      // If item doesn't exist, use initialValue
      if (item === null) {
        // Still in the initializing phase, don't need to set anything
        return
      }

      try {
        // Parse stored json
        setStoredValue(JSON.parse(item))
      } catch (parseError) {
        console.warn(`Failed to parse localStorage item "${key}":`, parseError)
        // If parsing fails, use initialValue and update localStorage
        window.localStorage.setItem(key, JSON.stringify(initialValue))
      }
    } catch (error) {
      // If error accessing localStorage, use initialValue
      console.warn(`Error accessing localStorage for key "${key}":`, error)
    }
  }, [key, initialValue]) // Only re-run if key or initialValue changes

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function to match useState API
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error saving to localStorage for key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
