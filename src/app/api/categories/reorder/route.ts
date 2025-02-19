import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@/types/category'

export async function POST(request: NextRequest) {
  try {
    const { categories } = await request.json()

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Invalid categories data' }, { status: 400 })
    }

    // Validate that all categories have an id and position
    const validCategories = categories.every(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cat: any) => typeof cat.id === 'string' && typeof cat.position === 'number'
    )

    if (!validCategories) {
      return NextResponse.json(
        { error: 'Invalid category format - each category must have an id and position' },
        { status: 400 }
      )
    }

    // Perform updates in a transaction to ensure consistency
    await prisma.$transaction(async tx => {
      // First validate that all categories exist
      const categoryIds = categories.map((cat: Category) => cat.id)
      const existingCategories = await tx.category.findMany({
        where: { id: { in: categoryIds } },
      })

      if (existingCategories.length !== categories.length) {
        throw new Error('One or more categories not found')
      }

      // Update positions one by one
      for (const cat of categories) {
        await tx.category.update({
          where: { id: cat.id },
          data: { position: cat.position },
        })
      }
    })

    // Get the updated categories
    const updatedCategories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
    })

    return NextResponse.json(updatedCategories)
  } catch (error) {
    console.error('Failed to reorder categories:', error)

    // Provide more specific error messages based on error type
    if (error instanceof Error && error.message === 'One or more categories not found') {
      return NextResponse.json(
        { error: 'One or more categories could not be found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 })
  }
}
