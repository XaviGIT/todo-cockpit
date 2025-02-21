import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(labels)
  } catch (error) {
    console.error('Failed to fetch labels:', error)
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid label name' }, { status: 400 })
    }

    if (!color || typeof color !== 'string' || !color.match(/^#[0-9A-Fa-f]{6}$/)) {
      return NextResponse.json({ error: 'Invalid label color' }, { status: 400 })
    }

    const id = uuidv4()
    const newLabel = await prisma.label.create({
      data: { id, name, color },
    })

    return NextResponse.json(newLabel)
  } catch (error) {
    console.error('Failed to create label:', error)
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 })
  }
}
