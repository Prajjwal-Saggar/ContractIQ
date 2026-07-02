'use client'

import TextReveal from '@/components/animations/TextReveal'

const STEPS = [
  {
    num: '01',
    title: 'UPLOAD',
    desc: 'Drag and drop your contract PDF into ContractIQ. Any format, any length.',
    detail: 'Supports PDF up to 20MB. Text extraction happens instantly.',
  },
  {
    num: '02',
    title: 'ANALYSE',
    desc: 'Our AI processes all clauses, detects risk, and generates embeddings.',
    detail: 'Takes less than 60 seconds. Risk levels: HIGH / MEDIUM / LOW.',
  },
  {
    num: '03',
    title: 'ASK',
    desc: 'Chat with your contract in plain English. Get answers with source clauses.',
    detail: 'Every answer is grounded in the actual contract text.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: '120px 64px',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--bg)',
        transition: 'background 300ms ease',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <TextReveal>
          <div className="section-tag" style={{ marginBottom: '16px' }}>
            /03 HOW IT WORKS
          </div>
        </TextReveal>

        <TextReveal delay={0.1}>
          <h2
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: 'clamp(40px, 6vw, 72px)',
              letterSpacing: '0.02em',
              color: 'var(--text)',
              marginBottom: '80px',
              transition: 'color 300ms ease',
            }}
          >
            THREE STEPS TO INTELLIGENCE
          </h2>
        </TextReveal>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0',
            border: '1px solid var(--border)',
          }}
        >
          {STEPS.map((step, i) => (
            <TextReveal key={step.num} delay={0.1 * i}>
              <div
                style={{
                  padding: '48px 40px',
                  borderRight: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '320px',
                  background: 'var(--surface)',
                  transition: 'background 300ms ease',
                }}
              >
                {/* Large background step number */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                    fontSize: '140px',
                    color: 'var(--border-light)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {step.num}
                </div>

                {/* Step number tag */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono-var), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#7B5EA7',
                    letterSpacing: '0.2em',
                    marginBottom: '24px',
                  }}
                >
                  STEP_{step.num}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                    fontSize: '48px',
                    letterSpacing: '0.05em',
                    color: 'var(--text)',
                    marginBottom: '16px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.title}
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                    fontSize: '15px',
                    color: 'var(--text)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.desc}
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                    fontSize: '11px',
                    color: '#999990',
                    lineHeight: 1.5,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.detail}
                </p>
              </div>
            </TextReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
