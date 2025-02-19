import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid category name' }, { status: 400 })
    }

    // Get the highest position to place the new category at the end
    const highestPosition = await prisma.category.findFirst({
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const position = highestPosition ? highestPosition.position + 1 : 0

    const newCategory = await prisma.category.create({
      data: { name, position },
    })

    return NextResponse.json(newCategory)
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
