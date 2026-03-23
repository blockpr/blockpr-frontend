'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const HEADLINE = [
  'Tus documentos merecen',
  'una prueba que',
  'nadie pueda refutar',
]
const TOTAL_CHARS = HEADLINE.reduce((acc, l) => acc + l.length, 0)

const TICKER_ITEMS = [
  'Diplomas académicos',
  'Certificados de RRHH',
  'Contratos legales',
  'Integraciones API',
  'Auditorías técnicas',
  'Contratos financieros',
  'Títulos de propiedad',
  'Actas notariales',
]

export function LandingCTA() {
  const wrapperRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [revealed,  setRevealed]  = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.5 }
    )
    if (headlineRef.current) obs.observe(headlineRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setRevealed(i)
      if (i >= TOTAL_CHARS) clearInterval(iv)
    }, 28)
    return () => clearInterval(iv)
  }, [triggered])

  return (
    <section
      ref={wrapperRef}
      style={{ background: '#050505', position: 'relative', overflow: 'hidden' }}
    >
      {/* Graph-paper bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Accent atmospheric glow */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '70%', height: '50%',
        background: `radial-gradient(ellipse at center bottom, rgba(77,184,136,0.07) 0%, transparent 68%)`,
        pointerEvents: 'none',
      }} />

      {/* Top rule */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

      {/* ── Ticker ── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '13px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          animation: 'cta-marquee 32s linear infinite',
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: DIM,
              paddingRight: 12,
              whiteSpace: 'nowrap',
            }}>
              {item}
              <span style={{ color: ACCENT, margin: '0 12px 0 0' }}> ·</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(64px, 9vw, 112px) clamp(24px, 5vw, 80px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Headline monumental ── */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
          <h2 ref={headlineRef} style={{
            fontWeight: 200,
            fontSize: 'clamp(32px, 5vw, 72px)',
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
            margin: 0,
          }}>
            {(() => {
              let globalIdx = 0
              return HEADLINE.map((line, li) => {
                const isLast = li === HEADLINE.length - 1
                const chars = line.split('').map((ch, ci) => {
                  const idx = globalIdx++
                  const lit = revealed > idx
                  return (
                    <span key={ci} style={{
                      color: lit ? '#fff' : 'rgba(255,255,255,0.12)',
                      transition: 'color 0.12s ease',
                      whiteSpace: ch === ' ' ? 'pre' : undefined,
                    }}>
                      {ch}
                    </span>
                  )
                })
                return (
                  <span key={li} style={{ display: 'block' }}>
                    {chars}
                    {isLast && (
                      <span style={{ color: ACCENT }}>.</span>
                    )}
                  </span>
                )
              })
            })()}
          </h2>
        </div>

        {/* ── Bottom row: copy izq + botones der ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 48,
          flexWrap: 'wrap',
          opacity: triggered ? 1 : 0,
          transform: triggered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease 0.18s, transform 0.9s ease 0.18s',
        }}>

          {/* Copy + trust signals */}
          <div style={{ maxWidth: 420 }}>
            <p style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.32)',
              lineHeight: 1.75,
              margin: '0 0 24px',
              fontWeight: 300,
            }}>
              En menos de 5 minutos tenés tu primer certificado blockchain en producción.
            </p>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {['API lista en 5 min', 'Sin tarjeta de crédito'].map(t => (
                <span key={t} style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 9,
                  color: 'rgba(77,184,136,0.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  — {t}
                </span>
              ))}
            </div>
          </div>

          {/* Botones apilados verticalmente */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 14,
          }}>
            <Link href="/signup" style={{
              padding: '14px 32px',
              background: '#fff',
              color: '#000',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Empezar gratis →
            </Link>
            <Link href="/docs" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 20px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              Ver documentación
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Footer info ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          marginTop: 'clamp(48px, 6vw, 80px)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          opacity: triggered ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.08em' }}>
            unickeys © 2024 — B2B certificate infrastructure
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.06em' }}>
            SHA-256 · Merkle Tree · Solana · HTTPS · SOC2 in progress
          </span>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} />

      <style>{`
        @keyframes cta-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
