'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import { authApi } from '@/lib/axios'
import { extractFieldErrors } from '@/lib/utils'

function AuthDecoration() {
  return (
    <div
      className="hide-mobile"
      style={{
        flex: '0 0 45%',
        background: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        minHeight: '100vh',
      }}
    >
      {/* Rotated brand text */}
      <div
        style={{
          position: 'absolute',
          left: '-60px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
          fontSize: '72px',
          color: '#C8FF00',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        CONTRACTIQ_
      </div>

      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
        }}
      />

      {/* System status at bottom */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
        {[
          { label: 'SYS.STATUS', value: 'ONLINE', ok: true },
          { label: 'ENCRYPTION', value: 'ACTIVE', ok: true },
          { label: 'NODE', value: 'AUTH_01', ok: true },
        ].map(({ label, value, ok }) => (
          <div
            key={label}
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#555550',
              marginBottom: '6px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <span>{label}:</span>
            <span style={{ color: ok ? '#C8FF00' : '#FF3333' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { AuthDecoration }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'USER' | 'ADMIN',
  })
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
      await authApi.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role || 'USER',
      })
      toast.success('ACCOUNT INITIALISED >')
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`)
    } catch (err: unknown) {
      const anyErr = err as { fieldErrors?: Record<string, string> }
      const fieldErrors = extractFieldErrors(anyErr?.fieldErrors)
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
      } else {
        toast.error((anyErr as { normalizedMessage?: string })?.normalizedMessage ?? 'Registration failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthDecoration />

      {/* Form panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          background: 'var(--bg)',
          transition: 'background 300ms ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Header */}
          <div className="section-tag" style={{ marginBottom: '12px' }}>
            /01 CREATE ACCOUNT
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '48px',
              letterSpacing: '0.03em',
              color: 'var(--text)',
              marginBottom: '40px',
            }}
          >
            JOIN THE SYSTEM
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              id="name"
              label="FULL NAME"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />

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
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required
            />

            {/* Role select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="role"
                className="label-upper"
              >
                ROLE
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 0,
                  background: 'var(--surface)',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                  fontSize: '14px',
                  color: 'var(--text)',
                  cursor: 'crosshair',
                  appearance: 'none',
                  outline: 'none',
                  transition: 'background 300ms ease',
                }}
              >
                <option value="USER">STANDARD USER</option>
                <option value="ADMIN">ADMINISTRATOR</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isLoading ? 'var(--text-secondary)' : 'var(--text)',
                color: 'var(--bg)',
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
                if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'var(--primary)'
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'var(--text)'
              }}
            >
              {isLoading ? 'INITIALISING...' : 'INITIALISE ACCOUNT ↗'}
            </button>
          </form>

          {/* Link to login */}
          <div
            style={{
              marginTop: '32px',
              textAlign: 'center',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            ALREADY IN SYSTEM?{' '}
            <Link href="/login">
              <span
                style={{ color: 'var(--primary)', cursor: 'crosshair', fontWeight: 600 }}
              >
                ACCESS →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
