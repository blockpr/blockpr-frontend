'use client'

import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { SettingsModal, type SettingsSection } from '@/components/layout/SettingsModal'
import { PanelLeftClose } from 'lucide-react'

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

function UserAvatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return <img src={image} alt={name ?? ''} className="w-8 h-8 rounded-full object-cover shrink-0" />
  }
  const initials = name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'
  return (
    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-medium shrink-0">
      {initials}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)
  const [indicator, setIndicator] = useState({ top: 0, height: 0, left: 0, width: 0 })
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const navRef = useRef<HTMLElement>(null)
  const asideRef = useRef<HTMLElement>(null)
  const collapsedRef = useRef(collapsed)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Slide vertically on route change (nav width is stable)
  useLayoutEffect(() => {
    measure(collapsedRef.current)
    setIndicatorVisible(true)
  }, [pathname])

  // Hide indicator during sidebar width transition, remeasure after it ends
  useEffect(() => {
    collapsedRef.current = collapsed
    setIndicatorVisible(false)
    const aside = asideRef.current
    if (!aside) return
    function onTransitionEnd(e: TransitionEvent) {
      if (e.propertyName !== 'width') return
      measure(collapsedRef.current)
      setIndicatorVisible(true)
    }
    aside.addEventListener('transitionend', onTransitionEnd)
    return () => aside.removeEventListener('transitionend', onTransitionEnd)
  }, [collapsed])

  const handleMouseEnter = useCallback(() => {
    if (!collapsed) return
    hoverTimer.current = setTimeout(() => setCollapsed(false), 1000)
  }, [collapsed])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }, [])

  const handleSidebarClick = useCallback(() => {
    if (collapsed) setCollapsed(false)
  }, [collapsed])

  return (
    <>
      <aside
        ref={asideRef}
        className={cn(
          'shrink-0 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl my-3 ml-3 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden',
          collapsed ? 'w-16 cursor-pointer' : 'w-64'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSidebarClick}
      >
        {/* Logo */}
        <div className={cn('h-16 flex items-center shrink-0', collapsed ? 'justify-center' : 'px-3')}>
          <div className={cn('flex items-center gap-2')}>
            <div className={cn(
              'rounded-lg bg-[var(--color-accent)] flex items-center justify-center shrink-0 transition-all duration-300',
              collapsed ? 'w-9 h-9' : 'w-7 h-7'
            )}>
              <svg className={cn('text-white transition-all duration-300', collapsed ? 'w-5 h-5' : 'w-4 h-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <span className={cn(
              'font-semibold text-[var(--color-text-primary)] tracking-tight whitespace-nowrap transition-opacity duration-200',
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            )}>
              BlockPR
            </span>
          </div>

          {!collapsed && (
            <button
              onClick={(e) => { e.stopPropagation(); setCollapsed(true) }}
              className="ml-auto p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors shrink-0"
              title="Cerrar sidebar"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav ref={navRef} className={cn('relative flex-1 py-3 space-y-2', collapsed ? 'px-1' : 'px-2')}>
          {/* Indicador deslizante */}
          <span
            className="absolute rounded-lg bg-[var(--color-accent-muted)] pointer-events-none"
            style={{
              top: indicator.top,
              height: indicator.height,
              left: indicator.left,
              width: indicator.width,
              opacity: indicatorVisible && indicator.height > 0 ? 1 : 0,
              transition: 'top 220ms ease-out, left 220ms ease-out, width 220ms ease-out, height 220ms ease-out, opacity 150ms ease-out',
            }}
          />

          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={el => { navRefs.current[i] = el }}
              onClick={(e) => collapsed && e.stopPropagation()}
              title={collapsed ? item.label : undefined}
              className={cn(
                'relative z-10 flex items-center rounded-lg text-sm transition-colors',
                collapsed
                  ? 'justify-center py-3 w-full'
                  : 'gap-3 px-3 py-2.5',
                isActive(item.href, item.exact)
                  ? 'text-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              )}
            >
              {item.icon}
              <span className={cn(
                'whitespace-nowrap transition-opacity duration-200',
                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className={cn('py-3', collapsed ? 'flex justify-center px-1' : 'px-2')}>
          {collapsed ? (
            <button
              onClick={(e) => { e.stopPropagation() }}
              title={session?.user?.name ?? 'Perfil'}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:ring-2 hover:ring-[var(--color-accent)]/40 transition-all"
            >
              <UserAvatar name={session?.user?.name} image={session?.user?.image} />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setSettingsSection('perfil') }}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-[10px] bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] border border-[var(--color-border)] transition-colors group text-left"
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
              <svg
                className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
              </svg>
            </button>
          )}
        </div>
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
