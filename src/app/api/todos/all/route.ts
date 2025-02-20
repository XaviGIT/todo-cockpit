import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all todos regardless of category
    const todos = await prisma.todo.findMany({
      orderBy: [
        { status: 'asc' },
        { isImportant: 'desc' },
        { dueDate: 'asc' },
        { updatedAt: 'desc' },
      ],
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to fetch all todos:', error)
    return NextResponse.json({ error: 'Failed to fetch all todos' }, { status: 500 })
  }
}
