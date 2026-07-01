'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Upload, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getCurrentTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':            'OVERVIEW',
  '/contracts':            'CONTRACT ARCHIVE',
  '/contracts/upload':     'UPLOAD DOCUMENT',
  '/analytics':            'RISK INTELLIGENCE',
}

const NAV_ITEMS = [
  { label: 'OVERVIEW',      href: '/dashboard',        icon: LayoutDashboard },
  { label: 'CONTRACTS',     href: '/contracts',         icon: FileText        },
  { label: 'UPLOAD',        href: '/contracts/upload',  icon: Upload          },
  { label: 'RISK ANALYSIS', href: '/analytics',         icon: BarChart3       },
]

function MobileNav({
  open,
  onClose,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  onLogout: () => void
}) {
  const pathname = usePathname()
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#F5F5F0', cursor: 'crosshair' }}>
          <X size={24} />
        </button>
      </div>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} onClick={onClose}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 0',
                borderBottom: '1px solid #222',
                color: isActive ? '#C8FF00' : '#999990',
                cursor: 'crosshair',
              }}
            >
              <Icon size={18} />
              <span
                style={{
                  fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                  fontSize: '28px',
                  letterSpacing: '0.05em',
                }}
              >
                {label}
              </span>
            </div>
          </Link>
        )
      })}
      <button
        onClick={onLogout}
        style={{
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#FF3333',
          fontFamily: 'var(--font-grotesk-var), Space Grotesk, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'crosshair',
          padding: 0,
        }}
      >
        <LogOut size={16} />
        TERMINATE SESSION
      </button>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth(true)
  const router   = useRouter()
  const pathname = usePathname()
  const [time, setTime] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setTime(getCurrentTime())
    const interval = setInterval(() => setTime(getCurrentTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('SESSION TERMINATED >')
  }

  // Determine page title
  const pageTitle = (() => {
    if (pathname.includes('/chat')) return 'CONTRACT CHAT'
    if (pathname.match(/\/contracts\/\d+$/)) return 'CONTRACT ANALYSIS'
    return PAGE_TITLES[pathname] ?? 'CONTRACTIQ'
  })()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F5F0',
          fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#999990',
          letterSpacing: '0.1em',
        }}
      >
        AUTHENTICATING_<span className="blink">|</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F0' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hide-mobile"
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
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #222' }}>
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email ?? ''}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
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
                      const el = e.currentTarget as HTMLElement
                      el.style.background = '#1A1A1A'
                      el.style.color = '#FFFFFF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                      el.style.color = '#999990'
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
        <div style={{ padding: '20px', borderTop: '1px solid #222' }}>
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'crosshair',
              padding: 0,
              letterSpacing: '0.05em',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <LogOut size={13} />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} onLogout={handleLogout} />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          marginLeft: '240px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
        className="dashboard-main"
      >
        {/* Top bar */}
        <header
          style={{
            height: '48px',
            borderBottom: '1px solid #E0E0D8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: '#F5F5F0',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'crosshair', color: '#0A0A0A' }}
            >
              <Menu size={20} />
            </button>
            <span
              style={{
                fontFamily: 'var(--font-bebas), Bebas Neue, cursive',
                fontSize: '22px',
                letterSpacing: '0.05em',
                color: '#0A0A0A',
              }}
            >
              {pageTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-ibm-var), IBM Plex Mono, monospace',
                fontSize: '11px',
                color: '#999990',
              }}
            >
              {time}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
