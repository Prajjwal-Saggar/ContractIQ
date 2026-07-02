import { formatDateTime } from '@/lib/utils'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  onClauseClick?: (clauseId: number) => void
}

export default function ChatMessage({ message, onClauseClick }: ChatMessageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* User question */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            maxWidth: '70%',
            background: 'var(--text)',
            color: 'var(--bg)',
            padding: '14px 18px',
            borderRadius: 0,
            fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {message.question}
        </div>
      </div>

      {/* AI answer */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div
          style={{
            maxWidth: '80%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '16px 18px',
            borderRadius: 0,
            transition: 'background 300ms ease',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--text)',
              marginBottom: '12px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.answer}
          </div>

          {/* Source clause references */}
          {message.sourceClauses?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}
              >
                BASED ON CLAUSES:
              </span>
              {message.sourceClauses.map((clause) => (
                <button
                  key={clause.id}
                  onClick={() => onClauseClick?.(clause.id)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    padding: '2px 8px',
                    fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                    fontSize: '10px',
                    cursor: 'crosshair',
                    transition: 'background 200ms ease, color 200ms ease',
                    borderRadius: 0,
                    color: 'var(--text)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'var(--primary)'
                    el.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'var(--bg)'
                    el.style.color = 'var(--text)'
                  }}
                >
                  [{clause.chunkIndex}]
                </button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div
            style={{
              marginTop: '8px',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}
          >
            {formatDateTime(message.askedAt)}
          </div>
        </div>
      </div>
    </div>
  )
}
