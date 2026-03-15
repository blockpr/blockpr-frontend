'use client'

import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useThemeStore, type Theme } from '@/stores/themeStore'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/emissions': 'Emisiones',
  '/dashboard/api-keys': 'API Keys',
  '/dashboard/profile': 'Perfil',
}

function getTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname]
  if (pathname.startsWith('/dashboard/emissions/')) return 'Detalle de emisión'
  return 'Dashboard'
}

const THEME_OPTIONS: { value: Theme; icon: React.ReactNode }[] = [
  {
    value: 'dark',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    value: 'system',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    value: 'light',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
]

function ThemeSwitch({ isLight }: { isLight: boolean }) {
  const { theme, setTheme } = useThemeStore()
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const activeIndex = THEME_OPTIONS.findIndex((o) => o.value === theme)
    const btn = btnRefs.current[activeIndex]
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [theme])

  return (
    <div className={`relative flex items-center p-0.5 rounded-[6px] ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
      {indicator.width > 0 && (
        <span
          className={`absolute top-0.5 bottom-0.5 rounded-[4px] transition-all duration-200 ease-out pointer-events-none ${isLight ? 'bg-black' : 'bg-white'}`}
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {THEME_OPTIONS.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => { btnRefs.current[i] = el }}
          onClick={() => setTheme(opt.value)}
          className={`relative z-10 px-2.5 py-1.5 rounded-[4px] transition-colors duration-150 ${
            theme === opt.value
              ? isLight ? 'text-white' : 'text-black'
              : isLight ? 'text-black/30 hover:text-black/60' : 'text-white/50 hover:text-white/80'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { theme } = useThemeStore()
  const isLight = theme === 'light'
  const color = isLight ? '#1a1a22' : '#ffffff'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dotsColor = isLight ? '#1a1a22' : '#ffffff'
  const popoverBg = isLight ? 'bg-white border-gray-200' : 'bg-black border-[var(--color-border)]'
  const textColor = isLight ? 'text-[#1a1a22]' : 'text-white'
  const hoverBg = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
  const dividerColor = isLight ? 'border-gray-200' : 'border-[var(--color-border)]'

  return (
    <header className="shrink-0">
      <div className="h-16 flex items-center justify-center px-8 bg-[var(--color-surface)] relative">
        <h1 className="text-base font-normal" style={{ color }}>
          {getTitle(pathname)}
        </h1>

        <div ref={menuRef} className="absolute right-8">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded hover:bg-[var(--color-card-hover)] transition-all duration-300"
            style={{ color: dotsColor }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className={`absolute right-0 top-full mt-2 z-50 w-64 border rounded-[6px] py-1 shadow-xl ${popoverBg}`}>
              {/* Tema */}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className={`text-sm ${textColor}`}>Tema</span>
                <ThemeSwitch isLight={isLight} />
              </div>

              <div className={`my-1 border-t ${dividerColor}`} />

              <button
                onClick={() => setMenuOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm ${textColor} ${hoverBg} transition-colors`}
              >
                <span>Documentación</span>
                <svg className="w-5 h-5 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm ${textColor} ${hoverBg} transition-colors`}
              >
                <span>Feedback</span>
                <div className="relative shrink-0">
                  <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 13.5s.75 2.25 3.75 2.25 3.75-2.25 3.75-2.25" />
                    <path strokeLinecap="round" d="M9.75 10.5h.008M14.25 10.5h.008" strokeWidth={2} />
                  </svg>
                  <span className="absolute -top-1 -right-1 text-[11px] font-bold leading-none opacity-70">+</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-[var(--color-border)]" />
    </header>
  )
}
