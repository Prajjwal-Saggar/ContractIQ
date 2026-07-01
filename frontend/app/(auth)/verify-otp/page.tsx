'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import toast from 'react-hot-toast'
import { AuthDecoration } from '../register/page'
import { authApi } from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

function OTPForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const email        = params.get('email') ?? ''
  const { login }    = useAuth(false)

  const [digits, setDigits]   = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(45)
  const [canResend, setCanResend] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleChange = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < 5) refs.current[index + 1]?.focus()
  }, [digits])

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next  = [...digits]
    paste.split('').forEach((char, i) => { if (i < 6) next[i] = char })
    setDigits(next)
    refs.current[Math.min(paste.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const otp = digits.join('')
    if (otp.length < 6) { toast.error('ENTER FULL 6-DIGIT CODE'); return }
    setIsLoading(true)

    try {
      const { data } = await authApi.post('/api/auth/verify-otp', { email, otp })
      const user: User = { name: data.name, email: data.email, role: data.role }
      login(data.token, user)
      toast.success('ACCESS GRANTED >')
      router.push('/dashboard')
    } catch (err: unknown) {
      const anyErr = err as { normalizedMessage?: string }
      toast.error(anyErr?.normalizedMessage ?? 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authApi.post('/api/auth/resend-otp', { email })
      toast.success('CODE TRANSMITTED >')
      setCountdown(45)
      setCanResend(false)
      setDigits(Array(6).fill(''))
    } catch (err: unknown) {
      const anyErr = err as { normalizedMessage?: string }
      toast.error(anyErr?.normalizedMessage ?? 'Resend failed')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '440px' }}>
      <div className="section-tag" style={{ marginBottom: '12px' }}>
        /02 VERIFY IDENTITY
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
          fontSize: '44px',
          letterSpacing: '0.03em',
          color: '#0A0A0A',
          marginBottom: '16px',
        }}
      >
        ENTER ACCESS CODE
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#999990',
          marginBottom: '40px',
          lineHeight: 1.5,
        }}
      >
        CODE TRANSMITTED TO:
        <br />
        <span style={{ color: '#7B5EA7' }}>{email || 'your email'}</span>
      </p>

      {/* 6 OTP boxes */}
      <div
        style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}
        onPaste={handlePaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: '56px',
              height: '64px',
              border: digit ? '2px solid #7B5EA7' : '1px solid #0A0A0A',
              background: '#FFFFFF',
              textAlign: 'center',
              fontFamily: 'var(--font-mono-var), Space Mono, monospace',
              fontSize: '24px',
              fontWeight: 700,
              color: '#0A0A0A',
              outline: 'none',
              borderRadius: 0,
              cursor: 'crosshair',
              transition: 'border 200ms ease',
            }}
            onFocus={(e) => {
              (e.target as HTMLElement).style.border = '2px solid #7B5EA7'
            }}
            onBlur={(e) => {
              if (!digit) (e.target as HTMLElement).style.border = '1px solid #0A0A0A'
            }}
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={isLoading}
        style={{
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
        {isLoading ? 'VERIFYING...' : 'VERIFY →'}
      </button>

      {/* Resend */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#999990',
        }}
      >
        {canResend ? (
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: '#7B5EA7',
              cursor: 'crosshair',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            RESEND CODE →
          </button>
        ) : (
          <span>RESEND AVAILABLE IN {countdown}s</span>
        )}
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
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
        <Suspense fallback={null}>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  )
}
