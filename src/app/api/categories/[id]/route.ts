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
    const data = await request.json()

    if (data.name && typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Invalid category name' }, { status: 400 })
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // First delete all todos associated with this category
    await prisma.todo.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    })

    // Then delete the category
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
