'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

type NavItem  = { label: string; href: string; icon: string; desc?: string }
type CaseItem = { label: string; desc: string; href: string; icon: string }
type DropKey  = 'producto' | 'recursos'

const PRODUCTO_ITEMS: NavItem[] = [
  {
    label: 'Certificación digital',
    href: '#certificacion',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    desc: 'Sellado inmutable',
  },
  {
    label: 'Verificación blockchain',
    href: '#verificacion',
    icon: 'M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33',
    desc: 'Sin cuenta requerida',
  },
  {
    label: 'API e integración',
    href: '#api',
    icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
    desc: 'Plug & play',
  },
  {
    label: 'Seguridad',
    href: '#seguridad',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z',
    desc: 'On-chain auditable',
  },
]

const PRODUCTO_CASES: CaseItem[] = [
  { label: 'Educación', desc: 'Diplomas verificables',  href: '#caso-educacion', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
  { label: 'RRHH',      desc: 'Credenciales laborales', href: '#caso-rrhh',      icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { label: 'Legal',     desc: 'Documentos probatorios', href: '#caso-legal',     icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z' },
  { label: 'Fintech',   desc: 'Contratos sellados',     href: '#caso-fintech',   icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
]

const RECURSOS_ITEMS: NavItem[] = [
  { label: 'Documentación', href: '#documentacion', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', desc: 'Guías técnicas' },
  { label: 'Cómo funciona', href: '#como-funciona', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z',                                                                                                                                                                                                                                                           desc: 'El proceso paso a paso' },
  { label: 'Contáctanos',   href: '#contacto',      icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',                                    desc: 'Habla con el equipo' },
]

const CONFIGS: Record<DropKey, { width: number; items: NavItem[]; sectionLabel?: string; cases?: CaseItem[] }> = {
  producto: { width: 540, items: PRODUCTO_ITEMS, sectionLabel: 'Herramientas', cases: PRODUCTO_CASES },
  recursos: { width: 460, items: RECURSOS_ITEMS },
}

const DROP_LABELS: Record<DropKey, string> = {
  producto: 'Producto',
  recursos: 'Recursos',
}

function DropContent({ dropKey, onClose }: { dropKey: DropKey; onClose: () => void }) {
  const cfg = CONFIGS[dropKey]
  return (
    <div style={{ animation: 'navContentIn 0.14s ease forwards' }}>
      <div className={cfg.cases ? 'p-3 pb-1.5' : 'p-1.5'}>
        {cfg.sectionLabel && (
          <p className="px-1.5 pb-2 text-[11px] font-medium text-white/30 uppercase tracking-widest">
            {cfg.sectionLabel}
          </p>
        )}
      </div>
      <div className="px-1.5 pb-1.5 grid grid-cols-2">
        {cfg.items.map(({ label, href, icon, desc }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-start gap-3 px-4 py-3.5 rounded-[7px] hover:bg-white/6 transition-colors group"
          >
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="flex flex-col gap-1">
              <span className="text-[14px] leading-none text-white">{label}</span>
              {desc && (
                <span className="text-[14px] text-white/30 group-hover:text-white/40 transition-colors leading-snug">
                  {desc}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>

      {cfg.cases && (
        <>
          <div className="mx-3 border-t border-white/8" />
          <div className="p-3">
            <p className="px-1.5 pb-2 text-[11px] font-medium text-white/30 uppercase tracking-widest">
              Casos de uso
            </p>
            <div className="grid grid-cols-2 gap-0.5">
              {cfg.cases.map(({ label, desc, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-start gap-3 px-3 py-3 rounded-[7px] hover:bg-white/6 transition-colors group"
                >
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-white leading-none">{label}</span>
                    <span className="text-[14px] text-white/30 group-hover:text-white/40 transition-colors leading-snug">
                      {desc}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function LandingNavbar() {
  const [active, setActive]       = useState<DropKey | null>(null)
  const [dropLeft, setDropLeft]   = useState(0)
  const [dropWidth, setDropWidth] = useState(540)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const btnRefs    = useRef<Partial<Record<DropKey, HTMLButtonElement>>>({})
  const navRef     = useRef<HTMLDivElement>(null)

  const open = (key: DropKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    const btn = btnRefs.current[key]
    const nav = navRef.current
    if (btn && nav) {
      const bRect = btn.getBoundingClientRect()
      const nRect = nav.getBoundingClientRect()
      setDropLeft(bRect.left - nRect.left)
      setDropWidth(CONFIGS[key].width)
    }
    setActive(key)
  }

  const close = () => {
    closeTimer.current = setTimeout(() => setActive(null), 150)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      <style>{`
        @keyframes navContentIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-8 bg-black border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg className="w-9 h-9 text-white shrink-0 translate-y-[4px]" viewBox="0 0 200 200" fill="none">
            <path d="M100 100V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M100 100L148 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M100 100L52 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
            <path d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
            <path d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
            <path d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
            <path d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z" fill="currentColor"/>
          </svg>
          <span className="text-base font-semibold text-white">unickeys</span>
        </Link>

        {/* Nav */}
        <div ref={navRef} className="ml-8 flex items-center gap-1 relative">
          {(Object.keys(CONFIGS) as DropKey[]).map(key => (
            <button
              key={key}
              ref={el => { if (el) btnRefs.current[key] = el }}
              onMouseEnter={() => open(key)}
              onMouseLeave={close}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] text-sm text-white hover:text-white/80 hover:bg-white/8 transition-colors"
            >
              {DROP_LABELS[key]}
              <svg
                className="w-3 h-3 transition-transform duration-200"
                style={{ transform: active === key ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}

          <Link href="#precio"  className="px-3 py-1.5 rounded-[6px] text-sm text-white hover:text-white/80 hover:bg-white/8 transition-colors">
            Precio
          </Link>
          <Link href="#empresa" className="px-3 py-1.5 rounded-[6px] text-sm text-white hover:text-white/80 hover:bg-white/8 transition-colors">
            Empresa
          </Link>

          {/* Dropdown compartido — anima left+width al cambiar entre ítems */}
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={close}
            style={{
              position: 'absolute',
              top: 'calc(100% + 20px)',
              left: dropLeft,
              width: dropWidth,
              transition: [
                'left 0.24s cubic-bezier(0.4,0,0.2,1)',
                'width 0.24s cubic-bezier(0.4,0,0.2,1)',
                'opacity 0.16s ease',
                'transform 0.16s ease',
              ].join(', '),
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(-6px)',
              pointerEvents: active ? 'auto' : 'none',
            }}
            className="rounded-[10px] bg-black border border-white/12 shadow-2xl shadow-black/80 overflow-hidden"
          >
            {active && (
              <DropContent key={active} dropKey={active} onClose={() => setActive(null)} />
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-[6px] text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            Empezar ahora
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-[6px] text-xs text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>
    </>
  )
}
