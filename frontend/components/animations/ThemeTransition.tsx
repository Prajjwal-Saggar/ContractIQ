'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export default function ThemeTransition() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 150)
      return () => clearTimeout(timer)
    }
  }, [theme, mounted])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: flash ? 0.15 : 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[10000] pointer-events-none bg-[#C8FF00]"
    />
  )
}
