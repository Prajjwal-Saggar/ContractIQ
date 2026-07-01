interface SystemTagProps {
  label: string
  active?: boolean
  color?: string
}

export default function SystemTag({
  label,
  active = true,
  color,
}: SystemTagProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
        fontSize: '11px',
        color: color ?? (active ? '#999990' : '#555550'),
        letterSpacing: '0.05em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{ color: active ? '#00FF88' : '#FF3333', fontSize: '8px' }}>●</span>
      {label}
    </span>
  )
}
