import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Move initialization to useEffect
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        try {
          setStoredValue(JSON.parse(item))
        } catch (parseError) {
          console.error('Error parsing stored value:', parseError)
          // If parsing fails, use the initial value
          setStoredValue(initialValue)
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error setting localStorage value:', error)
    }
  }

  return [storedValue, setValue] as const
}
