'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentTime } from '@/lib/utils'

export default function Navbar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(getCurrentTime())
    const interval = setInterval(() => setTime(getCurrentTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: '#F5F5F0',
        borderBottom: '1px solid #0A0A0A',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      {/* Logo */}
      <Link href="/">
        <span
          className="glitch-hover"
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: '24px',
            letterSpacing: '0.1em',
            color: '#0A0A0A',
            cursor: 'crosshair',
          }}
        >
          CONTRACTIQ_
        </span>
      </Link>

      {/* Center nav */}
      <div
        className="hide-mobile"
        style={{ display: 'flex', gap: '40px', alignItems: 'center' }}
      >
        {[
          { label: 'WORK', id: 'features' },
          { label: 'FEATURES', id: 'features' },
          { label: 'ABOUT', id: 'stats' },
        ].map(({ label, id }) => (
          <button
            key={label}
            onClick={() => scrollTo(id)}
            style={{
              fontFamily: 'var(--font-mono-var), Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#555550',
              background: 'none',
              border: 'none',
              cursor: 'crosshair',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#0A0A0A')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#555550')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Live clock */}
        <span
          className="hide-mobile"
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#999990',
            letterSpacing: '0.1em',
          }}
        >
          {time}
        </span>

        {/* CTA */}
        <Link href="/register">
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0A0A0A',
              color: '#F5F5F0',
              border: 'none',
              padding: '8px 18px',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: 'crosshair',
              transition: 'background 200ms ease',
              borderRadius: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#7B5EA7')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#0A0A0A')
            }
          >
            START ANALYSIS ↗
          </button>
        </Link>
      </div>
    </nav>
  )
}
