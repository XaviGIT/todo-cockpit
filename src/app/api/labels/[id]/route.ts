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
    const { name, color } = await request.json()

    // Validate inputs
    if (name && typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid label name' }, { status: 400 })
    }

    if (color && (typeof color !== 'string' || !color.match(/^#[0-9A-Fa-f]{6}$/))) {
      return NextResponse.json({ error: 'Invalid label color format' }, { status: 400 })
    }

    const updatedLabel = await prisma.label.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    })

    return NextResponse.json(updatedLabel)
  } catch (error) {
    console.error('Failed to update label:', error)
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // First find all todos that use this label
    const todosWithLabel = await prisma.todo.findMany({
      where: {
        labels: {
          has: id,
        },
      },
      select: {
        id: true,
        labels: true,
      },
    })

    // Start a transaction to delete label and update todos
    await prisma.$transaction(async tx => {
      // Remove label from all todos that use it
      for (const todo of todosWithLabel) {
        await tx.todo.update({
          where: { id: todo.id },
          data: {
            labels: todo.labels.filter(labelId => labelId !== id),
          },
        })
      }

      // Then delete the label
      await tx.label.delete({
        where: { id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete label:', error)
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 })
  }
}
