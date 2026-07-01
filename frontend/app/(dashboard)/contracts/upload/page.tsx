'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ContractUpload from '@/components/contracts/ContractUpload'
import { protectedApi } from '@/lib/axios'
import type { ContractUploadResponse } from '@/types'

const UPLOAD_STEPS = [
  'UPLOADING FILE...',
  'EXTRACTING TEXT...',
  'GENERATING EMBEDDINGS...',
  'STORING VECTORS...',
  'PROCESSING COMPLETE',
]

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [steps, setSteps] = useState<{ label: string; done: boolean }[]>([])

  const handleUpload = async (file: File) => {
    setIsUploading(true)

    // Simulate step progression
    const stepState = UPLOAD_STEPS.map((label) => ({ label, done: false }))
    setSteps([...stepState])

    // Reveal steps one by one (visual feedback while actual upload happens)
    const intervals: ReturnType<typeof setTimeout>[] = []
    UPLOAD_STEPS.slice(0, -1).forEach((_, i) => {
      const id = setTimeout(() => {
        setSteps((prev) => {
          const next = [...prev]
          if (i > 0) next[i - 1] = { ...next[i - 1], done: true }
          return next
        })
      }, i * 800)
      intervals.push(id)
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await protectedApi.post<ContractUploadResponse>(
        '/api/contracts/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60_000,
        }
      )

      // Clear intervals and mark all done
      intervals.forEach(clearTimeout)
      setSteps(UPLOAD_STEPS.map((label) => ({ label, done: true })))

      toast.success('CONTRACT INDEXED >')

      setTimeout(() => {
        router.push(`/contracts/${data.id}`)
      }, 800)
    } catch {
      intervals.forEach(clearTimeout)
      setIsUploading(false)
      setSteps([])
      toast.error('UPLOAD FAILED. RETRY.')
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      {/* Header */}
      <div className="section-tag" style={{ marginBottom: '12px' }}>
        /03 UPLOAD DOCUMENT
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
          fontSize: '36px',
          letterSpacing: '0.03em',
          color: '#0A0A0A',
          marginBottom: '32px',
        }}
      >
        UPLOAD CONTRACT
      </h1>

      {/* Requirements */}
      <div
        style={{
          background: '#0A0A0A',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          'FORMAT: PDF ONLY',
          'MAX SIZE: 20MB',
          'PROCESSING: < 60s',
        ].map((req) => (
          <span
            key={req}
            style={{
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '11px',
              color: '#C8FF00',
              letterSpacing: '0.1em',
            }}
          >
            {req}
          </span>
        ))}
      </div>

      <ContractUpload
        onUpload={handleUpload}
        isUploading={isUploading}
        uploadSteps={steps}
      />
    </div>
  )
}
