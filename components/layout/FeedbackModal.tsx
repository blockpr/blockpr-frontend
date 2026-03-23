'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { cn } from '@/lib/utils'

const MAX_CHARS = 400

const RATINGS = [
  {
    value: 1,
    label: 'Muy malo',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 17s-1.5-2.5-4-2.5S8 17 8 17" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} />
        <path d="M8.5 7.5 L9.5 9" strokeWidth={1.4} />
        <path d="M15.5 7.5 L14.5 9" strokeWidth={1.4} />
      </svg>
    ),
  },
  {
    value: 2,
    label: 'Malo',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15.5 16.5s-1-1.5-3.5-1.5-3.5 1.5-3.5 1.5" />
        <line x1="9" y1="9.5" x2="9.01" y2="9.5" strokeWidth={2.5} />
        <line x1="15" y1="9.5" x2="15.01" y2="9.5" strokeWidth={2.5} />
      </svg>
    ),
  },
  {
    value: 3,
    label: 'Regular',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8.5" y1="16" x2="15.5" y2="16" />
        <line x1="9" y1="9.5" x2="9.01" y2="9.5" strokeWidth={2.5} />
        <line x1="15" y1="9.5" x2="15.01" y2="9.5" strokeWidth={2.5} />
      </svg>
    ),
  },
  {
    value: 4,
    label: 'Bueno',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9.5" x2="9.01" y2="9.5" strokeWidth={2.5} />
        <line x1="15" y1="9.5" x2="15.01" y2="9.5" strokeWidth={2.5} />
      </svg>
    ),
  },
  {
    value: 5,
    label: 'Excelente',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M7.5 13.5s1.5 3.5 4.5 3.5 4.5-3.5 4.5-3.5" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} />
      </svg>
    ),
  },
]

interface Props {
  onClose: () => void
}

export function FeedbackModal({ onClose }: Props) {
  const [selected, setSelected]   = useState<number | null>(null)
  const [text, setText]           = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [closing, setClosing]     = useState(false)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)
  const btnRefs                   = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    if (selected === null) return
    const btn = btnRefs.current[selected - 1]
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [selected])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (selected !== null) textareaRef.current?.focus()
  }, [selected])

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 160)
  }

  async function handleSubmit() {
    if (!selected) return
    // TODO: llamar API de feedback
    setSubmitted(true)
    setTimeout(handleClose, 1800)
  }

  const charsLeft = MAX_CHARS - text.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={cn(
          'w-full max-w-sm bg-black border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden',
          closing ? 'animate-fade-out' : 'animate-fade-in'
        )}
        style={{ transition: 'opacity 160ms ease, transform 160ms ease' }}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-success-muted)', border: '1px solid var(--color-success)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4.5 4.5L16 6" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">¡Gracias por tu feedback!</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Nos ayuda a mejorar el producto.</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Dejanos tu feedback</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">¿Cómo está siendo tu experiencia?</p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── Body ── */}
            <div className="px-5 py-5 space-y-5">

              {/* Pill selector */}
              <div>
                <div className="relative flex items-center p-0.5 rounded-[8px] bg-[var(--color-base)] border border-[var(--color-border)]">
                  {indicator.width > 0 && (
                    <span
                      className="absolute top-0.5 bottom-0.5 rounded-[6px] pointer-events-none"
                      style={{
                        left: indicator.left + 6,
                        width: indicator.width - 12,
                        background: '#fff',
                        opacity: 1,
                        transition: 'left 200ms ease, width 200ms ease',
                      }}
                    />
                  )}
                  {RATINGS.map((r, i) => {
                    const isActive = selected === r.value
                    return (
                      <button
                        key={r.value}
                        ref={(el) => { btnRefs.current[i] = el }}
                        onClick={() => setSelected(r.value)}
                        title={r.label}
                        className="relative z-10 flex-1 flex flex-col items-center gap-1 py-1.5 rounded-[6px] transition-all duration-150"
                        style={{
                          color: isActive ? '#000' : 'var(--color-text-muted)',
                          opacity: isActive ? 1 : 0.45,
                        }}
                      >
                        {r.icon(isActive)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="Contanos más (opcional)..."
                    rows={4}
                    className={cn(
                      'w-full resize-none rounded-lg border bg-[var(--color-base)] px-3.5 py-3',
                      'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                      'border-[var(--color-border)] focus:outline-none focus:border-[#fff]',
                      'transition-colors'
                    )}
                  />
                  <span className={cn(
                    'absolute bottom-2.5 right-3 text-[10px] tabular-nums transition-colors',
                    charsLeft < 50
                      ? 'text-[var(--color-warning)]'
                      : 'text-[var(--color-text-muted)]'
                  )}>
                    {charsLeft}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 pb-4">
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={cn(
                  'w-full py-2 text-xs font-medium rounded-md transition-all',
                  selected
                    ? 'bg-white text-black hover:opacity-90'
                    : 'bg-[var(--color-card-hover)] text-[var(--color-text-muted)] cursor-not-allowed opacity-40'
                )}
              >
                Enviar feedback
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 180ms ease forwards; }
        .animate-fade-out { opacity: 0; transform: scale(0.96) translateY(6px); }

      `}</style>
    </div>
  )
}
