'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Upload, BarChart3, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'OVERVIEW',     href: '/dashboard',         icon: LayoutDashboard, symbol: '/' },
  { label: 'CONTRACTS',    href: '/contracts',          icon: FileText,        symbol: '≡' },
  { label: 'UPLOAD',       href: '/contracts/upload',   icon: Upload,          symbol: '↑' },
  { label: 'RISK ANALYSIS',href: '/analytics',          icon: BarChart3,       symbol: '◈' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('SESSION TERMINATED >')
  }

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#0A0A0A',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
      className="hide-mobile"
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid #222',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
            fontSize: '22px',
            letterSpacing: '0.1em',
            color: '#F5F5F0',
          }}
        >
          CONTRACTIQ_
        </div>
        <div
          style={{
            fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
            fontSize: '10px',
            color: '#555550',
            marginTop: '4px',
            letterSpacing: '0.05em',
          }}
        >
          {user?.email ?? 'guest@contractiq.io'}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon, symbol }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: isActive ? '#7B5EA7' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#999990',
                  cursor: 'crosshair',
                  transition: 'background 200ms ease, color 200ms ease',
                  borderLeft: isActive ? '2px solid #C8FF00' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#1A1A1A'
                    ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#999990'
                  }
                }}
              >
                <Icon size={16} />
                <span
                  style={{
                    fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                  }}
                >
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #222',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono-var), Space Mono, monospace',
            fontSize: '9px',
            color: '#555550',
            letterSpacing: '0.1em',
            marginBottom: '6px',
          }}
        >
          LOGGED IN AS
        </div>
        <div
          style={{
            fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
            fontSize: '13px',
            color: '#FFFFFF',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          {user?.name ?? 'Unknown'}
        </div>
        {user?.role && (
          <span
            style={{
              display: 'inline-block',
              background: '#C8FF00',
              color: '#0A0A0A',
              fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '2px 8px',
              marginBottom: '12px',
            }}
          >
            {user.role}
          </span>
        )}
        <div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#FF3333',
              fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'crosshair',
              padding: 0,
              letterSpacing: '0.05em',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <LogOut size={14} />
            TERMINATE SESSION
          </button>
        </div>
      </div>
    </aside>
  )
}
