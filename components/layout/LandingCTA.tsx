'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const USE_CASES = [
  'Diplomas académicos',
  'Certificados de RRHH',
  'Contratos legales',
  'Integraciones API',
  'Auditorías técnicas',
  'Contratos financieros',
]

const TRUST = [
  'API lista en 5 min',
]

export function LandingCTA() {
  const wrapperRef = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.15 }
    )
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

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

      {/* Top rule */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(64px, 9vw, 112px) clamp(24px, 5vw, 80px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Use cases row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0',
          marginBottom: 64,
          opacity: triggered ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}>
          {USE_CASES.map((uc, i) => (
            <span key={uc} style={{
              fontSize: 11,
              color: DIM,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              paddingRight: 24,
              marginRight: 24,
              borderRight: i < USE_CASES.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              lineHeight: 1,
            }}>
              {uc}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 64 }} />

        {/* Monumental headline */}
        <div style={{
          marginBottom: 64,
          opacity: triggered ? 1 : 0,
          transform: triggered ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
        }}>
          <h2 style={{
            fontWeight: 200,
            fontSize: 'clamp(36px, 5.5vw, 80px)',
            lineHeight: 0.95,
            color: 'rgba(255,255,255,0.18)',
            margin: '0 0 0',
            letterSpacing: '-0.04em',
          }}>
            Emití tu primer<br />
            <span style={{ color: '#fff' }}>certificado</span>
            <span style={{ color: ACCENT }}>.</span>
          </h2>
        </div>

        {/* Bottom row: sub + buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 40,
          flexWrap: 'wrap',
          opacity: triggered ? 1 : 0,
          transform: triggered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s',
        }}>
          <div style={{ maxWidth: 420 }}>
            <p style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontWeight: 300,
            }}>
              En menos de 5 minutos tenés tu primer certificado blockchain en producción.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {TRUST.map(t => (
                <span key={t} style={{ fontSize: 11, color: DIM, letterSpacing: '0.04em' }}>
                  — {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/docs" style={{
              padding: '12px 22px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}>
              Ver documentación
            </Link>
            <Link href="/signup" style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#000',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Empezar gratis →
            </Link>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          marginTop: 64,
          paddingTop: 28,
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

      {/* Bottom rule */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
    </section>
  )
}
