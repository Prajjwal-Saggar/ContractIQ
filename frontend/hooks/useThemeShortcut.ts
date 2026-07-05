'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { toast } from 'react-hot-toast'

export function useThemeShortcut() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+L or Cmd+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        
        toast.success(
          `THEME: ${newTheme.toUpperCase()} MODE ACTIVATED >`,
          {
            id: 'theme-toast',
            duration: 2000,
          }
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])
}
