'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useContracts, useDeleteContract, useAnalyseRisk } from '@/hooks/useContracts'
import ContractCard from '@/components/contracts/ContractCard'

export default function ContractsPage() {
  const { data: contracts, isLoading } = useContracts()
  const deleteContract = useDeleteContract()
  const analyseRisk    = useAnalyseRisk()
  const [search, setSearch] = useState('')

  const filtered = (contracts ?? []).filter((c) =>
    c.originalFileName.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!confirm('DELETE THIS CONTRACT? THIS CANNOT BE UNDONE.')) return
    try {
      await deleteContract.mutateAsync(id)
      toast.success('CONTRACT PURGED >')
    } catch {
      toast.error('DELETE FAILED')
    }
  }

  const handleAnalyse = async (id: number) => {
    try {
      toast('SENDING TO AI MODEL_', { icon: '⚙' })
      await analyseRisk.mutateAsync(id)
      toast.success('RISK SCAN COMPLETE >')
    } catch {
      toast.error('ANALYSIS FAILED')
    }
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div className="section-tag" style={{ marginBottom: '8px' }}>
            /02 CONTRACT ARCHIVE
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '36px',
              letterSpacing: '0.03em',
              color: '#0A0A0A',
            }}
          >
            ALL CONTRACTS
          </h1>
        </div>

        <Link href="/contracts/upload">
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0A0A0A',
              color: '#F5F5F0',
              border: 'none',
              padding: '12px 24px',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'crosshair',
              transition: 'background 200ms ease',
              borderRadius: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#7B5EA7')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#0A0A0A')
            }
          >
            UPLOAD NEW +
          </button>
        </Link>
      </div>

      {/* Search bar */}
      <div
        style={{
          position: 'relative',
          marginBottom: '24px',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999990',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH CONTRACTS_"
          style={{
            width: '100%',
            border: '1px solid #0A0A0A',
            borderRadius: 0,
            background: '#FFFFFF',
            padding: '14px 16px 14px 44px',
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.05em',
            outline: 'none',
            color: '#0A0A0A',
          }}
          onFocus={(e) => ((e.target as HTMLElement).style.border = '2px solid #7B5EA7')}
          onBlur={(e) => ((e.target as HTMLElement).style.border = '1px solid #0A0A0A')}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '12px',
            color: '#999990',
            border: '1px solid #E0E0D8',
          }}
        >
          LOADING ARCHIVE_<span className="blink">|</span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: '80px 24px',
            textAlign: 'center',
            border: '1px solid #0A0A0A',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
              fontSize: '96px',
              color: '#E0E0D8',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            /∅
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '13px',
              color: '#999990',
              marginBottom: '24px',
            }}
          >
            {search ? 'NO CONTRACTS MATCH SEARCH QUERY' : 'NO CONTRACTS IN SYSTEM'}
          </div>
          {!search && (
            <Link href="/contracts/upload">
              <button
                style={{
                  background: '#0A0A0A',
                  color: '#F5F5F0',
                  border: 'none',
                  padding: '12px 24px',
                  fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'crosshair',
                  transition: 'background 200ms ease',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#7B5EA7')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#0A0A0A')
                }
              >
                UPLOAD FIRST CONTRACT ↗
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid #0A0A0A' }}>
          {filtered.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onDelete={handleDelete}
              onAnalyse={handleAnalyse}
            />
          ))}
        </div>
      )}

      {/* Count */}
      {!isLoading && filtered.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#999990',
          }}
        >
          {filtered.length} CONTRACT{filtered.length !== 1 ? 'S' : ''} IN ARCHIVE
        </div>
      )}
    </div>
  )
}
