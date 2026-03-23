'use client'

import { Fragment, useEffect, useRef, useState } from 'react'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const FULL_HASH = '3f9a2b8e4c1d7a9f2e5b8c3d6a1f4e7b2c9d8f5a'

const HEADLINE = [
  'Cada documento que emitís',
  'queda grabado para siempre',
  'en la blockchain.',
]
const HEADLINE_TOTAL = HEADLINE.reduce((a, l) => a + l.length, 0)

const PIPELINE = [
  { step: '01', label: 'Documento',   sublabel: 'contrato_legal.pdf',      detail: 'Cualquier archivo',              accented: false },
  { step: '02', label: 'SHA-256',     sublabel: '3f9a2b…4c1d',             detail: 'Hash único del archivo',         accented: false },
  { step: '03', label: 'Merkle Leaf', sublabel: 'nodo #42 · batch #4821',  detail: 'Agrupado con otros certificados',accented: false },
  { step: '04', label: 'Merkle Root', sublabel: 'ae9f2b…4c7d',             detail: 'Raíz que representa el batch',   accented: true  },
  { step: '05', label: 'Solana TX',   sublabel: '5KJn8x…8fPr',             detail: 'Registrado en blockchain',       accented: true  },
]

const STATS = [
  { value: '0',    label: 'falsificaciones\nposibles', note: 'garantía criptográfica', accent: true  },
  { value: '<3s',  label: 'tiempo de\nverificación',   note: 'promedio en producción', accent: false },
  { value: '10K+', label: 'certificados\npor tx',      note: 'árbol de Merkle',        accent: false },
]

export function LandingTrust() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headRef     = useRef<HTMLDivElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const pipelineRef = useRef<HTMLDivElement>(null)
  const hashRef     = useRef<HTMLDivElement>(null)

  const headlineRef = useRef<HTMLHeadingElement>(null)
  const [headVisible,     setHeadVisible]     = useState(false)
  const [headRevealed,    setHeadRevealed]    = useState(0)
  const [statsVisible,    setStatsVisible]    = useState(false)
  const [pipelineVisible, setPipelineVisible] = useState(false)
  const [hashVisible,     setHashVisible]     = useState(false)
  const [hashChars,       setHashChars]       = useState(0)

  useEffect(() => {
    const makeIO = (cb: () => void, threshold = 0.1) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) cb() }, { threshold })

    const ioHead     = makeIO(() => setHeadVisible(true), 0.5)
    const ioStats    = makeIO(() => setStatsVisible(true),    0.15)
    const ioPipeline = makeIO(() => setPipelineVisible(true), 0.1)
    const ioHash     = makeIO(() => setHashVisible(true),     0.1)

    if (headlineRef.current) ioHead.observe(headlineRef.current)
    if (statsRef.current)    ioStats.observe(statsRef.current)
    if (pipelineRef.current) ioPipeline.observe(pipelineRef.current)
    if (hashRef.current)     ioHash.observe(hashRef.current)

    return () => { ioHead.disconnect(); ioStats.disconnect(); ioPipeline.disconnect(); ioHash.disconnect() }
  }, [])

  useEffect(() => {
    if (!headVisible) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setHeadRevealed(i)
      if (i >= HEADLINE_TOTAL) clearInterval(iv)
    }, 28)
    return () => clearInterval(iv)
  }, [headVisible])

  useEffect(() => {
    if (!hashVisible) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setHashChars(i)
      if (i >= FULL_HASH.length) clearInterval(iv)
    }, 38)
    return () => clearInterval(iv)
  }, [hashVisible])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Graph-paper bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <div style={{
        maxWidth: 1360,
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Label strip ── */}
        <div style={{
          display: 'flex',
          gap: 0,
          marginBottom: 48,
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: DIM,
          textTransform: 'uppercase',
        }}>
          {['SHA-256', 'Merkle Tree', 'Solana Mainnet', 'Inmutable'].map((tag, i) => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <span style={{
                  display: 'inline-block',
                  width: 1, height: 10,
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0 16px',
                }} />
              )}
              {tag}
            </span>
          ))}
        </div>

        {/* ── Headline ── */}
        <div
          ref={headRef}
          style={{ marginBottom: 'clamp(56px, 7vw, 88px)' }}
        >
          <h2 ref={headlineRef} style={{
            fontWeight: 200,
            fontSize: 'clamp(32px, 4.5vw, 66px)',
            lineHeight: 1.05,
            margin: '0 0 24px',
            letterSpacing: '-0.04em',
          }}>
            {(() => {
              let idx = 0
              return HEADLINE.map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line.split('').map((ch, ci) => {
                    const i = idx++
                    return (
                      <span key={ci} style={{
                        color: headRevealed > i ? '#fff' : 'rgba(255,255,255,0.12)',
                        transition: 'color 0.12s ease',
                        whiteSpace: ch === ' ' ? 'pre' : undefined,
                      }}>{ch}</span>
                    )
                  })}
                </span>
              ))
            })()}
          </h2>
          <p style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.28)',
            maxWidth: 480,
            margin: 0,
            fontWeight: 300,
          }}>
            Criptografía de grado militar aplicada a la certificación de documentos.
            Sin bases de datos centralizadas que hackear, sin autoridades que coaccionar.
          </p>
        </div>

        {/* ── Horizontal rule ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 'clamp(48px, 6vw, 72px)' }} />

        {/* ── Stats — tipografía pura, sin boxes ── */}
        <div
          ref={statsRef}
          className="trust-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginBottom: 'clamp(48px, 6vw, 72px)',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{
              padding: 'clamp(20px, 2.5vw, 32px) clamp(16px, 2vw, 36px)',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
            }}>
              <div style={{
                fontWeight: 200,
                fontSize: 'clamp(48px, 5.5vw, 76px)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
                color: stat.accent ? ACCENT : '#fff',
                marginBottom: 14,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.28)',
                lineHeight: 1.45,
                marginBottom: 12,
                whiteSpace: 'pre-line',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: stat.accent ? 'rgba(77,184,136,0.5)' : 'rgba(255,255,255,0.14)',
              }}>
                {stat.note}
              </div>
            </div>
          ))}
        </div>

        {/* ── Horizontal rule ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 'clamp(48px, 6vw, 72px)' }} />

        {/* ── Pipeline ── */}
        <div ref={pipelineRef}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: DIM,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Flujo de certificación — batch #4821
          </div>

          <div className="trust-pipeline" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 28px 1fr 28px 1fr 28px 1fr 28px 1fr',
            alignItems: 'center',
          }}>
            {PIPELINE.map((step, i) => (
              <Fragment key={step.step}>
                <div style={{
                  padding: 'clamp(16px, 2vw, 24px) clamp(12px, 1.5vw, 20px)',
                  border: `1px solid ${step.accented ? 'rgba(77,184,136,0.22)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 8,
                  background: step.accented ? 'rgba(77,184,136,0.035)' : 'rgba(255,255,255,0.012)',
                  opacity: pipelineVisible ? 1 : 0,
                  transform: pipelineVisible ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 8,
                    color: step.accented ? 'rgba(77,184,136,0.55)' : 'rgba(255,255,255,0.18)',
                    letterSpacing: '0.1em',
                    marginBottom: 10,
                  }}>
                    {step.step}
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: step.accented ? ACCENT : 'rgba(255,255,255,0.72)',
                    letterSpacing: '-0.01em',
                    marginBottom: 5,
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 8,
                    color: step.accented ? 'rgba(77,184,136,0.55)' : 'rgba(255,255,255,0.22)',
                    marginBottom: 8,
                  }}>
                    {step.sublabel}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.18)',
                    lineHeight: 1.4,
                  }}>
                    {step.detail}
                  </div>
                </div>

                {i < PIPELINE.length - 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pipelineVisible ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 0.1 + 0.35}s`,
                  }}>
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                      <path
                        d="M0 5 H16 M12 1.5 L18 5 L12 8.5"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* ── Hash display ── */}
        <div
          ref={hashRef}
          style={{
            marginTop: 'clamp(32px, 4vw, 48px)',
            padding: 'clamp(20px, 2.5vw, 32px) clamp(20px, 3vw, 36px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.008)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            opacity: hashVisible ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              SHA-256 — contrato_legal.pdf
            </div>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 'clamp(12px, 1.3vw, 15px)',
              color: ACCENT,
              letterSpacing: '0.05em',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {FULL_HASH.slice(0, hashChars)}
              {hashChars < FULL_HASH.length && (
                <span style={{
                  display: 'inline-block',
                  width: '0.6ch', height: '1em',
                  background: ACCENT,
                  verticalAlign: 'text-bottom',
                  animation: 'trust-blink 0.7s step-end infinite',
                }} />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: ACCENT,
              boxShadow: `0 0 8px ${ACCENT}80`,
            }} />
            <span style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9,
              color: 'rgba(77,184,136,0.7)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Inmutable · Verificable · Público
            </span>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes trust-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 1024px) {
          .trust-pipeline {
            grid-template-columns: 1fr 20px 1fr 20px 1fr !important;
          }
          .trust-pipeline > *:nth-child(n+7) { display: none !important; }
        }
        @media (max-width: 700px) {
          .trust-pipeline {
            grid-template-columns: 1fr !important;
          }
          .trust-pipeline > *:nth-child(even) { display: none !important; }
          .trust-stats { grid-template-columns: 1fr !important; }
          .trust-stats > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.07) !important; }
          .trust-stats > div:first-child { border-top: none !important; }
        }
      `}</style>
    </section>
  )
}
