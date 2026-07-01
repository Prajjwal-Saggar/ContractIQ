'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface ContractUploadProps {
  onUpload: (file: File) => void
  isUploading: boolean
  uploadSteps: { label: string; done: boolean }[]
}

export default function ContractUpload({
  onUpload,
  isUploading,
  uploadSteps,
}: ContractUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const clearFile = () => setSelectedFile(null)

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          minHeight: '240px',
          border: dragging ? '2px solid #7B5EA7' : '2px dashed #0A0A0A',
          background: dragging ? '#F0EBFF' : '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'crosshair',
          transition: 'all 200ms ease',
          position: 'relative',
          padding: '40px',
        }}
        onClick={() => !selectedFile && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <div style={{ textAlign: 'center' }}>
            <FileText size={40} style={{ color: '#7B5EA7', marginBottom: '12px' }} />
            <div
              style={{
                fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0A0A0A',
                marginBottom: '4px',
              }}
            >
              {selectedFile.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                color: '#999990',
              }}
            >
              {formatFileSize(selectedFile.size)}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFile()
              }}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#FF3333',
                cursor: 'crosshair',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                margin: '12px auto 0',
              }}
            >
              <X size={12} />
              CLEAR FILE
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Upload
              size={40}
              style={{
                color: dragging ? '#7B5EA7' : '#E0E0D8',
                marginBottom: '16px',
                transition: 'color 200ms ease',
              }}
            />
            <div
              style={{
                fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                fontSize: '36px',
                letterSpacing: '0.05em',
                color: dragging ? '#7B5EA7' : '#0A0A0A',
                marginBottom: '8px',
                transition: 'color 200ms ease',
              }}
            >
              {dragging ? 'RELEASE TO UPLOAD' : 'DROP PDF HERE'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono-var), Space Mono, monospace',
                fontSize: '12px',
                color: '#999990',
                letterSpacing: '0.1em',
              }}
            >
              OR CLICK TO SELECT
            </div>
          </div>
        )}
      </div>

      {/* Upload button */}
      {selectedFile && !isUploading && (
        <button
          onClick={() => onUpload(selectedFile)}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0A0A0A',
            color: '#F5F5F0',
            border: 'none',
            padding: '16px 32px',
            fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'crosshair',
            transition: 'background 200ms ease',
            width: '100%',
            justifyContent: 'center',
            borderRadius: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = '#7B5EA7')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = '#0A0A0A')
          }
        >
          INITIATE PROCESSING ↗
        </button>
      )}

      {/* Terminal progress */}
      {isUploading && uploadSteps.length > 0 && (
        <div
          style={{
            marginTop: '24px',
            background: '#0A0A0A',
            padding: '24px',
            border: '1px solid #333',
          }}
        >
          {uploadSteps.map((step, i) => (
            <div
              key={i}
              className="terminal-line"
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '12px',
                color: step.done ? '#C8FF00' : '#999990',
                marginBottom: '8px',
                animationDelay: `${i * 0.5}s`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{step.done ? '[✓]' : '[●]'}</span>
              <span>{step.label}</span>
              {!step.done && i === uploadSteps.filter((s) => s.done).length && (
                <span className="blink">_</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
