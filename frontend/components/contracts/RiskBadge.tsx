import { riskBadgeClass } from '@/lib/utils'

interface RiskBadgeProps {
  level: 'HIGH' | 'MEDIUM' | 'LOW' | null
  size?: 'sm' | 'md'
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  if (!level) return null
  const { bg, text } = riskBadgeClass(level)

  return (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color: text,
        fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
        fontSize: size === 'sm' ? '9px' : '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        borderRadius: 0,
      }}
    >
      {level}
    </span>
  )
}
