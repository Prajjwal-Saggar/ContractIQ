'use client'

import Link from 'next/link'
import { useRiskSummary, useContracts } from '@/hooks/useContracts'
import { formatDate } from '@/lib/utils'

export default function AnalyticsPage() {
  const { data: summary, isLoading } = useRiskSummary()
  const { data: contracts } = useContracts()

  const totalFlags = summary?.totalRiskFlags ?? 0
  const highFlags  = summary?.highRiskFlags ?? 0
  const medFlags   = summary?.mediumRiskFlags ?? 0
  const lowFlags   = totalFlags - highFlags - medFlags

  const cleanContracts = (contracts ?? []).filter(
    (c) => c.riskFlagCount === 0 && c.status === 'READY'
  ).length

  const highPct  = totalFlags > 0 ? (highFlags / totalFlags) * 100 : 0
  const medPct   = totalFlags > 0 ? (medFlags  / totalFlags) * 100 : 0
  const lowPct   = totalFlags > 0 ? (lowFlags  / totalFlags) * 100 : 0

  return (
    <div style={{ padding: '0' }}>
      {/* Dark header bar */}
      <div
        style={{
          background: '#0A0A0A',
          padding: '48px 32px',
          borderBottom: '1px solid #333',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono-var), Space Mono, monospace',
            fontSize: '11px',
            color: '#7B5EA7',
            letterSpacing: '0.2em',
            marginBottom: '12px',
          }}
        >
          /05 RISK INTELLIGENCE
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: 'clamp(36px, 5vw, 56px)',
            color: '#F5F5F0',
            letterSpacing: '0.02em',
          }}
        >
          RISK MATRIX
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#555550',
            marginTop: '8px',
          }}
        >
          LAST UPDATED: {new Date().toLocaleString('en-GB')}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Stat counters row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0',
            border: '1px solid #0A0A0A',
            marginBottom: '32px',
          }}
        >
          {isLoading ? (
            <div
              style={{
                padding: '24px',
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '12px',
                color: '#999990',
                gridColumn: '1 / -1',
              }}
            >
              LOADING_<span className="blink">|</span>
            </div>
          ) : (
            <>
              {[
                { label: 'TOTAL RISK FLAGS',    value: totalFlags, color: '#C8FF00', bg: '#0A0A0A' },
                { label: 'HIGH SEVERITY',        value: highFlags,  color: '#FF3333', bg: '#FFFFFF' },
                { label: 'MEDIUM SEVERITY',      value: medFlags,   color: '#FF9900', bg: '#FFFFFF' },
                { label: 'CONTRACTS CLEAN',      value: cleanContracts, color: '#00FF88', bg: '#FFFFFF' },
              ].map(({ label, value, color, bg }, i) => (
                <div
                  key={label}
                  style={{
                    padding: '28px 24px',
                    background: bg,
                    borderRight: i < 3 ? '1px solid #0A0A0A' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      color: bg === '#0A0A0A' ? '#555550' : '#999990',
                      marginBottom: '8px',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                      fontSize: '52px',
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Risk distribution bar */}
        {totalFlags > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono-var), Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#999990',
                marginBottom: '12px',
              }}
            >
              RISK DISTRIBUTION
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', marginBottom: '6px' }}>
              {highFlags > 0 && (
                <div style={{ flex: `${highPct} 0 0`, fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '10px', color: '#FF3333' }}>
                  HIGH {highPct.toFixed(0)}%
                </div>
              )}
              {medFlags > 0 && (
                <div style={{ flex: `${medPct} 0 0`, fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '10px', color: '#FF9900' }}>
                  MED {medPct.toFixed(0)}%
                </div>
              )}
              {lowFlags > 0 && (
                <div style={{ flex: `${lowPct} 0 0`, fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '10px', color: '#C8FF00' }}>
                  LOW {lowPct.toFixed(0)}%
                </div>
              )}
            </div>

            {/* Bar */}
            <div style={{ display: 'flex', height: '20px', border: '1px solid #0A0A0A' }}>
              {highFlags > 0 && (
                <div style={{ flex: `${highPct} 0 0`, background: '#FF3333' }} />
              )}
              {medFlags > 0 && (
                <div style={{ flex: `${medPct} 0 0`, background: '#FF9900' }} />
              )}
              {lowFlags > 0 && (
                <div style={{ flex: `${lowPct} 0 0`, background: '#C8FF00' }} />
              )}
            </div>
          </div>
        )}

        {/* Highest risk contracts table */}
        <div style={{ border: '1px solid #0A0A0A' }}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #0A0A0A',
              background: '#0A0A0A',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                fontSize: '22px',
                color: '#F5F5F0',
                letterSpacing: '0.05em',
              }}
            >
              HIGHEST RISK CONTRACTS
            </span>
          </div>

          <table className="table-brutal">
            <thead>
              <tr>
                <th>RANK</th>
                <th>CONTRACT</th>
                <th>HIGH</th>
                <th>MED</th>
                <th>LOW</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.mostRiskyContracts ?? []).slice(0, 3).map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                        fontSize: '24px',
                        color: i === 0 ? '#FF3333' : '#555550',
                      }}
                    >
                      #{i + 1}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0A0A0A',
                        maxWidth: '200px',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.originalFileName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '12px', color: '#FF3333', fontWeight: 700 }}>
                      {c.highRiskCount ?? 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '12px', color: '#FF9900' }}>
                      {c.mediumRiskCount ?? 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '12px', color: '#C8FF00' }}>
                      {c.lowRiskCount ?? 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace', fontSize: '11px', color: '#999990' }}>
                      {formatDate(c.uploadedAt)}
                    </span>
                  </td>
                  <td>
                    <Link href={`/contracts/${c.id}`}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          color: '#7B5EA7',
                          cursor: 'crosshair',
                          padding: 0,
                          transition: 'color 200ms ease',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#0A0A0A')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#7B5EA7')}
                      >
                        OPEN →
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {(summary?.mostRiskyContracts ?? []).length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div
                      style={{
                        padding: '32px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                        fontSize: '12px',
                        color: '#999990',
                      }}
                    >
                      NO RISK DATA AVAILABLE. UPLOAD AND ANALYSE CONTRACTS FIRST.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
