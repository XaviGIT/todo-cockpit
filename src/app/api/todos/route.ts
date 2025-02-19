import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    let whereClause = {}

    // If categoryId is an empty string, we're in the Inbox view and should show only uncategorized todos
    if (categoryId === '') {
      whereClause = { categoryId: null }
    }
    // If categoryId has a value, show todos from that specific category
    else if (categoryId) {
      whereClause = { categoryId }
    }
    // If categoryId is not provided at all, show all todos (this case shouldn't happen in your app)

    const todos = await prisma.todo.findMany({
      where: whereClause,
      orderBy: [
        { status: 'asc' },
        { isImportant: 'desc' },
        { dueDate: 'asc' },
        { updatedAt: 'desc' },
      ],
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const todoData = await request.json()

    if (!todoData.title || typeof todoData.title !== 'string') {
      return NextResponse.json({ error: 'Invalid todo title' }, { status: 400 })
    }

    // Generate a unique ID
    const id = uuidv4()

    // Explicitly convert undefined categoryId to null for the database
    let categoryIdForDb = todoData.categoryId
    if (categoryIdForDb === undefined || categoryIdForDb === '') {
      categoryIdForDb = null
    }

    const newTodo = await prisma.todo.create({
      data: {
        id,
        title: todoData.title,
        dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
        isImportant: todoData.isImportant ?? false,
        status: todoData.status || 'INBOX',
        categoryId: categoryIdForDb,
        labels: todoData.labels || [],
      },
    })

    return NextResponse.json(newTodo)
  } catch (error) {
    console.error('Failed to create todo:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}
