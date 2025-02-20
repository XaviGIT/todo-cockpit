import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Todo } from '@/types/todo'

export async function POST(request: NextRequest) {
  try {
    const { todos } = await request.json()

    if (!Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json({ error: 'Invalid todos data' }, { status: 400 })
    }

    // Validate that all todos have required fields
    const validTodos = todos.every(
      (todo: Todo) =>
        typeof todo.id === 'string' &&
        typeof todo.position === 'number' &&
        (todo.status === 'INBOX' || todo.status === 'TODO' || todo.status === 'DONE')
    )

    if (!validTodos) {
      return NextResponse.json(
        { error: 'Invalid todo format - each todo must have an id, position, and status' },
        { status: 400 }
      )
    }

    // Group todos by categoryId to maintain order within categories
    const todosByCategory: Record<string, Todo[]> = {}
    todos.forEach((todo: Todo) => {
      const categoryKey = todo.categoryId || 'uncategorized'
      if (!todosByCategory[categoryKey]) {
        todosByCategory[categoryKey] = []
      }
      todosByCategory[categoryKey].push(todo)
    })

    // Perform updates in a transaction to ensure consistency
    await prisma.$transaction(async tx => {
      // First validate that all todos exist
      const todoIds = todos.map((todo: Todo) => todo.id)
      const existingTodos = await tx.todo.findMany({
        where: { id: { in: todoIds } },
      })

      if (existingTodos.length !== todos.length) {
        throw new Error('One or more todos not found')
      }

      // Update positions one by one
      for (const todo of todos) {
        await tx.todo.update({
          where: { id: todo.id },
          data: { position: todo.position },
        })
      }
    })

    // Return updated todos, properly ordered
    const updatedTodos = await prisma.todo.findMany({
      where: { id: { in: todos.map(t => t.id) } },
      orderBy: [{ categoryId: 'asc' }, { status: 'asc' }, { position: 'asc' }],
    })

    return NextResponse.json(updatedTodos)
  } catch (error) {
    console.error('Failed to reorder todos:', error)

    // Provide more specific error messages based on error type
    if (error instanceof Error && error.message === 'One or more todos not found') {
      return NextResponse.json({ error: 'One or more todos could not be found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 })
  }
}
