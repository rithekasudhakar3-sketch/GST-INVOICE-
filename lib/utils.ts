import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateFull = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    paid: '✓',
    pending: '⏳',
    partial: '◐',
    overdue: '✕',
    draft: '📝',
    active: '✓',
    inactive: '✕',
    completed: '✓',
  }
  return icons[status] || '•'
}

export const calculateInvoiceTotal = (items: any[], discount: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const gst = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price
    return sum + itemTotal * (item.gst / 100)
  }, 0)
  return { subtotal, gst, total: subtotal + gst - discount }
}

export const getDaysOverdue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = today.getTime() - due.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export const truncateText = (text: string, length: number = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
