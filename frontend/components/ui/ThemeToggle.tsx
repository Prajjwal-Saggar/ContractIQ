'use client'

import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  size?: 'sm' | 'md'
}

export default function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  const iconSize = size === 'sm' ? 14 : 16
  const padding = size === 'sm' ? '6px 10px' : '8px 14px'

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        padding,
        fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        cursor: 'crosshair',
        transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
        borderRadius: 0,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'var(--primary)'
        el.style.color = '#FFFFFF'
        el.style.borderColor = 'var(--primary)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'var(--surface)'
        el.style.color = 'var(--text)'
        el.style.borderColor = 'var(--border)'
      }}
    >
      {isDark ? (
        <>
          <Sun size={iconSize} />
          {size === 'md' && 'LIGHT'}
        </>
      ) : (
        <>
          <Moon size={iconSize} />
          {size === 'md' && 'DARK'}
        </>
      )}
    </button>
  )
}
