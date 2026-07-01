import type { Clause } from '@/types'

interface SourceClausesProps {
  clauses: Clause[]
  highlightId?: number | null
  onClauseClick?: (id: number) => void
}

export default function SourceClauses({ clauses, highlightId, onClauseClick }: SourceClausesProps) {
  if (clauses.length === 0) {
    return (
      <div
        style={{
          padding: '32px 20px',
          textAlign: 'center',
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '11px',
          color: '#999990',
        }}
      >
        NO SOURCE CLAUSES YET.
        <br />
        ASK A QUESTION FIRST.
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono-var), Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: '#999990',
          padding: '12px 16px',
          borderBottom: '1px solid #E0E0D8',
          textTransform: 'uppercase',
        }}
      >
        SOURCE CLAUSES
      </div>
      {clauses.map((clause, i) => (
        <div
          key={clause.id}
          onClick={() => onClauseClick?.(clause.id)}
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #E0E0D8',
            borderLeft: `3px solid ${clause.id === highlightId ? '#7B5EA7' : 'transparent'}`,
            background: clause.id === highlightId ? '#F0EBFF' : '#FFFFFF',
            cursor: 'crosshair',
            transition: 'all 200ms ease',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#7B5EA7',
              marginBottom: '6px',
            }}
          >
            CLAUSE [{clause.chunkIndex}]
          </div>
          <p
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              color: '#0A0A0A',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {clause.clauseText}
          </p>
        </div>
      ))}
    </div>
  )
}
