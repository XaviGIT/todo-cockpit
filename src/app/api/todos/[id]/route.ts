import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const updates = await request.json()

    // Convert the date string to a Date object if present
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate)
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Failed to update todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    await prisma.todo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
