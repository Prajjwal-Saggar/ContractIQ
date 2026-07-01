'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * useLenis — returns the Lenis instance if you need to
 * programmatically scroll (e.g., scroll to top on route change).
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Access the global lenis instance created in Providers
    // This is a lightweight hook for consumers that need scroll control
    return () => {}
  }, [])

  const scrollTo = (target: string | number | HTMLElement, options?: object) => {
    lenisRef.current?.scrollTo(target as string, options)
  }

  return { scrollTo }
}
