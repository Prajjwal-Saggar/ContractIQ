import { format, parseISO } from 'date-fns'
import { clsx, type ClassValue } from 'clsx'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format ISO date string → "01 Jan 2025"
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

// Format ISO date string → "01 Jan 2025, 14:30"
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm')
  } catch {
    return dateStr
  }
}

// Format file size bytes → human readable
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Truncate long text
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

// Extract field errors from API response
export function extractFieldErrors(
  fieldErrors: Record<string, string | undefined> | undefined
): Record<string, string> {
  if (!fieldErrors) return {}
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(fieldErrors)) {
    if (key !== 'error' && key !== 'message' && val) {
      result[key] = val
    }
  }
  return result
}

// Get current time as HH:MM:SS
export function getCurrentTime(): string {
  const now = new Date()
  return now.toTimeString().slice(0, 8)
}

// Risk level to color
export function riskColor(level: 'HIGH' | 'MEDIUM' | 'LOW' | null): string {
  switch (level) {
    case 'HIGH':   return '#FF3333'
    case 'MEDIUM': return '#FF9900'
    case 'LOW':    return '#C8FF00'
    default:       return '#E0E0D8'
  }
}

// Risk level to bg/text class pair
export function riskBadgeClass(level: 'HIGH' | 'MEDIUM' | 'LOW' | null): {
  bg: string; text: string
} {
  switch (level) {
    case 'HIGH':   return { bg: '#FF3333', text: '#FFFFFF' }
    case 'MEDIUM': return { bg: '#FF9900', text: '#0A0A0A' }
    case 'LOW':    return { bg: '#C8FF00', text: '#0A0A0A' }
    default:       return { bg: '#E0E0D8', text: '#0A0A0A' }
  }
}
