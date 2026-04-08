'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'
const RULE   = '1px solid rgba(255,255,255,0.07)'

const SECTIONS = [
  {
    num: '01',
    id: 'aceptacion',
    title: 'Aceptación de los términos',
    content: [
      { type: 'paragraph', text: 'El acceso y uso de la plataforma implica la aceptación plena de los presentes Términos y Condiciones. Si el usuario no está de acuerdo, deberá abstenerse de utilizar el servicio.' },
    ],
  },
  {
    num: '02',
    id: 'descripcion',
    title: 'Descripción del servicio',
    content: [
      { type: 'paragraph', text: 'La plataforma permite la generación, registro y verificación de certificados digitales asociados a inspecciones técnicas u otros documentos.' },
      { type: 'paragraph', text: 'Cada certificado puede contar con un mecanismo de validación basado en tecnologías criptográficas, mediante el cual se registra una huella digital única del documento (hash) en una red blockchain.' },
    ],
  },
  {
    num: '03',
    id: 'definiciones',
    title: 'Definiciones',
    content: [
      { type: 'definitions', items: [
        { term: 'Certificado', def: 'Documento digital emitido por un tercero autorizado.' },
        { term: 'Hash', def: 'Representación criptográfica única del contenido de un documento.' },
        { term: 'Blockchain', def: 'Registro distribuido e inmutable donde se almacenan las huellas digitales.' },
        { term: 'Usuario', def: 'Persona física o jurídica que utiliza la plataforma.' },
        { term: 'Emisor', def: 'Entidad que genera certificados dentro del sistema.' },
      ]},
    ],
  },
  {
    num: '04',
    id: 'naturaleza',
    title: 'Naturaleza del servicio',
    content: [
      { type: 'paragraph', text: 'La plataforma actúa como intermediario tecnológico que facilita:' },
      { type: 'list', items: [
        'La generación de certificados digitales',
        'El registro de evidencia criptográfica',
        'La verificación de autenticidad de documentos',
      ]},
      { type: 'note', text: 'La plataforma no certifica el contenido del documento, sino únicamente su integridad respecto del registro generado.' },
    ],
  },
  {
    num: '05',
    id: 'uso-permitido',
    title: 'Uso permitido',
    content: [
      { type: 'paragraph', text: 'El usuario se compromete a utilizar la plataforma de forma legal y adecuada, quedando prohibido:' },
      { type: 'list', items: [
        'Utilizar el sistema con fines fraudulentos o ilícitos',
        'Intentar alterar, falsificar o manipular certificados',
        'Interferir con el funcionamiento del sistema',
        'Utilizar datos o documentos sin autorización',
      ]},
    ],
  },
  {
    num: '06',
    id: 'responsabilidad-emisor',
    title: 'Responsabilidad del emisor',
    content: [
      { type: 'paragraph', text: 'El emisor es el único responsable por:' },
      { type: 'list', items: [
        'La veracidad del contenido del certificado',
        'La correcta carga de los datos',
        'La legitimidad del documento emitido',
      ]},
      { type: 'note', text: 'La plataforma no valida ni audita el contenido ingresado por el emisor.' },
    ],
  },
  {
    num: '07',
    id: 'verificacion',
    title: 'Verificación de certificados',
    content: [
      { type: 'paragraph', text: 'El sistema permite verificar la autenticidad de un certificado mediante la comparación entre:' },
      { type: 'list', items: [
        'El hash del documento presentado',
        'El hash registrado en blockchain',
      ]},
      { type: 'paragraph', text: 'Un resultado positivo indica que el documento no ha sido modificado desde su registro.' },
    ],
  },
  {
    num: '08',
    id: 'limitaciones',
    title: 'Limitaciones del sistema',
    content: [
      { type: 'paragraph', text: 'El usuario comprende y acepta que:' },
      { type: 'list', items: [
        'Si el documento es modificado, incluso mínimamente, la verificación puede fallar',
        'Versiones escaneadas o alteradas pueden no coincidir exactamente con el registro original',
        'La verificación depende de la integridad del archivo presentado',
      ]},
    ],
  },
  {
    num: '09',
    id: 'disponibilidad',
    title: 'Disponibilidad del servicio',
    content: [
      { type: 'paragraph', text: 'La plataforma podrá experimentar interrupciones por mantenimiento, mejoras o causas externas.' },
      { type: 'paragraph', text: 'No se garantiza disponibilidad continua e ininterrumpida del servicio.' },
    ],
  },
  {
    num: '10',
    id: 'seguridad',
    title: 'Seguridad',
    content: [
      { type: 'paragraph', text: 'La plataforma implementa medidas de seguridad razonables para proteger la información, sin garantizar la ausencia total de vulnerabilidades.' },
      { type: 'paragraph', text: 'El usuario es responsable de proteger sus credenciales y accesos.' },
    ],
  },
  {
    num: '11',
    id: 'propiedad-intelectual',
    title: 'Propiedad intelectual',
    content: [
      { type: 'paragraph', text: 'Todos los derechos sobre la plataforma, su tecnología y su funcionamiento pertenecen a sus titulares.' },
      { type: 'paragraph', text: 'El usuario no adquiere ningún derecho de propiedad sobre el sistema.' },
    ],
  },
  {
    num: '12',
    id: 'datos',
    title: 'Protección de datos',
    content: [
      { type: 'paragraph', text: 'Los datos ingresados serán utilizados exclusivamente para el funcionamiento del servicio.' },
      { type: 'paragraph', text: 'La plataforma podrá almacenar información técnica y operativa necesaria para la verificación de certificados.' },
    ],
  },
  {
    num: '13',
    id: 'exclusion',
    title: 'Exclusión de responsabilidad',
    content: [
      { type: 'paragraph', text: 'La plataforma no será responsable por:' },
      { type: 'list', items: [
        'Uso indebido del sistema por parte de usuarios',
        'Contenido falso o incorrecto en certificados',
        'Daños derivados de la imposibilidad de verificar un documento',
        'Fallas externas a la plataforma (incluyendo redes blockchain)',
      ]},
    ],
  },
  {
    num: '14',
    id: 'modificaciones',
    title: 'Modificaciones',
    content: [
      { type: 'paragraph', text: 'La plataforma podrá modificar estos términos en cualquier momento. Las nuevas versiones serán publicadas y entrarán en vigencia desde su publicación.' },
    ],
  },
  {
    num: '15',
    id: 'legislacion',
    title: 'Legislación aplicable',
    content: [
      { type: 'paragraph', text: 'Estos términos se rigen por las leyes de la República Argentina.' },
      { type: 'paragraph', text: 'Cualquier controversia será sometida a los tribunales competentes correspondientes.' },
    ],
  },
  {
    num: '16',
    id: 'contacto',
    title: 'Contacto',
    content: [
      { type: 'paragraph', text: 'Para consultas o soporte, el usuario podrá comunicarse a través de los canales oficiales de la plataforma.' },
    ],
  },
]

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'definitions'; items: { term: string; def: string }[] }

function useFadeIn(threshold = 0.08) {
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

export default function TermsPage() {
  const [activeId, setActiveId] = useState('aceptacion')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveId(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <main style={{ background: '#050505', minHeight: '100vh', overflowX: 'clip' }}>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <LandingNavbar />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header style={{ position: 'relative', zIndex: 1, borderBottom: RULE, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '10%',
          width: '50vw', height: '60vh',
          background: `radial-gradient(ellipse at center, ${ACCENT}0d 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(120px, 14vw, 180px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 72px)',
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.18em',
            color: DIM, textTransform: 'uppercase', marginBottom: 40,
          }}>Legal</p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 70px)',
              fontWeight: 200, letterSpacing: '-0.04em',
              lineHeight: 1.04, color: '#fff', margin: 0,
            }}>
              Términos y condiciones<br />
              <span style={{ color: ACCENT }}>de uso.</span>
            </h1>
            {!isMobile && (
              <p style={{
                fontSize: 11, color: DIM,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textAlign: 'right', paddingBottom: 6,
                whiteSpace: 'nowrap',
              }}>
                Vigente desde<br />
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Abril 2026</span>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '220px 1fr',
        gap: 'clamp(40px, 6vw, 96px)',
        alignItems: 'start',
      }}>

        {/* Sidebar TOC — desktop only */}
        {!isMobile && (
          <aside style={{ position: 'sticky', top: 100 }}>
            <p style={{
              fontSize: 10, letterSpacing: '0.16em', color: DIM,
              textTransform: 'uppercase', marginBottom: 20,
            }}>
              Secciones
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SECTIONS.map(s => {
                const isActive = activeId === s.id
                return (
                  <a key={s.id} href={`#${s.id}`} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 0 7px 12px',
                    borderLeft: `1px solid ${isActive ? ACCENT : 'rgba(255,255,255,0.07)'}`,
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease',
                  }}>
                    <span style={{
                      fontSize: 9, letterSpacing: '0.08em',
                      color: isActive ? ACCENT : 'rgba(255,255,255,0.2)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'color 0.2s ease',
                      flexShrink: 0,
                    }}>
                      {s.num}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                      lineHeight: 1.4,
                      transition: 'color 0.2s ease',
                    }}>
                      {s.title}
                    </span>
                  </a>
                )
              })}
            </nav>
          </aside>
        )}

        {/* Content */}
        <div style={{ maxWidth: isMobile ? '100%' : 680 }}>
          {SECTIONS.map((section, i) => (
            <Section key={section.id} section={section} isLast={i === SECTIONS.length - 1} />
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <LandingFooter />
      </div>
    </main>
  )
}

function Section({ section, isLast }: { section: typeof SECTIONS[0]; isLast: boolean }) {
  const { ref, visible } = useFadeIn()

  return (
    <div
      id={section.id}
      ref={ref}
      style={{
        paddingBottom: isLast ? 0 : 'clamp(40px, 5vw, 64px)',
        marginBottom: isLast ? 0 : 'clamp(40px, 5vw, 64px)',
        borderBottom: isLast ? 'none' : RULE,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
        <span style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 200, letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.1)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1, flexShrink: 0,
        }}>
          {section.num}
        </span>
        <h2 style={{
          fontSize: 'clamp(16px, 1.6vw, 20px)',
          fontWeight: 400, letterSpacing: '-0.02em',
          color: '#fff', lineHeight: 1.2, margin: 0,
        }}>
          {section.title}
        </h2>
      </div>

      {/* Blocks */}
      <div style={{ paddingLeft: 0 }}>
        {(section.content as ContentBlock[]).map((block, i) => (
          <ContentBlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') {
    return (
      <p style={{
        fontSize: 'clamp(14px, 1.2vw, 16px)',
        fontWeight: 300,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.85,
        margin: '0 0 16px',
      }}>
        {block.text}
      </p>
    )
  }

  if (block.type === 'list') {
    return (
      <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none' }}>
        {block.items.map((item, i) => (
          <li key={i} style={{
            display: 'flex', gap: 12,
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.75,
            marginBottom: 8,
          }}>
            <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>—</span>
            {item}
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'note') {
    return (
      <div style={{
        margin: '8px 0 16px',
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.02)',
        border: RULE,
        borderLeft: `2px solid ${ACCENT}55`,
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{
          fontSize: 13,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.75,
          margin: 0,
          fontStyle: 'italic',
        }}>
          {block.text}
        </p>
      </div>
    )
  }

  if (block.type === 'definitions') {
    return (
      <div style={{ margin: '0 0 16px' }}>
        {block.items.map((d, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: 20,
            padding: '14px 0',
            borderBottom: i < block.items.length - 1 ? RULE : 'none',
          }}>
            <span style={{
              fontSize: 12, fontWeight: 400,
              color: '#fff', letterSpacing: '-0.01em',
            }}>
              {d.term}
            </span>
            <span style={{
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
            }}>
              {d.def}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return null
}
