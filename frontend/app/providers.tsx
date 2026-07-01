'use client'

import { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Lenis from 'lenis'
import { AuthProvider } from '@/context/AuthContext'
import ScanlineOverlay from '@/components/animations/ScanlineOverlay'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScanlineOverlay />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A0A0A',
              color: '#F5F5F0',
              border: '1px solid #333',
              borderRadius: '0',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.05em',
            },
            success: {
              iconTheme: {
                primary: '#C8FF00',
                secondary: '#0A0A0A',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF3333',
                secondary: '#0A0A0A',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
