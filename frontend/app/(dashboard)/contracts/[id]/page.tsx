'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, RefreshCw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useContract, useContractClauses, useAnalyseRisk, useDeleteContract } from '@/hooks/useContracts'
import StatusBadge from '@/components/ui/StatusBadge'
import ClauseList from '@/components/contracts/ClauseList'
import RiskBadge from '@/components/contracts/RiskBadge'
import { formatDate } from '@/lib/utils'

type TabType = 'flagged' | 'all'

export default function ContractDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const id       = params.id as string

  const { data: contract, isLoading, refetch } = useContract(id)
  const { data: allClauses, refetch: refetchClauses } = useContractClauses(id)
  const analyseRisk    = useAnalyseRisk()
  const deleteContract = useDeleteContract()

  const [tab, setTab] = useState<TabType>('flagged')
  const [isAnalysing, setIsAnalysing] = useState(false)

  const handleAnalyse = async () => {
    setIsAnalysing(true)
    try {
      await analyseRisk.mutateAsync(id)
      toast.success('RISK SCAN COMPLETE >')
      await Promise.all([refetch(), refetchClauses()])
    } catch {
      toast.error('ANALYSIS FAILED')
    } finally {
      setIsAnalysing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('DELETE THIS CONTRACT? IRREVERSIBLE.')) return
    try {
      await deleteContract.mutateAsync(id)
      toast.success('CONTRACT PURGED >')
      router.push('/contracts')
    } catch {
      toast.error('DELETE FAILED')
    }
  }

  const flaggedClauses = contract?.flaggedClauses ?? []
  const displayedClauses = tab === 'flagged' ? flaggedClauses : (allClauses ?? [])

  if (isLoading) {
    return (
      <div
        style={{
          padding: '48px',
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#999990',
        }}
      >
        LOADING CONTRACT_<span className="blink">|</span>
      </div>
    )
  }

  if (!contract) {
    return (
      <div style={{ padding: '48px' }}>
        <div
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: '64px',
            color: '#E0E0D8',
          }}
        >
          /404
        </div>
        <div
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '12px',
            color: '#999990',
          }}
        >
          CONTRACT NOT FOUND
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Section tag */}
      <div className="section-tag" style={{ marginBottom: '12px' }}>
        /04 CONTRACT ANALYSIS
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '24px',
          borderBottom: '1px solid #E0E0D8',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: 'clamp(24px, 3vw, 36px)',
              letterSpacing: '0.02em',
              color: '#0A0A0A',
              marginBottom: '8px',
              wordBreak: 'break-all',
            }}
          >
            {contract.originalFileName}
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={contract.status} />
            <span
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                color: '#999990',
              }}
            >
              UPLOADED {formatDate(contract.uploadedAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={handleAnalyse}
            disabled={isAnalysing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isAnalysing ? '#555550' : '#0A0A0A',
              color: '#F5F5F0',
              border: 'none',
              padding: '10px 20px',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'crosshair',
              transition: 'background 200ms ease',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              if (!isAnalysing) (e.currentTarget as HTMLElement).style.background = '#7B5EA7'
            }}
            onMouseLeave={(e) => {
              if (!isAnalysing) (e.currentTarget as HTMLElement).style.background = '#0A0A0A'
            }}
          >
            {isAnalysing ? (
              <>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                ANALYSING...
              </>
            ) : (
              'ANALYSE RISK ↗'
            )}
          </button>

          <Link href={`/contracts/${id}/chat`}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: '#0A0A0A',
                border: '1px solid #0A0A0A',
                padding: '10px 20px',
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'crosshair',
                transition: 'all 200ms ease',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = '#0A0A0A'
                el.style.color = '#F5F5F0'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = '#0A0A0A'
              }}
            >
              <MessageSquare size={13} />
              ASK AI →
            </button>
          </Link>

          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF3333',
              cursor: 'crosshair',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              padding: '10px 0',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <Trash2 size={13} />
            DELETE
          </button>
        </div>
      </div>

      {/* Analyse in-progress banner */}
      {isAnalysing && (
        <div
          style={{
            background: '#0A0A0A',
            padding: '16px 20px',
            marginBottom: '24px',
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '12px',
            color: '#C8FF00',
            letterSpacing: '0.05em',
          }}
        >
          &gt; SENDING TO AI MODEL_<span className="blink">|</span>
          &nbsp;&nbsp;THIS MAY TAKE 30-60 SECONDS. PLEASE WAIT.
        </div>
      )}

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
          border: '1px solid #0A0A0A',
          marginBottom: '32px',
        }}
      >
        {[
          { label: 'TOTAL CLAUSES', value: contract.clauseCount ?? '—', color: '#0A0A0A' },
          { label: 'HIGH RISK',     value: contract.highRiskCount ?? '—',   color: '#FF3333' },
          { label: 'MEDIUM RISK',   value: contract.mediumRiskCount ?? '—', color: '#FF9900' },
        ].map(({ label, value, color }, i) => (
          <div
            key={label}
            style={{
              padding: '20px 24px',
              borderRight: i < 2 ? '1px solid #0A0A0A' : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#999990',
                marginBottom: '6px',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                fontSize: '36px',
                color,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #0A0A0A',
          marginBottom: '24px',
        }}
      >
        {(['flagged', 'all'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 24px',
              background: tab === t ? '#0A0A0A' : 'transparent',
              color: tab === t ? '#F5F5F0' : '#999990',
              border: 'none',
              fontFamily: 'var(--font-mono-var), Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              cursor: 'crosshair',
              transition: 'all 200ms ease',
              textTransform: 'uppercase',
            }}
          >
            {t === 'flagged'
              ? `FLAGGED CLAUSES [${flaggedClauses.length}]`
              : `ALL CLAUSES [${allClauses?.length ?? 0}]`}
          </button>
        ))}
      </div>

      {/* Clause list */}
      <ClauseList clauses={displayedClauses} />

      {/* Summary */}
      {contract.summary && (
        <div
          style={{
            marginTop: '32px',
            border: '1px solid #E0E0D8',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono-var), Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#999990',
              marginBottom: '12px',
            }}
          >
            AI SUMMARY
          </div>
          <p
            style={{
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '14px',
              color: '#0A0A0A',
              lineHeight: 1.7,
            }}
          >
            {contract.summary}
          </p>
        </div>
      )}
    </div>
  )
}
