'use client'

import { useState, useEffect, useRef } from 'react'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'
const RULE   = '1px solid rgba(255,255,255,0.07)'

const SECTIONS = [
  {
    num: '01', id: 'introduccion', title: 'Introducción',
    content: [
      { type: 'paragraph', text: 'La presente Política de Privacidad describe cómo se recopila, utiliza, almacena y protege la información de los usuarios que acceden y utilizan la plataforma.' },
      { type: 'note', text: 'El uso del servicio implica la aceptación de esta política.' },
    ],
  },
  {
    num: '02', id: 'informacion', title: 'Información que recopilamos',
    content: [
      { type: 'subheading', text: 'Datos proporcionados por el usuario' },
      { type: 'paragraph', text: 'Podemos recopilar información como:' },
      { type: 'list', items: ['Nombre y apellido', 'Documento de identidad', 'Correo electrónico', 'Información asociada a certificados', 'Datos ingresados por emisores en los documentos'] },
      { type: 'subheading', text: 'Información técnica' },
      { type: 'paragraph', text: 'De forma automática, podemos recopilar:' },
      { type: 'list', items: ['Dirección IP', 'Tipo de dispositivo y navegador', 'Fecha y hora de acceso', 'Logs de uso del sistema'] },
      { type: 'subheading', text: 'Información derivada del servicio' },
      { type: 'list', items: ['Hashes de documentos (huellas criptográficas)', 'Metadatos asociados a certificados', 'Historial de verificaciones'] },
    ],
  },
  {
    num: '03', id: 'finalidad', title: 'Finalidad del uso de los datos',
    content: [
      { type: 'paragraph', text: 'La información recopilada se utiliza para:' },
      { type: 'list', items: ['Operar y mantener la plataforma', 'Generar y verificar certificados', 'Garantizar la integridad de los documentos', 'Mejorar el servicio y la experiencia del usuario', 'Prevenir usos indebidos o fraudulentos'] },
    ],
  },
  {
    num: '04', id: 'criptografia', title: 'Uso de tecnología criptográfica',
    content: [
      { type: 'paragraph', text: 'La plataforma puede registrar hashes de documentos en redes blockchain.' },
      { type: 'paragraph', text: 'Estos registros:' },
      { type: 'list', items: ['No contienen información personal directa', 'Son inmutables y no pueden ser eliminados', 'Se utilizan únicamente para validar la integridad de los certificados'] },
    ],
  },
  {
    num: '05', id: 'almacenamiento', title: 'Almacenamiento de la información',
    content: [
      { type: 'paragraph', text: 'Los datos pueden almacenarse en servidores propios o de terceros que cumplan con estándares razonables de seguridad.' },
      { type: 'paragraph', text: 'Se aplican medidas técnicas y organizativas para proteger la información contra accesos no autorizados, pérdida o alteración.' },
    ],
  },
  {
    num: '06', id: 'conservacion', title: 'Conservación de datos',
    content: [
      { type: 'paragraph', text: 'Los datos serán conservados durante el tiempo necesario para cumplir con las finalidades del servicio, o según lo exija la normativa aplicable.' },
      { type: 'note', text: 'Los hashes registrados en blockchain pueden permanecer de forma indefinida debido a la naturaleza de dicha tecnología.' },
    ],
  },
  {
    num: '07', id: 'comparticion', title: 'Compartición de datos',
    content: [
      { type: 'paragraph', text: 'La plataforma no vende ni comercializa datos personales.' },
      { type: 'paragraph', text: 'Podrá compartir información en los siguientes casos:' },
      { type: 'list', items: ['Con proveedores tecnológicos que prestan servicios a la plataforma', 'Cuando sea requerido por autoridades competentes', 'Para proteger derechos, seguridad o integridad del sistema'] },
    ],
  },
  {
    num: '08', id: 'responsabilidad-emisor', title: 'Responsabilidad del emisor',
    content: [
      { type: 'paragraph', text: 'El emisor de certificados es responsable de los datos personales incluidos en los documentos.' },
      { type: 'note', text: 'La plataforma no valida la veracidad ni legitimidad de dicha información.' },
    ],
  },
  {
    num: '09', id: 'derechos', title: 'Derechos del usuario',
    content: [
      { type: 'paragraph', text: 'El usuario podrá ejercer sus derechos de:' },
      { type: 'list', items: ['Acceso', 'Rectificación', 'Actualización', 'Supresión'] },
      { type: 'note', text: 'De acuerdo con la legislación vigente en la República Argentina (Ley 25.326).' },
    ],
  },
  {
    num: '10', id: 'seguridad', title: 'Seguridad',
    content: [
      { type: 'paragraph', text: 'Se implementan medidas de seguridad razonables para proteger la información.' },
      { type: 'paragraph', text: 'Sin embargo, el usuario reconoce que ningún sistema es completamente seguro.' },
    ],
  },
  {
    num: '11', id: 'cookies', title: 'Cookies y tecnologías similares',
    content: [
      { type: 'paragraph', text: 'La plataforma puede utilizar cookies para:' },
      { type: 'list', items: ['Mejorar la experiencia del usuario', 'Analizar el uso del sistema', 'Recordar preferencias'] },
      { type: 'paragraph', text: 'El usuario puede configurar su navegador para rechazarlas.' },
    ],
  },
  {
    num: '12', id: 'terceros', title: 'Servicios de terceros',
    content: [
      { type: 'paragraph', text: 'La plataforma puede integrar servicios de terceros (infraestructura, blockchain, analítica, etc.).' },
      { type: 'paragraph', text: 'Dichos servicios pueden tener sus propias políticas de privacidad.' },
    ],
  },
  {
    num: '13', id: 'transferencias', title: 'Transferencias internacionales',
    content: [
      { type: 'paragraph', text: 'En caso de utilizar servicios de terceros ubicados fuera del país, los datos pueden ser transferidos internacionalmente, garantizando niveles adecuados de protección.' },
    ],
  },
  {
    num: '14', id: 'modificaciones', title: 'Modificaciones',
    content: [
      { type: 'paragraph', text: 'La plataforma podrá modificar esta política en cualquier momento.' },
      { type: 'paragraph', text: 'Las modificaciones entrarán en vigencia desde su publicación.' },
    ],
  },
  {
    num: '15', id: 'contacto', title: 'Contacto',
    content: [
      { type: 'paragraph', text: 'Para consultas relacionadas con privacidad, el usuario podrá comunicarse a través de los canales oficiales de la plataforma.' },
    ],
  },
  {
    num: '16', id: 'autoridad', title: 'Autoridad de control',
    content: [
      { type: 'paragraph', text: 'La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender denuncias y reclamos relacionados con el incumplimiento de normas sobre protección de datos personales.' },
    ],
  },
]

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string }

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

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState('introduccion')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) })
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

      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <LandingNavbar />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 1, borderBottom: RULE, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '15%',
          width: '55vw', height: '55vh',
          background: `radial-gradient(ellipse at center, ${ACCENT}0c 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(120px, 14vw, 180px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 72px)',
        }}>
          <p style={{ fontSize: 10, letterSpacing: '0.18em', color: DIM, textTransform: 'uppercase', marginBottom: 40 }}>Legal</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 40 }}>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 70px)',
              fontWeight: 200, letterSpacing: '-0.04em',
              lineHeight: 1.04, color: '#fff', margin: 0,
            }}>
              Política de<br />
              <span style={{ color: ACCENT }}>privacidad.</span>
            </h1>
            <p style={{
              fontSize: 11, color: DIM,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textAlign: 'right', paddingBottom: 6, whiteSpace: 'nowrap',
            }}>
              Vigente desde<br />
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Abril 2026</span>
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 'clamp(40px, 6vw, 96px)',
        alignItems: 'start',
      }}>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 100 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.16em', color: DIM, textTransform: 'uppercase', marginBottom: 20 }}>
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
                    transition: 'color 0.2s ease', flexShrink: 0,
                  }}>{s.num}</span>
                  <span style={{
                    fontSize: 11,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease',
                  }}>{s.title}</span>
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <div style={{ maxWidth: 680 }}>
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
    <div id={section.id} ref={ref} style={{
      paddingBottom: isLast ? 0 : 'clamp(40px, 5vw, 64px)',
      marginBottom:  isLast ? 0 : 'clamp(40px, 5vw, 64px)',
      borderBottom:  isLast ? 'none' : RULE,
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
        <span style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 200, letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.1)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1, flexShrink: 0,
        }}>{section.num}</span>
        <h2 style={{
          fontSize: 'clamp(16px, 1.6vw, 20px)',
          fontWeight: 400, letterSpacing: '-0.02em',
          color: '#fff', lineHeight: 1.2, margin: 0,
        }}>{section.title}</h2>
      </div>

      <div>
        {(section.content as ContentBlock[]).map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') return (
    <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, margin: '0 0 16px' }}>
      {block.text}
    </p>
  )

  if (block.type === 'subheading') return (
    <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '28px 0 12px' }}>
      {block.text}
    </p>
  )

  if (block.type === 'list') return (
    <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none' }}>
      {block.items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 8 }}>
          <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  )

  if (block.type === 'note') return (
    <div style={{ margin: '8px 0 16px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: RULE, borderLeft: `2px solid ${ACCENT}55`, borderRadius: '0 6px 6px 0' }}>
      <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
        {block.text}
      </p>
    </div>
  )

  return null
}
