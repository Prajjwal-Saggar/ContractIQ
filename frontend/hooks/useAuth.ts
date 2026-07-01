'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'

/**
 * useAuth — wraps AuthContext and optionally guards the page.
 * Pass `requireAuth: true` (default) to redirect to /login if not authenticated.
 * Pass `requireAuth: false` for public pages (landing, auth pages).
 */
export function useAuth(requireAuth = true) {
  const router = useRouter()
  const { user, token, isLoading, login, logout } = useAuthContext()

  useEffect(() => {
    if (!isLoading && requireAuth && !token) {
      router.replace('/login')
    }
  }, [isLoading, requireAuth, token, router])

  return { user, token, isLoading, login, logout }
}
