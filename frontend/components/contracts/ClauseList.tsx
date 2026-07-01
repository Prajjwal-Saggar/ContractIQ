'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { riskColor } from '@/lib/utils'
import type { Clause } from '@/types'

interface ClauseListProps {
  clauses: Clause[]
  highlightId?: number | null
}

function ClauseItem({ clause, highlighted }: { clause: Clause; highlighted: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const accent = riskColor(clause.riskLevel)

  return (
    <div
      id={`clause-${clause.id}`}
      style={{
        borderBottom: '1px solid #E0E0D8',
        borderLeft: `3px solid ${highlighted ? '#7B5EA7' : accent}`,
        background: highlighted ? '#F0EBFF' : '#FFFFFF',
        transition: 'background 200ms ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: 'crosshair',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ flex: 1 }}>
          {/* Type + badge row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            {clause.clauseType && (
              <span
                style={{
                  fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: '#999990',
                  textTransform: 'uppercase',
                }}
              >
                {clause.clauseType}
              </span>
            )}
            <RiskBadge level={clause.riskLevel} size="sm" />
          </div>

          {/* Clause text (truncated) */}
          <p
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '13px',
              color: '#0A0A0A',
              lineHeight: 1.6,
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {clause.clauseText}
          </p>

          {/* Risk explanation */}
          {clause.riskExplanation && (
            <p
              style={{
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '12px',
                color: '#555550',
                fontStyle: 'italic',
                marginTop: '8px',
                lineHeight: 1.5,
                display: expanded ? 'block' : 'none',
              }}
            >
              ⚠ {clause.riskExplanation}
            </p>
          )}
        </div>

        {/* Expand toggle */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'crosshair',
            color: '#999990',
            flexShrink: 0,
            padding: '4px',
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function ClauseList({ clauses, highlightId }: ClauseListProps) {
  if (clauses.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#999990',
          border: '1px solid #E0E0D8',
        }}
      >
        NO CLAUSES FOUND FOR THIS FILTER
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #0A0A0A' }}>
      {clauses.map((clause) => (
        <ClauseItem
          key={clause.id}
          clause={clause}
          highlighted={highlightId === clause.id}
        />
      ))}
    </div>
  )
}
