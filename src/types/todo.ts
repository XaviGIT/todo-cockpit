export interface Todo {
  id: string
  title: string
  dueDate?: Date
  isImportant: boolean
  status: 'INBOX' | 'TODO' | 'DONE'
  categoryId?: string
  labels: string[]
}
