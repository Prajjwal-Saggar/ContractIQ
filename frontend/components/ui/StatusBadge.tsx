type ContractStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED'

const STATUS_MAP: Record<ContractStatus, { label: string; bg: string; text: string }> = {
  READY:      { label: 'READY',      bg: '#C8FF00', text: '#0A0A0A' },
  PROCESSING: { label: 'PROCESSING', bg: '#7B5EA7', text: '#FFFFFF' },
  FAILED:     { label: 'FAILED',     bg: '#FF3333', text: '#FFFFFF' },
  UPLOADED:   { label: 'UPLOADED',   bg: '#E0E0D8', text: '#0A0A0A' },
}

interface StatusBadgeProps {
  status: ContractStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { label, bg, text } = STATUS_MAP[status] ?? STATUS_MAP.UPLOADED

  return (
    <span
      className="status-chip"
      style={{
        backgroundColor: bg,
        color: text,
        fontSize: size === 'sm' ? '9px' : '10px',
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
      }}
    >
      {label}
    </span>
  )
}
