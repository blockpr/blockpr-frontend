'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { authApi } from '@/lib/api'
import { getDeviceInfo } from '@/lib/device-utils'
import SectionContent from './SectionContent'

export type SettingsSection = 'perfil' | 'seguridad' | 'subscripcion' | 'configuracion'

const sections: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
  {
    id: 'perfil',
    label: 'Perfil',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 'subscripcion',
    label: 'Subscripción',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface Props {
  initialSection: SettingsSection
  onClose: () => void
}

export function SettingsModal({ initialSection, onClose }: Props) {
  const [active, setActive] = useState<SettingsSection>(initialSection)
  const [closing, setClosing] = useState(false)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeSection = sections.find((s) => s.id === active)!

  useLayoutEffect(() => {
    const activeIndex = sections.findIndex(s => s.id === active)
    const el = sectionRefs.current[activeIndex]
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight })
  }, [active])

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  async function handleLogout() {
    const { device_name, device_specs } = getDeviceInfo()
    try { await authApi.logout(device_name, device_specs) } catch { /* silent */ }
    handleClose()
    setTimeout(() => signOut({ callbackUrl: '/login' }), 300)
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleOverlay(e: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) handleClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={handleOverlay}
    >
      <div
        ref={modalRef}
        className={`${closing ? 'animate-genie-out' : 'animate-genie'} bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-2xl flex overflow-hidden w-[900px] h-[600px]`}
      >
        {/* Sidebar interna */}
        <div className="w-44 shrink-0 border-r border-[var(--color-border)] flex flex-col py-2">
          <p className="px-4 pt-2 pb-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            Cuenta
          </p>
          <div className="relative flex-1 space-y-2">
            {/* Indicador deslizante */}
            {indicator.height > 0 && (
              <span
                className="absolute left-2 right-2 rounded-lg bg-[var(--color-accent-muted)] transition-all duration-200 ease-out pointer-events-none"
                style={{ top: indicator.top, height: indicator.height }}
              />
            )}
            {sections.map((s, i) => (
              <button
                key={s.id}
                ref={el => { sectionRefs.current[i] = el }}
                onClick={() => setActive(s.id)}
                className={cn(
                  'relative z-10 flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-colors text-left w-[calc(100%-16px)]',
                  active === s.id
                    ? 'text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
          <div className="mx-4 mb-1 h-px bg-[var(--color-border)]" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors text-left w-[calc(100%-16px)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {activeSection.label}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <SectionContent section={active} />
          </div>
        </div>
      </div>
    </div>
  )
}
