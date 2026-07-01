'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import { AuthDecoration } from '../register/page'
import { authApi } from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

export default function LoginPage() {
  const router  = useRouter()
  const { login } = useAuth(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const { data } = await authApi.post('/api/auth/login', form)
      const user: User = { name: data.name, email: data.email, role: data.role }
      login(data.token, user)
      toast.success('ACCESS GRANTED >')
      router.push('/dashboard')
    } catch (err: unknown) {
      const anyErr = err as { fieldErrors?: Record<string, string>; normalizedMessage?: string }
      const msg = anyErr?.normalizedMessage ?? ''

      // Unverified user — redirect to OTP
      if (msg.toLowerCase().includes('verif') || msg.toLowerCase().includes('otp')) {
        toast.error('VERIFICATION REQUIRED')
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`)
        return
      }
      toast.error(msg || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthDecoration />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          background: '#F5F5F0',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div className="section-tag" style={{ marginBottom: '12px' }}>
            /01 SYSTEM ACCESS
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '48px',
              letterSpacing: '0.03em',
              color: '#0A0A0A',
              marginBottom: '40px',
            }}
          >
            AUTHENTICATE
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              id="email"
              label="EMAIL ADDRESS"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              id="password"
              label="PASSWORD"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isLoading ? '#555550' : '#0A0A0A',
                color: '#F5F5F0',
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'crosshair',
                transition: 'background 200ms ease',
                width: '100%',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#7B5EA7'
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#0A0A0A'
              }}
            >
              {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM ↗'}
            </button>
          </form>

          <div
            style={{
              marginTop: '32px',
              textAlign: 'center',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '12px',
              color: '#999990',
            }}
          >
            NOT IN SYSTEM?{' '}
            <Link href="/register">
              <span style={{ color: '#7B5EA7', cursor: 'crosshair', fontWeight: 600 }}>
                REGISTER →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
