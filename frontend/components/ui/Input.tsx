'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  type = 'text',
  className = '',
  id,
  ...props
}: InputProps) {
  const [showPass, setShowPass] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="label-upper"
          style={{ color: error ? '#FF3333' : '#999990' }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={isPassword && showPass ? 'text' : type}
          className={cn('input-brutal', error && 'border-[#FF3333]', className)}
          style={{
            borderColor: error ? '#FF3333' : undefined,
            paddingRight: isPassword ? '48px' : undefined,
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'crosshair',
              color: '#999990',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
            tabIndex={-1}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#FF3333',
            letterSpacing: '0.05em',
          }}
        >
          {error}
        </span>
      )}
      {hint && !error && (
        <span
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#999990',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
