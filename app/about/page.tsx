'use client'

import { useEffect, useRef, useState } from 'react'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'
const RULE   = '1px solid rgba(255,255,255,0.07)'

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2025',  label: 'Año de\nfundación' },
  { value: '4',     label: 'Personas\nen el equipo' },
  { value: '10+',   label: 'Empresas\nactivas' },
  { value: '115k +', label: 'Documentos\nprotegidos' },
]

const VALUES = [
  {
    num: '01',
    title: 'Integridad técnica',
    body: 'Los datos no mienten. Nosotros tampoco. Cada decisión de arquitectura se toma pensando en la inmutabilidad y la trazabilidad a largo plazo.',
  },
  {
    num: '02',
    title: 'Simplicidad radical',
    body: 'La tecnología más poderosa es la que no se nota. Blockchain, Merkle trees, SHA-256 — el usuario final solo ve un QR y una respuesta.',
  },
  {
    num: '03',
    title: 'Confianza a prueba',
    body: 'Construimos para el día en que todo se ponga en duda. Cada certificado debe poder verificarse sin conexión, sin depender de nosotros.',
  },
]

const TEAM = [
  {
    initials: 'FG',
    name: 'Facundo Girardi',
    role: 'Co-Fundador',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/facugirardi/',
    email: 'facugirardi22@gmail.com',
  },
  {
    initials: 'AV',
    name: 'Alejo Vaquero',
    role: 'Co-Fundador',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/alejovaquero/',
    email: 'alejo.vyornet31@gmail.com',
  },
  {
    initials: 'OF',
    name: 'Octavio Ferreyra',
    role: 'Co-Fundador',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/octavio-ferreyra-42b101247/',
    email: null,
  },
  {
    initials: 'TA',
    name: 'Tomas Altero',
    role: 'Co-Fundador',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/tomas-altero/',
    email: 'tomialtero@gmail.com',
  },
]

const MILESTONES = [
  { year: 'Nov 2025', label: 'Fundación',     text: 'Primeras líneas de código. Tres personas en un co-working de Córdoba con una idea y un problema claro.' },
  { year: 'Ene 2026', label: 'Primer cliente', text: 'Primera empresa incorporada a la plataforma. Los primeros certificados emitidos en producción.' },
  { year: 'Mar 2026', label: 'Tracción',       text: 'Diez empresas activas. Producto estable. Primeros ingresos recurrentes.' },
  { year: 'Hoy',      label: 'Crecimiento',    text: '10+ empresas activas, equipo de 4 y construyendo la infraestructura de confianza documental de Latinoamérica.' },
]

// ─── Util hook ────────────────────────────────────────────────────────────────

function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <main style={{ background: '#050505', minHeight: '100vh', overflowX: 'clip' }}>

      {/* Grid paper bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <LandingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderBottom: RULE,
        overflow: 'hidden',
      }}>
        {/* Glow verde */}
        <div style={{
          position: 'absolute',
          top: '-20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw', height: '60vh',
          background: `radial-gradient(ellipse at center, ${ACCENT}18 0%, ${ACCENT}06 40%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 140px) clamp(24px, 5vw, 80px) clamp(72px, 9vw, 120px)',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: DIM, textTransform: 'uppercase',
            marginBottom: 56,
          }}>
            Sobre nosotros
          </p>

          <h1 style={{
            fontSize: 'clamp(38px, 5.8vw, 86px)',
            fontWeight: 200,
            letterSpacing: '-0.04em',
            lineHeight: 1.04,
            color: '#fff',
            margin: '0 0 0',
            maxWidth: '16ch',
          }}>
            Construimos la infraestructura de{' '}
            <span style={{ color: ACCENT }}>confianza</span>{' '}
            para documentos digitales.
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 24 : 48,
            marginTop: isMobile ? 48 : 72,
            paddingTop: 48,
            borderTop: RULE,
          }}>
            <p style={{
              fontSize: 'clamp(15px, 1.4vw, 19px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.75,
              margin: 0,
            }}>
              Somos un equipo de ingenieros, diseñadores y operadores convencidos de que la autenticidad documental no debería depender de la buena fe de nadie.
            </p>
            <p style={{
              fontSize: 'clamp(14px, 1.2vw, 17px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.75,
              margin: 0,
            }}>
              Fundados en Córdoba en 2025, operamos en tres países y protegemos más de 3.7 millones de documentos para 340 empresas en sectores que no pueden permitirse el fraude.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <StatsRow isMobile={isMobile} />

      {/* ── Misión ───────────────────────────────────────────────────────────── */}
      <MissionSection isMobile={isMobile} />

      {/* ── Valores ──────────────────────────────────────────────────────────── */}
      <ValuesSection isMobile={isMobile} />

      {/* ── Equipo ───────────────────────────────────────────────────────────── */}
      <TeamSection isMobile={isMobile} />

      {/* ── Historia ─────────────────────────────────────────────────────────── */}
      <TimelineSection isMobile={isMobile} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <LandingFooter />
      </div>
    </main>
  )
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatsRow({ isMobile }: { isMobile: boolean }) {
  const { ref, visible } = useFadeIn()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(56px, 7vw, 96px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '1px' : 0,
        background: isMobile ? 'rgba(255,255,255,0.07)' : 'transparent',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: '#050505',
            borderLeft: !isMobile && i !== 0 ? RULE : 'none',
            paddingTop: isMobile ? 24 : 0,
            paddingBottom: isMobile ? 24 : 0,
            paddingLeft: isMobile ? 20 : (i === 0 ? 0 : 40),
            paddingRight: isMobile ? 20 : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ease ${i * 0.12}s, transform 0.9s ease ${i * 0.12}s`,
          }}>
            <div style={{
              fontSize: isMobile ? 'clamp(28px, 8vw, 48px)' : 'clamp(36px, 4.5vw, 64px)',
              fontWeight: 200,
              letterSpacing: '-0.04em',
              color: i === 2 ? ACCENT : '#fff',
              lineHeight: 1,
              marginBottom: 16,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              color: DIM,
              textTransform: 'uppercase',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Mission ──────────────────────────────────────────────────────────────────

function MissionSection({ isMobile }: { isMobile: boolean }) {
  const { ref, visible } = useFadeIn()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px, 9vw, 128px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
        gap: isMobile ? 32 : 80,
      }}>
        {/* Left label */}
        <div style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: '#fff', textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Misión
          </p>
          <div style={{
            width: 32, height: 1,
            background: ACCENT,
          }} />
        </div>

        {/* Right content */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <blockquote style={{
            fontSize: 'clamp(22px, 2.8vw, 40px)',
            fontWeight: 200,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: '#fff',
            margin: '0 0 48px',
            padding: 0,
            borderLeft: `3px solid ${ACCENT}`,
            paddingLeft: 32,
          }}>
            "El fraude documental no es un problema de tecnología. Es un problema de incentivos. Nosotros eliminamos la posibilidad, no solo el incentivo."
          </blockquote>

          <p style={{
            fontSize: 'clamp(15px, 1.3vw, 18px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            marginBottom: 28,
          }}>
            Unickeys existe para que cualquier documento pueda ser verificado en segundos, desde cualquier dispositivo, sin depender de la disponibilidad del emisor ni de la confianza en un tercero.
          </p>

          <p style={{
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
          }}>
            Lo hacemos anclando huellas digitales en la blockchain de Solana. Una vez registrado, ningún actor — incluido nosotros — puede alterar el historial.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Values ───────────────────────────────────────────────────────────────────

function ValuesSection({ isMobile }: { isMobile: boolean }) {
  const { ref, visible } = useFadeIn()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px, 9vw, 128px) clamp(24px, 5vw, 80px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 64,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: '#fff', textTransform: 'uppercase',
            margin: 0, whiteSpace: 'nowrap',
          }}>
            Valores
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          borderTop: RULE,
        }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{
              paddingTop: 40,
              paddingBottom: 40,
              paddingRight: isMobile ? 0 : 40,
              paddingLeft: isMobile ? 0 : (i === 0 ? 0 : 40),
              borderLeft: !isMobile && i !== 0 ? RULE : 'none',
              borderTop: isMobile && i > 0 ? RULE : 'none',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.9s ease ${i * 0.15}s, transform 0.9s ease ${i * 0.15}s`,
            }}>
              <div style={{
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 200,
                letterSpacing: '-0.05em',
                color: 'rgba(255,255,255,0.1)',
                lineHeight: 1,
                marginBottom: 28,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {v.num}
              </div>
              <p style={{
                fontSize: 17,
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                marginBottom: 16,
              }}>
                {v.title}
              </p>
              <p style={{
                fontSize: 14,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────

function TeamSection({ isMobile }: { isMobile: boolean }) {
  const { ref, visible } = useFadeIn()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px, 9vw, 128px) clamp(24px, 5vw, 80px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 64,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: '#fff', textTransform: 'uppercase',
            margin: 0, whiteSpace: 'nowrap',
          }}>
            Equipo
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: '#fff', textTransform: 'uppercase',
            margin: 0, whiteSpace: 'nowrap',
          }}>
            4 personas
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 1,
          background: 'rgba(255,255,255,0.07)',
          border: RULE,
        }}>
          {TEAM.map((m, i) => (
            <TeamCard key={i} member={m} index={i} visible={visible} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamCard({
  member, index, visible, isMobile,
}: {
  member: typeof TEAM[number]
  index: number
  visible: boolean
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.03)' : '#050505',
        padding: isMobile ? '24px 20px' : '40px 36px',
        transition: `background 0.3s ease, opacity 0.9s ease ${index * 0.08}s, transform 0.9s ease ${index * 0.08}s`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Initials */}
      <div style={{
        fontSize: 'clamp(28px, 3.5vw, 48px)',
        fontWeight: 200,
        letterSpacing: '-0.04em',
        color: hovered ? ACCENT : 'rgba(255,255,255,0.12)',
        lineHeight: 1,
        marginBottom: 28,
        transition: 'color 0.3s ease',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {member.initials}
      </div>

      <p style={{
        fontSize: 16,
        fontWeight: 400,
        color: '#fff',
        letterSpacing: '-0.02em',
        margin: '0 0 6px',
      }}>
        {member.name}
      </p>

      <p style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        color: hovered ? ACCENT + 'cc' : DIM,
        textTransform: 'uppercase',
        margin: '0 0 20px',
        transition: 'color 0.3s ease',
      }}>
        {member.role}
      </p>

      <p style={{
        fontSize: 13,
        fontWeight: 300,
        color: 'rgba(255,255,255,0.35)',
        lineHeight: 1.75,
        margin: '0 0 28px',
        flex: 1,
      }}>
        {member.bio}
      </p>

      {/* Icons */}
      <div style={{ display: 'flex', gap: 16 }}>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ color: DIM, transition: 'color 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        {member.email && (
          <a href={`mailto:${member.email}`}
            style={{ color: DIM, transition: 'color 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = DIM)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineSection({ isMobile }: { isMobile: boolean }) {
  const { ref, visible } = useFadeIn()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px, 9vw, 128px) clamp(24px, 5vw, 80px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 64,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: '#fff', textTransform: 'uppercase',
            margin: 0, whiteSpace: 'nowrap',
          }}>
            Historia
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <div>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '72px 1fr' : '120px 1px 1fr',
              gap: isMobile ? '0 16px' : '0 40px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.9s ease ${i * 0.15}s, transform 0.9s ease ${i * 0.15}s`,
            }}>
              {/* Year */}
              <div style={{
                paddingTop: isMobile ? 24 : 40,
                paddingBottom: isMobile ? 24 : 40,
              }}>
                <span style={{
                  fontSize: isMobile ? 'clamp(18px, 4vw, 24px)' : 'clamp(28px, 3vw, 42px)',
                  fontWeight: 200,
                  letterSpacing: '-0.04em',
                  color: i === MILESTONES.length - 1 ? ACCENT : 'rgba(255,255,255,0.25)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {m.year}
                </span>
              </div>

              {/* Spine — desktop only */}
              {!isMobile && (
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 1,
                    height: '100%',
                    background: i === MILESTONES.length - 1
                      ? `linear-gradient(to bottom, ${ACCENT}66, transparent)`
                      : 'rgba(255,255,255,0.07)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 44,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 7, height: 7,
                    borderRadius: '50%',
                    background: i === MILESTONES.length - 1 ? ACCENT : 'rgba(255,255,255,0.2)',
                  }} />
                </div>
              )}

              {/* Content */}
              <div style={{
                paddingTop: isMobile ? 24 : 38,
                paddingBottom: isMobile ? 24 : 40,
                borderBottom: i < MILESTONES.length - 1 ? RULE : 'none',
              }}>
                <p style={{
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  color: i === MILESTONES.length - 1 ? ACCENT + 'bb' : DIM,
                  textTransform: 'uppercase',
                  margin: '0 0 10px',
                }}>
                  {m.label}
                </p>
                <p style={{
                  fontSize: isMobile ? 14 : 'clamp(15px, 1.4vw, 18px)',
                  fontWeight: 300,
                  color: i === MILESTONES.length - 1 ? '#fff' : 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
