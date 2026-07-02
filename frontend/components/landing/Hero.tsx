'use client'

import Link from 'next/link'
import CharReveal from '@/components/animations/CharReveal'
import TextReveal from '@/components/animations/TextReveal'

// CSS-only 8x8 grid decoration
function GridDecoration() {
  const filled: Record<number, string> = {
    2: '#7B5EA7', 5: '#C8FF00', 9: '#7B5EA7', 12: '#7B5EA7',
    16: '#C8FF00', 19: '#7B5EA7', 22: '#C8FF00', 25: '#0A0A0A',
    28: '#7B5EA7', 33: '#C8FF00', 36: '#7B5EA7', 40: '#0A0A0A',
    43: '#C8FF00', 47: '#7B5EA7', 50: '#C8FF00', 54: '#0A0A0A',
    57: '#7B5EA7', 60: '#C8FF00', 63: '#7B5EA7',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 32px)',
        gridTemplateRows: 'repeat(8, 32px)',
        gap: '4px',
        transform: 'rotate(15deg)',
        opacity: 0.85,
      }}
    >
      {Array.from({ length: 64 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '32px',
            height: '32px',
            background: filled[i] ?? 'transparent',
            border: filled[i] ? 'none' : '1px solid var(--border-light)',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        paddingTop: '56px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 64px',
          gap: '48px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Left — text */}
        <div style={{ flex: '0 0 55%', maxWidth: '55%', minWidth: '280px' }}>
          {/* Section tag */}
          <div className="section-tag" style={{ marginBottom: '20px' }}>
            /01 AI LEGAL TECH
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: 'clamp(52px, 8vw, 96px)',
              lineHeight: 0.95,
              color: 'var(--text)',
              marginBottom: '24px',
              letterSpacing: '0.02em',
              transition: 'color 300ms ease',
            }}
          >
            <CharReveal text="CONTRACT" initialDelay={0.1} />
            <br />
            <CharReveal text="INTELLIGENCE" initialDelay={0.5} />
            <br />
            <CharReveal text="REDEFINED." initialDelay={1.1} />
          </h1>

          {/* Subheading */}
          <TextReveal delay={1.8}>
            <p
              style={{
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '18px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '480px',
                marginBottom: '40px',
                transition: 'color 300ms ease',
              }}
            >
              Upload contracts. Get instant risk analysis.
              <br />
              Ask questions. Get cited answers.
            </p>
          </TextReveal>

          {/* CTA buttons */}
          <TextReveal delay={2.0}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/register">
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    border: '1px solid var(--text)',
                    padding: '16px 32px',
                    fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: 'crosshair',
                    transition: 'background 200ms ease',
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'var(--primary)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'var(--text)')
                  }
                >
                  ANALYSE CONTRACT ↗
                </button>
              </Link>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: '16px 32px',
                  fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'crosshair',
                  transition: 'background 200ms ease, color 200ms ease',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--text)'
                  el.style.color = 'var(--bg)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--text)'
                }}
              >
                VIEW DEMO [&nbsp;&nbsp;]
              </button>
            </div>
          </TextReveal>

          {/* System status bar */}
          <TextReveal delay={2.2}>
            <div
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                color: '#999990',
                letterSpacing: '0.05em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#00FF88' }}>● CONNECTION SECURE</span>
              <span>· &gt; ENCRYPTION: AES-256</span>
              <span>· NODE: CONTRACTIQ_01</span>
              <span>· SCN: 0001</span>
            </div>
          </TextReveal>
        </div>

        {/* Right — grid decoration */}
        <div
          className="hide-mobile"
          style={{
            flex: '0 0 45%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <GridDecoration />
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 0',
          background: '#0A0A0A',
        }}
      >
        <div className="ticker-inner">
          {[1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                color: '#C8FF00',
                letterSpacing: '0.25em',
                padding: '0 32px',
                whiteSpace: 'nowrap',
              }}
            >
              CONTRACT ANALYSIS · RISK DETECTION · AI CHAT · CLAUSE EXTRACTION · LEGAL INTELLIGENCE · &nbsp;
              CONTRACT ANALYSIS · RISK DETECTION · AI CHAT · CLAUSE EXTRACTION · LEGAL INTELLIGENCE · &nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
