'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

/* ── Visual mocks ──────────────────────────────────── */

function SignupMock() {
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '10px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <svg width="16" height="16" viewBox="0 0 200 200" fill="none">
          <path d="M100 100V42" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 100L148 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 100L52 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="100" r="10" fill="white" />
          <circle cx="100" cy="42" r="8" fill="white" />
          <circle cx="148" cy="128" r="8" fill="white" />
          <circle cx="52" cy="128" r="8" fill="white" />
        </svg>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>unickeys</span>
      </div>
      {['Empresa', 'Email'].map((label, i) => (
        <div key={label} style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '9px', color: DIM, marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            {i === 0 ? 'Acme S.A.' : 'admin@acme.com'}
          </div>
        </div>
      ))}
      <button style={{ width: '100%', padding: '8px', background: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, color: '#000', cursor: 'default', marginTop: '4px' }}>
        Crear cuenta →
      </button>
    </div>
  )
}

function ApiMock() {
  const lines = [
    { text: '$ curl -X POST \\', color: 'rgba(255,255,255,0.5)' },
    { text: '  api.unickeys.io/v1/ \\', color: 'rgba(255,255,255,0.3)' },
    { text: '  certificates/hash \\', color: 'rgba(255,255,255,0.3)' },
    { text: '  -H "X-API-Key: bpk_live_•••••" \\', color: '#5b8df5' },
    { text: '  -F "file=@contrato.pdf"', color: 'rgba(255,255,255,0.3)' },
  ]
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, opacity: 0.6 }} />)}
        <span style={{ marginLeft: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>terminal</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '10px', color: l.color, lineHeight: '1.7', whiteSpace: 'pre' }}>{l.text}</div>
        ))}
      </div>
      <div style={{ margin: '0 12px 12px', padding: '7px 10px', background: 'rgba(91,141,245,0.05)', border: '1px solid rgba(91,141,245,0.12)', borderRadius: '5px', fontSize: '9px', color: 'rgba(91,141,245,0.6)', letterSpacing: '0.05em' }}>
        🔑 API key generada desde el dashboard
      </div>
    </div>
  )
}

function CertMock() {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(52,211,153,0.18)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'rgba(52,211,153,0.04)', borderBottom: '1px solid rgba(52,211,153,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', color: '#34d399', letterSpacing: '0.08em', fontFamily: 'var(--font-geist-mono)' }}>✓ certificate issued</span>
        <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'rgba(52,211,153,0.5)', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.12)', padding: '2px 7px', borderRadius: '100px' }}>confirmed</span>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[['hash', '3f9a2b8e…c4d1a7f2'], ['tx', '5KJn8x…fPr'], ['blockchain', 'solana mainnet'], ['issued', '2024-03-15 UTC']].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', minWidth: '56px' }}>{label}</span>
            <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Step data ──────────────────────────────────────── */

const STEPS = [
  {
    num: '01',
    label: 'Registro',
    title: 'Creá tu cuenta',
    body: 'Registrá tu empresa en 2 minutos. Verificá el email y accedé al dashboard para gestionar todas tus emisiones.',
    visual: <SignupMock />,
    hero: false,
  },
  {
    num: '02',
    label: 'Integración',
    title: 'Conectá la API',
    body: 'Generá tu API key desde el dashboard. Integrá con un solo POST en tu sistema existente — PDF adentro, certificado afuera.',
    visual: <ApiMock />,
    hero: false,
  },
  {
    num: '03',
    label: 'Protección',
    title: 'Empezá a emitir',
    body: 'Cada documento recibe un hash SHA-256 registrado en Solana. Inmutable. Verificable públicamente por cualquiera, para siempre.',
    visual: <CertMock />,
    hero: true,
  },
]

/* ── Component ─────────────────────────────────────── */

export function LandingProcess() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.1 }
    )
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="como-funciona"
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
        padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          marginBottom: isMobile ? 40 : 56,
          gap: isMobile ? 12 : 0,
          opacity: triggered ? 1 : 0,
          transform: triggered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase', marginBottom: 16 }}>
              Cómo funciona
            </div>
            <h2 style={{
              fontWeight: 200,
              fontSize: 'clamp(32px, 4.5vw, 64px)',
              lineHeight: 1.05,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.03em',
            }}>
              De cero a primer certificado<br />
              <span style={{ color: ACCENT }}>en 3 pasos.</span>
            </h2>
          </div>
          {!isMobile && (
            <div style={{
              fontSize: 10, letterSpacing: '0.14em', color: DIM,
              textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.8,
            }}>
              SHA-256<br />Merkle Tree<br />Solana
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 0 }} />

        {/* Steps grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              paddingTop: isMobile ? 32 : 40,
              paddingBottom: isMobile ? 32 : 40,
              paddingRight: isMobile ? 0 : 32,
              paddingLeft: isMobile ? 0 : (i === 0 ? 0 : 32),
              borderLeft: isMobile ? 'none' : (i === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)'),
              borderTop: isMobile && i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              opacity: triggered ? 1 : 0,
              transform: triggered ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.8s ease ${0.1 + i * 0.15}s, transform 0.8s ease ${0.1 + i * 0.15}s`,
            }}>
              {/* Step number — monumental */}
              <div style={{
                fontSize: 'clamp(56px, 6vw, 88px)',
                fontWeight: 200,
                letterSpacing: '-0.04em',
                color: step.hero ? ACCENT : 'rgba(255,255,255,0.12)',
                lineHeight: 1,
                marginBottom: 6,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {step.num}
              </div>

              {/* Label */}
              <div style={{
                fontSize: 10,
                letterSpacing: '0.14em',
                color: step.hero ? ACCENT + '77' : DIM,
                textTransform: 'uppercase',
                marginBottom: 28,
              }}>
                {step.label}
              </div>

              {/* Visual mock */}
              <div style={{ marginBottom: 28 }}>
                {step.visual}
              </div>

              {/* Title */}
              <div style={{
                fontSize: 18,
                fontWeight: 300,
                color: step.hero ? ACCENT : '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 10,
              }}>
                {step.title}
              </div>

              {/* Body */}
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.75,
                fontWeight: 300,
              }}>
                {step.body}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 0 }} />

        {/* CTA inline */}
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          padding: '32px 0',
          gap: isMobile ? 16 : 0,
          opacity: triggered ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase' }}>
            API lista en 5 min
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/docs" style={{
              padding: '10px 18px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}>
              Documentación
            </Link>
            <Link href="/signup" style={{
              padding: '10px 20px',
              background: '#fff',
              color: '#000',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              textDecoration: 'none',
            }}>
              Crear cuenta →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
    </section>
  )
}
