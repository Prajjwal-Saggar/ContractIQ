'use client'

import Link from 'next/link'
import { useRiskSummary, useContracts } from '@/hooks/useContracts'
import StatusBadge from '@/components/ui/StatusBadge'
import SystemTag from '@/components/ui/SystemTag'
import { formatDate } from '@/lib/utils'

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: highlight ? 'var(--error)' : 'var(--surface)',
        padding: '24px',
        cursor: 'default',
        transition: 'background 200ms ease',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: highlight ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
          fontSize: '48px',
          color: highlight ? '#FFFFFF' : 'var(--text)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useRiskSummary()
  const { data: contracts, isLoading: contractsLoading } = useContracts()

  const recentContracts = contracts?.slice(0, 8) ?? []

  return (
    <div style={{ padding: '32px' }}>
      {/* Section tag */}
      <div className="section-tag" style={{ marginBottom: '24px' }}>
        /01 SYSTEM OVERVIEW
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0',
          border: '1px solid var(--border)',
          marginBottom: '32px',
        }}
      >
        {summaryLoading ? (
          <div
            style={{
              padding: '24px',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '12px',
              color: 'var(--text-muted)',
              gridColumn: '1 / -1',
            }}
          >
            LOADING_<span className="blink">|</span>
          </div>
        ) : (
          <>
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <StatCard label="TOTAL CONTRACTS"    value={summary?.totalContracts ?? 0} />
            </div>
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <StatCard label="READY FOR ANALYSIS" value={summary?.readyContracts ?? 0} />
            </div>
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <StatCard label="RISK FLAGS"         value={summary?.totalRiskFlags ?? 0} />
            </div>
            <StatCard
              label="HIGH RISK"
              value={summary?.highRiskFlags ?? 0}
              highlight={(summary?.highRiskFlags ?? 0) > 0}
            />
          </>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Recent contracts table */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', transition: 'background 300ms ease' }}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                fontSize: '20px',
                letterSpacing: '0.05em',
                color: 'var(--text)',
              }}
            >
              RECENT CONTRACTS
            </span>
            <Link href="/contracts">
              <span
                style={{
                  fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                  fontSize: '11px',
                  color: '#7B5EA7',
                  cursor: 'crosshair',
                  letterSpacing: '0.05em',
                }}
              >
                VIEW ALL →
              </span>
            </Link>
          </div>

          {contractsLoading ? (
            <div
              style={{
                padding: '24px',
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '12px',
                color: '#999990',
              }}
            >
              LOADING_<span className="blink">|</span>
            </div>
          ) : (
            <table className="table-brutal">
              <thead>
                <tr>
                  <th>CONTRACT</th>
                  <th>STATUS</th>
                  <th>CLAUSES</th>
                  <th>FLAGS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentContracts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/contracts/${c.id}`}>
                        <span
                          style={{
                            fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text)',
                            cursor: 'crosshair',
                            maxWidth: '200px',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--primary)')}
                          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text)')}
                        >
                          {c.originalFileName}
                        </span>
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {c.clauseCount ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                          fontSize: '12px',
                          color: (c.riskFlagCount ?? 0) > 0 ? 'var(--error)' : 'var(--text-secondary)',
                          fontWeight: (c.riskFlagCount ?? 0) > 0 ? 700 : 400,
                        }}
                      >
                        {c.riskFlagCount ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {formatDate(c.uploadedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentContracts.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div
                        style={{
                          padding: '32px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        NO CONTRACTS YET. UPLOAD ONE TO BEGIN.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* System status card */}
        <div
          style={{
            background: 'var(--sidebar-bg)',
            border: '1px solid var(--sidebar-border)',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '20px',
              color: '#F5F5F0',
              letterSpacing: '0.05em',
              marginBottom: '24px',
              borderBottom: '1px solid var(--sidebar-section)',
              paddingBottom: '12px',
            }}
          >
            SYSTEM STATUS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SystemTag label="EMBEDDING SERVICE: ONLINE" active={true} />
            <SystemTag label="DATABASE: CONNECTED" active={true} />
            <SystemTag label="AI MODEL: ACTIVE" active={true} />
            <SystemTag label="ENCRYPTION: AES-256" active={true} />
          </div>

          <div
            style={{
              marginTop: '32px',
              paddingTop: '16px',
              borderTop: '1px solid var(--sidebar-section)',
            }}
          >
            <Link href="/contracts/upload">
              <button
                style={{
                  width: '100%',
                  background: '#C8FF00',
                  color: '#0A0A0A',
                  border: 'none',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'crosshair',
                  transition: 'background 200ms ease',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#b8ef00')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#C8FF00')
                }
              >
                + UPLOAD CONTRACT
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
