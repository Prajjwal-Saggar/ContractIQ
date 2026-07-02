'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatMessageItem from './ChatMessage'
import SourceClauses from './SourceClauses'
import { protectedApi } from '@/lib/axios'
import type { ChatMessage, Clause } from '@/types'

const SUGGESTED_QUESTIONS = [
  'What are the payment terms?',
  'Any auto-renewal clauses?',
  'What is the notice period?',
  'Who owns the IP?',
]

interface ChatInterfaceProps {
  contractId: number
  contractName: string
  history: ChatMessage[]
}

export default function ChatInterface({
  contractId,
  contractName,
  history,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(history)
  const [question, setQuestion]   = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [highlightClauseId, setHighlightClauseId] = useState<number | null>(null)
  const [sourceClauses, setSourceClauses] = useState<Clause[]>([])
  const [showDrawer, setShowDrawer] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendQuestion = async (q: string) => {
    if (!q.trim() || isLoading) return
    setIsLoading(true)
    setQuestion('')

    try {
      const { data } = await protectedApi.post<ChatMessage>(
        '/api/chat/ask',
        { contractId, question: q },
        { timeout: 60_000 }
      )
      setMessages((prev) => [...prev, data])
      setSourceClauses(data.sourceClauses ?? [])
    } catch (err: unknown) {
      // axios interceptor already toasts for known statuses (429, 502, 503…)
      // only show a fallback for truly unknown errors
      const anyErr = err as { response?: unknown; normalizedMessage?: string }
      if (!anyErr?.response) {
        toast.error('QUERY FAILED. RETRY.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClauseClick = (clauseId: number) => {
    setHighlightClauseId(clauseId)
    // Scroll to clause in source panel
    const el = document.getElementById(`source-clause-${clauseId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* Chat panel */}
      <div
        style={{
          flex: '1 1 65%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRight: '1px solid var(--border-light)',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-light)',
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>CONTRACT AI / {contractName}</span>
          <button
            className="show-mobile"
            onClick={() => setShowDrawer((v) => !v)}
            style={{
              background: 'none',
              border: '1px solid var(--border-light)',
              padding: '4px 10px',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '10px',
              cursor: 'crosshair',
              color: 'var(--text-secondary)',
            }}
          >
            {showDrawer ? 'HIDE' : 'VIEW SOURCE CLAUSES ↑'}
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '60px',
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>?</div>
              ASK ANYTHING ABOUT THIS CONTRACT
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              onClauseClick={handleClauseClick}
            />
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  padding: '14px 18px',
                  fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                &gt; PROCESSING QUERY_<span className="blink">|</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendQuestion(q)}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border-light)',
                padding: '4px 12px',
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '11px',
                cursor: 'crosshair',
                color: 'var(--text-secondary)',
                transition: 'all 200ms ease',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--primary)'
                el.style.color = 'var(--primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-light)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            display: 'flex',
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendQuestion(question)}
            placeholder="ASK ABOUT THIS CONTRACT_"
            disabled={isLoading}
            style={{
              flex: 1,
              border: 'none',
              borderRight: '1px solid var(--border)',
              padding: '16px 20px',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '14px',
              background: 'var(--surface)',
              color: 'var(--text)',
              outline: 'none',
              borderRadius: 0,
              transition: 'background 300ms ease',
            }}
          />
          <button
            onClick={() => sendQuestion(question)}
            disabled={isLoading || !question.trim()}
            style={{
              padding: '16px 24px',
              background: isLoading ? 'var(--text-secondary)' : 'var(--text)',
              color: 'var(--bg)',
              border: 'none',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'crosshair',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 200ms ease',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'var(--primary)'
            }}
            onMouseLeave={(e) => {
              if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'var(--text)'
            }}
          >
            TRANSMIT
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* Source clauses panel — desktop */}
      <div
        className="hide-mobile"
        style={{
          flex: '0 0 35%',
          height: '100%',
          overflowY: 'auto',
          background: 'var(--hover-bg)',
          border: '1px solid var(--border-light)',
        }}
      >
        <SourceClauses
          clauses={sourceClauses}
          highlightId={highlightClauseId}
          onClauseClick={setHighlightClauseId}
        />
      </div>

      {/* Mobile drawer */}
      {showDrawer && (
        <div
          className="show-mobile"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50vh',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            zIndex: 200,
            overflowY: 'auto',
          }}
        >
          <SourceClauses
            clauses={sourceClauses}
            highlightId={highlightClauseId}
            onClauseClick={setHighlightClauseId}
          />
        </div>
      )}
    </div>
  )
}
