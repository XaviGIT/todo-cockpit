import { Todo } from '@/types/todo'
import { Category } from '@/types/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useTodos(categoryId?: string | null) {
  return useQuery({
    queryKey: ['todos', categoryId],
    queryFn: () => {
      // If categoryId is null, we want ALL todos
      if (categoryId === null) {
        return fetch('/api/todos/all').then(res => res.json())
      }

      // When categoryId is undefined (Inbox view), explicitly pass empty string
      const queryParam = categoryId === undefined ? '' : categoryId
      return fetch(`/api/todos?categoryId=${queryParam}`).then(res => res.json())
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  })
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error('Failed to create category')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error('Failed to update category')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete category')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const reorderCategories = useMutation({
    mutationFn: async (categories: Category[]) => {
      const response = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      })
      if (!response.ok) throw new Error('Failed to reorder categories')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return { addCategory, updateCategory, deleteCategory, reorderCategories }
}

export function useTodoMutations() {
  const queryClient = useQueryClient()

  const addTodo = useMutation<Todo, unknown, Partial<Todo>>({
    mutationFn: async todo => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      })
      if (!response.ok) throw new Error('Failed to create todo')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const updateTodo = useMutation<Todo, unknown, { id: string } & Partial<Todo>>({
    mutationFn: async ({ id, ...data }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update todo')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const deleteTodo = useMutation<void, unknown, string>({
    mutationFn: async id => {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete todo')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return { addTodo, updateTodo, deleteTodo }
}
