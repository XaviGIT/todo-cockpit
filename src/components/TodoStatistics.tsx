'use client'

import { useMemo } from 'react'
import { isPast, isToday, isTomorrow, addDays } from 'date-fns'
import { useTodos } from '@/app/hooks/api'

interface Props {
  selectedCategory: string | undefined
}

export default function TodoStatistics({ selectedCategory }: Props) {
  const { data: todos = [] } = useTodos(selectedCategory)

  const stats = useMemo(() => {
    // Ensure todos is an array
    const validTodos = Array.isArray(todos) ? todos : []

    // Count total tasks
    const total = validTodos.length

    // Count completed tasks
    const completed = validTodos.filter(todo => todo.status === 'DONE').length

    // Count active tasks
    const active = total - completed

    // Count important tasks
    const important = validTodos.filter(todo => todo.isImportant).length

    // Count overdue tasks (only count active tasks)
    const overdue = validTodos.filter(
      todo => todo.dueDate && isPast(new Date(todo.dueDate)) && todo.status !== 'DONE'
    ).length

    // Count tasks due today
    const dueToday = validTodos.filter(
      todo => todo.dueDate && isToday(new Date(todo.dueDate)) && todo.status !== 'DONE'
    ).length

    // Count tasks due tomorrow
    const dueTomorrow = validTodos.filter(
      todo => todo.dueDate && isTomorrow(new Date(todo.dueDate)) && todo.status !== 'DONE'
    ).length

    // Count tasks due within a week (but not today/tomorrow/overdue)
    const dueThisWeek = validTodos.filter(todo => {
      if (!todo.dueDate || todo.status === 'DONE') return false
      const dueDate = new Date(todo.dueDate)
      return (
        !isPast(dueDate) &&
        !isToday(dueDate) &&
        !isTomorrow(dueDate) &&
        dueDate <= addDays(new Date(), 7)
      )
    }).length

    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      active,
      important,
      overdue,
      dueToday,
      dueTomorrow,
      dueThisWeek,
      completionRate,
    }
  }, [todos])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
      <StatCard
        title="Tasks"
        value={stats.total}
        subtitle={`${stats.active} active`}
        icon={<TaskIcon />}
        color="bg-blue-50 text-blue-700"
      />
      <StatCard
        title="Completed"
        value={stats.completionRate}
        subtitle={`${stats.completed}/${stats.total} tasks`}
        icon={<CompletedIcon />}
        color="bg-green-50 text-green-700"
        suffix="%"
      />
      <StatCard
        title="Important"
        value={stats.important}
        subtitle={`${Math.round((stats.important / Math.max(stats.total, 1)) * 100)}% of all tasks`}
        icon={<ImportantIcon />}
        color="bg-amber-50 text-amber-700"
      />
      <StatCard
        title="Due Soon"
        value={stats.overdue + stats.dueToday}
        subtitle={stats.overdue > 0 ? `${stats.overdue} overdue` : `${stats.dueTomorrow} tomorrow`}
        icon={<CalendarIcon />}
        color={stats.overdue > 0 ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
  color: string
  suffix?: string
}

function StatCard({ title, value, subtitle, icon, color, suffix = '' }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 ${color} shadow-sm`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="rounded-full bg-white/30 p-2">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold">
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-xs opacity-80">{subtitle}</p>
    </div>
  )
}

// Icons
function TaskIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74"></path>
      <path d="M5 11l2-2 2 2"></path>
      <path d="M15 11l2-2 2 2"></path>
      <rect width="20" height="8" x="2" y="13" rx="2"></rect>
    </svg>
  )
}

function CompletedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  )
}

function ImportantIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}
