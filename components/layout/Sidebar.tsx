'use client'

import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { SettingsModal, type SettingsSection } from '@/components/layout/settings/SettingsModal'
import { useThemeStore } from '@/stores/themeStore'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import UserAvatar from './UserAvatar'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    exact: true,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Emisiones',
    href: '/dashboard/emissions',
    exact: false,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    label: 'API Keys',
    href: '/dashboard/api-keys',
    exact: false,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
]




export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme } = useThemeStore()
  const logoColor = theme === 'light' ? '#1a1a22' : '#ffffff'

  const [collapsed, setCollapsed] = useState(false)
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)

  // Active indicator
  const [indicator, setIndicator] = useState({ top: 0, height: 0, left: 0, width: 0 })
  const [indicatorReady, setIndicatorReady] = useState(false)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const navRef = useRef<HTMLElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  function measure(isCollapsed: boolean) {
    const activeIndex = navItems.findIndex(item => isActive(item.href, item.exact))
    if (activeIndex === -1) return
    const el = navRefs.current[activeIndex]
    const nav = navRef.current
    if (!el || !nav) return
    const navW = nav.offsetWidth
    const indL = isCollapsed ? Math.round((navW - 40) / 2) : el.offsetLeft
    const indW = isCollapsed ? 40 : el.offsetWidth
    setIndicator({ top: el.offsetTop, height: el.offsetHeight, left: indL, width: indW })
  }

  // Remeasure on route change
  useLayoutEffect(() => {
    measure(collapsed)
    setIndicatorReady(true)
  }, [pathname])

  // Hide indicator during width transition, remeasure after
  useEffect(() => {
    setIndicatorReady(false)
    const aside = asideRef.current
    if (!aside) return
    function onEnd(e: TransitionEvent) {
      if (e.propertyName !== 'width') return
      measure(collapsed)
      setIndicatorReady(true)
    }
    aside.addEventListener('transitionend', onEnd)
    return () => aside.removeEventListener('transitionend', onEnd)
  }, [collapsed])

  return (
    <>
      <aside
        ref={asideRef}
        className={cn(
          'shrink-0 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
          collapsed ? 'w-16' : 'w-72'
        )}
      >
        {collapsed ? (
          /* ── COLLAPSED VIEW ── */
          <div className="flex flex-col h-full cursor-pointer" onClick={() => setCollapsed(false)}>
            {/* Logo SVG centrado */}
            <div className="h-16 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: logoColor }}>
                <path d="M100 100V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M100 100L148 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M100 100L52 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                <path d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                <path d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                <path d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                <path d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z" fill="currentColor"/>
              </svg>
            </div>

            <div className="border-b border-[var(--color-border)]" />

            {/* Nav icons */}
            <nav className="flex-1 flex flex-col items-center gap-1 py-4">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      'relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                      active
                        ? 'bg-[var(--color-nav-active-bg)] text-[var(--color-nav-active-text)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
                    )}
                  >
                    {item.icon}
                  </Link>
                )
              })}
            </nav>

            {/* Avatar */}
            <div className="flex justify-center pb-4">
              <button
                title={session?.user?.name ?? 'Perfil'}
                className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-[var(--color-border)] transition-all"
                onClick={e => e.stopPropagation()}
              >
                <UserAvatar name={session?.user?.name} image={session?.user?.image} />
              </button>
            </div>
          </div>
        ) : (
          /* ── EXPANDED VIEW ── */
          <>
            {/* Header: logo + close */}
            <div className="h-16 flex items-center shrink-0 px-3 gap-2">
              <div className="flex items-center gap-2.5 flex-1 min-w-0" style={{ color: logoColor }}>
                <svg className="w-9 h-9 shrink-0" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 100V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M100 100L148 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M100 100L52 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                  <path d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                  <path d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                  <path d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
                  <path d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z" fill="currentColor"/>
                </svg>
                <span className="font-semibold text-base tracking-tight whitespace-nowrap" style={{ color: logoColor }}>
                  unickeys
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="shrink-0 p-1.5 rounded-md transition-colors"
                style={{ color: logoColor }}
                title="Cerrar sidebar"
              >
                <PanelLeftClose className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="border-b border-[var(--color-border)]" />

            {/* Nav */}
            <nav ref={navRef} className="relative flex-1 py-3 space-y-1 px-2">
              <span
                className="absolute rounded-lg pointer-events-none bg-[var(--color-nav-active-bg)]"
                style={{
                  top: indicator.top,
                  height: indicator.height,
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicatorReady && indicator.height > 0 ? 1 : 0,
                  transition: 'top 200ms ease, left 200ms ease, width 200ms ease, opacity 120ms ease',
                }}
              />
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={el => { navRefs.current[i] = el }}
                  className={cn(
                    'relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive(item.href, item.exact)
                      ? 'font-medium text-[var(--color-nav-active-text)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User card */}
            <div className="px-2 py-3">
              <button
                onClick={() => setSettingsSection('perfil')}
                className="w-full flex items-center gap-3 px-3 py-5 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] border border-[var(--color-border)] transition-colors group text-left rounded-[6px]"
              >
                <UserAvatar name={session?.user?.name} image={session?.user?.image} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate leading-none mb-1">
                    {session?.user?.name ?? 'Usuario'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate leading-none">
                    {session?.user?.email ?? ''}
                  </p>
                </div>
                <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
                </svg>
              </button>
            </div>
          </>
        )}
      </aside>

      {settingsSection && (
        <SettingsModal
          initialSection={settingsSection}
          onClose={() => setSettingsSection(null)}
        />
      )}
    </>
  )
}
