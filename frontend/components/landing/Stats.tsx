'use client'

import CountUp from '@/components/animations/CountUp'
import TextReveal from '@/components/animations/TextReveal'

const STATS = [
  { value: 2847,  suffix: '+',  label: 'CONTRACTS ANALYSED',  decimals: 0 },
  { value: 18420, suffix: '+',  label: 'CLAUSES REVIEWED',     decimals: 0 },
  { value: 99.2,  suffix: '%',  label: 'ACCURACY RATE',        decimals: 1 },
  { value: 60,    prefix: '< ', label: 'SEC PROCESSING TIME',  decimals: 0 },
]

export default function Stats() {
  return (
    <section
      id="stats"
      style={{
        background: '#0A0A0A',
        padding: '120px 64px',
        borderTop: '1px solid #333',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <TextReveal>
          <div
            style={{
              fontFamily: 'var(--font-mono-var), Space Mono, monospace',
              fontSize: '11px',
              color: '#7B5EA7',
              letterSpacing: '0.2em',
              marginBottom: '16px',
            }}
          >
            /04 BY THE NUMBERS
          </div>
        </TextReveal>

        <TextReveal delay={0.1}>
          <h2
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: 'clamp(36px, 5vw, 56px)',
              color: '#F5F5F0',
              letterSpacing: '0.02em',
              marginBottom: '80px',
              borderBottom: '1px solid #222',
              paddingBottom: '32px',
            }}
          >
            NUMBERS DON&apos;T LIE
          </h2>
        </TextReveal>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0',
            border: '1px solid #222',
          }}
        >
          {STATS.map((stat, i) => (
            <TextReveal key={stat.label} delay={0.1 * i}>
              <div
                style={{
                  padding: '48px 32px',
                  borderRight: i < STATS.length - 1 ? '1px solid #222' : 'none',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                    fontSize: 'clamp(52px, 6vw, 80px)',
                    color: '#C8FF00',
                    lineHeight: 1,
                    marginBottom: '12px',
                  }}
                >
                  <CountUp
                    target={stat.value}
                    prefix={stat.prefix ?? ''}
                    suffix={stat.suffix ?? ''}
                    decimals={stat.decimals}
                  />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono-var), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#999990',
                    letterSpacing: '0.15em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </TextReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
