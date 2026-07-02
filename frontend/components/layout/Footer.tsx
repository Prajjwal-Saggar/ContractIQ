'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentTime } from '@/lib/utils'

export default function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(getCurrentTime())
    const interval = setInterval(() => setTime(getCurrentTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      {/* Main footer row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '48px 64px',
          gap: '32px',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {/* Left */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '28px',
              letterSpacing: '0.1em',
              color: 'var(--text)',
              marginBottom: '8px',
              transition: 'color 300ms ease',
            }}
          >
            CONTRACTIQ_
          </div>
          <div
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              maxWidth: '260px',
              lineHeight: 1.6,
              transition: 'color 300ms ease',
            }}
          >
            AI-powered legal document analysis. Upload. Analyse. Ask.
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#999990',
              marginTop: '16px',
            }}
          >
            © {new Date().getFullYear()} CONTRACTIQ. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Center — Nav links */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
          }}
        >
          {[
            { label: 'FEATURES', href: '/#features' },
            { label: 'DASHBOARD', href: '/dashboard' },
            { label: 'LOGIN', href: '/login' },
            { label: 'REGISTER', href: '/register' },
          ].map(({ label, href }) => (
            <Link key={label} href={href}>
              <span
                style={{
                  fontFamily: 'var(--font-mono-var), Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: 'var(--text-muted)',
                  cursor: 'crosshair',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = 'var(--text)')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = 'var(--text-muted)')
                }
              >
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Right — System status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <span
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#00FF88',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '8px' }}>●</span>
            SYSTEM OPERATIONAL
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#999990',
            }}
          >
            {time}
          </span>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        style={{
          overflow: 'hidden',
          padding: '12px 0',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div className="ticker-inner">
          {[1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '10px',
                color: '#999990',
                letterSpacing: '0.2em',
                padding: '0 40px',
                whiteSpace: 'nowrap',
              }}
            >
              ACCESS GRANTED · NODE ACTIVE · ENCRYPTION ON · CONTRACT INTELLIGENCE ONLINE · DATA SECURE ·&nbsp;
              ACCESS GRANTED · NODE ACTIVE · ENCRYPTION ON · CONTRACT INTELLIGENCE ONLINE · DATA SECURE ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
