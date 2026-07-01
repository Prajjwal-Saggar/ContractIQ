'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { protectedApi } from '@/lib/axios'
import ChatInterface from '@/components/chat/ChatInterface'
import type { Contract, ChatMessage } from '@/types'

export default function ChatPage() {
  const params = useParams()
  const id     = params.id as string

  const { data: contract } = useQuery<Contract>({
    queryKey: ['contract', id],
    queryFn: async () => {
      const { data } = await protectedApi.get(`/api/contracts/${id}`)
      return data
    },
  })

  const { data: history } = useQuery<ChatMessage[]>({
    queryKey: ['chat-history', id],
    queryFn: async () => {
      const { data } = await protectedApi.get(`/api/chat/history/${id}`)
      return data
    },
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 48px)',
        overflow: 'hidden',
      }}
    >
      {/* Chat top bar */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid #E0E0D8',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: '#F5F5F0',
          flexShrink: 0,
        }}
      >
        <Link href={`/contracts/${id}`}>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'crosshair',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#999990',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0A0A0A')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#999990')}
          >
            <ArrowLeft size={14} />
            BACK TO CONTRACT
          </button>
        </Link>

        <div
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#555550',
            letterSpacing: '0.05em',
          }}
        >
          CHAT / {contract?.originalFileName ?? '...'}
        </div>
      </div>

      {/* Chat interface */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatInterface
          contractId={parseInt(id)}
          contractName={contract?.originalFileName ?? ''}
          history={history ?? []}
        />
      </div>
    </div>
  )
}
