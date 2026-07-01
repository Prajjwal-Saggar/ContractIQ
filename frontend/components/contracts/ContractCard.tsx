'use client'

import Link from 'next/link'
import { FileText, Trash2, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Contract } from '@/types'

interface ContractCardProps {
  contract: Contract
  onDelete?: (id: number) => void
  onAnalyse?: (id: number) => void
}

export default function ContractCard({ contract, onDelete, onAnalyse }: ContractCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #0A0A0A',
        background: '#FFFFFF',
        transition: 'background 200ms ease',
        cursor: 'crosshair',
        flexWrap: 'wrap',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F0F0E8')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#FFFFFF')}
    >
      {/* Icon + name */}
      <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <FileText size={20} style={{ color: '#7B5EA7', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0A0A0A',
              wordBreak: 'break-word',
            }}
          >
            {contract.originalFileName}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#999990',
              marginTop: '4px',
            }}
          >
            {formatDate(contract.uploadedAt)}
          </div>
        </div>
      </div>

      {/* Status + counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '0 0 auto' }}>
        <StatusBadge status={contract.status} />

        {contract.clauseCount !== null && (
          <span
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#555550',
            }}
          >
            {contract.clauseCount} clauses
          </span>
        )}

        {contract.riskFlagCount !== null && contract.riskFlagCount > 0 && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#FF3333',
            }}
          >
            <AlertTriangle size={12} />
            {contract.riskFlagCount}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '0 0 auto' }}>
        <Link href={`/contracts/${contract.id}`}>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#0A0A0A',
              cursor: 'crosshair',
              padding: '4px 0',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#7B5EA7')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#0A0A0A')}
          >
            OPEN →
          </button>
        </Link>

        {contract.status === 'UPLOADED' && (
          <button
            onClick={() => onAnalyse?.(contract.id)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#7B5EA7',
              cursor: 'crosshair',
              padding: '4px 0',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#0A0A0A')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#7B5EA7')}
          >
            ANALYSE
          </button>
        )}

        <button
          onClick={() => onDelete?.(contract.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FF3333',
            cursor: 'crosshair',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          title="Delete contract"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
