'use client'

import { FileText, AlertTriangle, Search, Quote, History } from 'lucide-react'
import TextReveal from '@/components/animations/TextReveal'

const FEATURES = [
  {
    icon: FileText,
    title: 'PDF INGESTION',
    tag: null,
    desc: 'Upload any contract PDF. Our system extracts and indexes every clause automatically.',
  },
  {
    icon: AlertTriangle,
    title: 'RISK DETECTION',
    tag: 'HIGH RISK',
    desc: 'AI identifies risky clauses — auto-renewal traps, liability gaps, one-sided terms.',
  },
  {
    icon: Search,
    title: 'SEMANTIC SEARCH',
    tag: null,
    desc: 'Ask questions in plain English. Get answers grounded in the exact contract text.',
  },
  {
    icon: Quote,
    title: 'CITED ANSWERS',
    tag: null,
    desc: 'Every answer shows exactly which clause it came from. Verifiable. Trustworthy.',
  },
  {
    icon: History,
    title: 'AUDIT TRAIL',
    tag: null,
    desc: 'Every question and answer is logged. Full conversation history per contract.',
  },
]

function FeatureCard({
  icon: Icon,
  title,
  tag,
  desc,
  delay,
}: {
  icon: typeof FileText
  title: string
  tag: string | null
  desc: string
  delay: number
}) {
  return (
    <TextReveal delay={delay}>
      <div
        className="card-brutal"
        style={{
          padding: '32px',
          cursor: 'crosshair',
          transition: 'background 200ms ease, color 200ms ease',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--text)'
          el.style.color = 'var(--bg)'
          const icon = el.querySelector('.feature-icon') as HTMLElement
          const titleEl = el.querySelector('.feature-title') as HTMLElement
          const descEl = el.querySelector('.feature-desc') as HTMLElement
          if (icon) icon.style.color = '#C8FF00'
          if (titleEl) titleEl.style.color = 'var(--bg)'
          if (descEl) descEl.style.color = '#999990'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--surface)'
          el.style.color = 'var(--text)'
          const icon = el.querySelector('.feature-icon') as HTMLElement
          const titleEl = el.querySelector('.feature-title') as HTMLElement
          const descEl = el.querySelector('.feature-desc') as HTMLElement
          if (icon) icon.style.color = 'var(--text)'
          if (titleEl) titleEl.style.color = 'var(--text)'
          if (descEl) descEl.style.color = 'var(--text-secondary)'
        }}
      >
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon size={22} className="feature-icon" style={{ transition: 'color 200ms ease' }} />
          {tag && (
            <span
              style={{
                background: '#C8FF00',
                color: '#0A0A0A',
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '2px 8px',
              }}
            >
              {tag}
            </span>
          )}
        </div>

        <div
          className="feature-title"
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: '26px',
            letterSpacing: '0.05em',
            color: 'var(--text)',
            marginBottom: '12px',
            transition: 'color 200ms ease',
          }}
        >
          {title}
        </div>

        <p
          className="feature-desc"
          style={{
            fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            transition: 'color 200ms ease',
          }}
        >
          {desc}
        </p>
      </div>
    </TextReveal>
  )
}

export default function Features() {
  return (
    <section
      id="features"
      style={{
        padding: '120px 64px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <TextReveal>
        <div className="section-tag" style={{ marginBottom: '16px' }}>
          /02 CORE CAPABILITIES
        </div>
      </TextReveal>

      <TextReveal delay={0.1}>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: '0.02em',
            color: 'var(--text)',
            marginBottom: '64px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '32px',
            transition: 'color 300ms ease',
          }}
        >
          BUILT FOR LEGAL INTELLIGENCE
        </h2>
      </TextReveal>

      {/* Feature grid — 3 + 2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0',
          border: '1px solid var(--border)',
        }}
      >
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            style={{
              borderRight: i % 3 !== 2 ? '1px solid var(--border)' : 'none',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}
          >
            <FeatureCard {...feature} delay={0.1 * i} />
          </div>
        ))}
      </div>
    </section>
  )
}
