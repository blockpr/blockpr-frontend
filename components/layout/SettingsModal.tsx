'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

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

function PerfilContent() {
  const { data: session } = useSession()
  const name = session?.user?.name ?? 'AutoCheck SA'
  const email = session?.user?.email ?? 'demo@blockpr.io'
  const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
  const disabledClass = "w-full px-3 py-2 rounded-lg bg-[var(--color-base)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] cursor-not-allowed select-none"

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xl font-semibold">
            {initials}
          </div>
          <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{email}</p>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Campos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Nombre
          </label>
          <input type="text" defaultValue={name} className={inputClass} />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Email
            <span className="ml-1.5 text-[var(--color-text-muted)] font-normal">· no editable</span>
          </label>
          <div className={disabledClass}>{email}</div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Domicilio
          </label>
          <input type="text" placeholder="Av. Corrientes 1234, CABA" className={inputClass} />
        </div>

        <div className="col-span-1">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Celular
          </label>
          <input type="tel" placeholder="+54 9 11 0000-0000" className={inputClass} />
        </div>
      </div>

      <button className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium transition-colors">
        Guardar cambios
      </button>
    </div>
  )
}

function SeguridadContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Contraseña actual
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>

      <button className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium transition-colors">
        Actualizar contraseña
      </button>

      <div className="h-px bg-[var(--color-border)]" />

      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
          Autenticación de dos factores
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          Añade una capa extra de seguridad a tu cuenta.
        </p>
        <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors">
          Activar 2FA
        </button>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Dispositivos conectados */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
          Dispositivos conectados
        </p>
        <div className="space-y-2">
          {[
            {
              name: 'MacBook Pro',
              os: 'macOS 15 · Safari 18',
              location: 'Buenos Aires, Argentina',
              lastSeen: 'Ahora',
              current: true,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              ),
            },
            {
              name: 'iPhone 16 Pro',
              os: 'iOS 18 · Chrome 131',
              location: 'Buenos Aires, Argentina',
              lastSeen: 'Hace 2 horas',
              current: false,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
                </svg>
              ),
            },
            {
              name: 'Windows PC',
              os: 'Windows 11 · Edge 131',
              location: 'Córdoba, Argentina',
              lastSeen: 'Hace 5 días',
              current: false,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              ),
            },
          ].map((device) => (
            <div
              key={device.name}
              className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
            >
              <div className="text-[var(--color-text-muted)] shrink-0">
                {device.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">{device.name}</p>
                  {device.current && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-success-muted)] text-[var(--color-success)] font-medium">
                      Este dispositivo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{device.os} · {device.location}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Último acceso: {device.lastSeen}</p>
              </div>
              {!device.current && (
                <button className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                  Cerrar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SubscripcionContent() {
  return (
    <div className="space-y-6">
      {/* Plan actual */}
      <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[var(--color-accent)]">Plan Pro</span>
          <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full">Activo</span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">USD $49 / mes · Renueva el 1 abr 2026</p>
      </div>

      {/* Uso */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Certificados emitidos</span>
          <span className="text-xs text-[var(--color-text-muted)]">1.847 / 5.000</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-card)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: '37%' }} />
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium transition-colors">
          Mejorar plan
        </button>
        <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors">
          Ver facturas
        </button>
      </div>
    </div>
  )
}

function ConfiguracionContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { label: 'Notificaciones por email', description: 'Recibir alertas de emisiones y verificaciones' },
          { label: 'Resumen semanal', description: 'Email con el resumen de actividad de la semana' },
          { label: 'Alertas de seguridad', description: 'Notificar accesos desde nuevos dispositivos' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
            </div>
            <button className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-[var(--color-accent)] transition-colors focus:outline-none">
              <span className="translate-x-4 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      <div>
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">Zona horaria</p>
        <select className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors">
          <option>America/Argentina/Buenos_Aires (UTC-3)</option>
          <option>America/New_York (UTC-5)</option>
          <option>Europe/Madrid (UTC+1)</option>
        </select>
      </div>
    </div>
  )
}

function SectionContent({ section }: { section: SettingsSection }) {
  switch (section) {
    case 'perfil': return <PerfilContent />
    case 'seguridad': return <SeguridadContent />
    case 'subscripcion': return <SubscripcionContent />
    case 'configuracion': return <ConfiguracionContent />
  }
}

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
            onClick={() => { handleClose(); setTimeout(() => signOut({ callbackUrl: '/login' }), 300) }}
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
