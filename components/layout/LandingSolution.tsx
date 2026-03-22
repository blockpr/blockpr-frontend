'use client'

import { useEffect, useRef, useState } from 'react'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const CARDS = [
  {
    num: '01',
    title: 'Emisión de certificados verificables',
    subtitle: 'Generá documentos seguros con QR y firma digital',
    body: 'Emití certificados, comprobantes o documentos con un QR único que permite validarlos en segundos. Guardamos los datos originales para garantizar autenticidad y evitar falsificaciones.',
    hero: true,
  },
  {
    num: '02',
    title: 'Verificación pública instantánea',
    subtitle: 'Validación en segundos desde cualquier dispositivo',
    body: 'Cualquier persona puede escanear el QR o ingresar al link para ver los datos reales emitidos por tu sistema, con estado actualizado y total transparencia.',
    hero: false,
  },
  {
    num: '03',
    title: 'Detección inteligente de fraude',
    subtitle: 'Identificá documentos adulterados automáticamente',
    body: 'Analizamos imágenes o PDFs con IA y comparamos contra los datos originales. Detectamos inconsistencias aunque el documento tenga un QR válido.',
    hero: false,
  },
]

export function LandingSolution() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (top > 0) { setScrollProgress(0); return }
      const maxScroll = el.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -top / maxScroll))
      setScrollProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
  const op = clamp(scrollProgress / 0.12)
  const y  = (1 - op) * 32
  const cardsTriggered = scrollProgress >= 0.35

  return (
    <div ref={wrapperRef} style={{ height: '300vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#050505',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Graph-paper bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: op,
        }} />

        <div style={{
          opacity: op,
          transform: `translateY(${y + 25}px)`,
          width: '100%',
          maxWidth: 1200,
          padding: '0 clamp(24px, 5vw, 80px)',
        }}>
          {/* Top rule + logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            marginBottom: 48,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 200 200" fill="none">
                <path d="M100 100V42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <path d="M100 100L148 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <path d="M100 100L52 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="100" r="10" fill="white" />
                <circle cx="100" cy="42" r="8" fill="white" />
                <circle cx="148" cy="128" r="8" fill="white" />
                <circle cx="52" cy="128" r="8" fill="white" />
              </svg>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase' }}>
                unickeys
              </span>
            </div>
          </div>

          {/* Headline */}
          <p style={{
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 200,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 56px',
          }}>
            Autenticidad, fraude y verificación<br />
            <span style={{ color: ACCENT }}>resueltos en una sola plataforma.</span>
          </p>

          {/* Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            {CARDS.map((card, i) => (
              <div key={i} style={{
                padding: '32px 32px 32px 0',
                paddingLeft: i === 0 ? 0 : 32,
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)',
                opacity: cardsTriggered ? 1 : 0,
                transform: cardsTriggered ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`,
              }}>
                {/* Number */}
                <div style={{
                  fontSize: 'clamp(48px, 5.5vw, 72px)',
                  fontWeight: 200,
                  letterSpacing: '-0.04em',
                  color: 'rgba(255,255,255,0.15)',
                  lineHeight: 1,
                  marginBottom: 24,
                  marginTop: 24,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {card.num}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.35,
                  marginBottom: 10,
                }}>
                  {card.title}
                </div>

                {/* Subtitle */}
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}>
                  {card.subtitle}
                </div>

                {/* Body */}
                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}>
                  {card.body}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom rule */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </div>
    </div>
  )
}
