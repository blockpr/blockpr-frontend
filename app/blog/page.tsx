'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'
const RULE   = '1px solid rgba(255,255,255,0.07)'

const POSTS = [
  {
    slug: 'fraude-documental-latinoamerica',
    category: 'Industria',
    title: 'El fraude documental en Latinoamérica: cifras que cambian la conversación',
    excerpt: 'Más del 30% de los documentos verificados manualmente en procesos de onboarding contienen algún tipo de alteración. Analizamos el estado del problema y por qué se subestima.',
    date: 'Mar 2026',
    readTime: '6 min',
    featured: true,
  },
  {
    slug: 'como-funciona-verificacion-blockchain',
    category: 'Tecnología',
    title: 'Cómo funciona la verificación blockchain en unickeys',
    excerpt: 'SHA-256, Merkle Trees y Solana: los tres pilares técnicos que hacen que un certificado sea imposible de falsificar sin que nadie lo note.',
    date: 'Feb 2026',
    readTime: '8 min',
    featured: false,
  },
  {
    slug: 'merkle-trees-para-no-desarrolladores',
    category: 'Tecnología',
    title: 'Merkle Trees explicados para no-desarrolladores',
    excerpt: 'Una estructura de datos que parece un árbol genealógico y garantiza que si alguien toca un dato, todo el árbol lo sabe.',
    date: 'Ene 2026',
    readTime: '5 min',
    featured: false,
  },
  {
    slug: 'por-que-elegimos-solana',
    category: 'Decisiones',
    title: 'Por qué elegimos Solana y no Ethereum para anclar los registros',
    excerpt: 'Velocidad, costo por transacción, huella de carbono. Las tres variables que definieron una decisión técnica que tomamos en noviembre de 2025.',
    date: 'Dic 2025',
    readTime: '7 min',
    featured: false,
  },
  {
    slug: 'certificados-educativos-verificables',
    category: 'Casos de uso',
    title: 'Certificados educativos verificables: el caso de las universidades',
    excerpt: 'Las instituciones educativas emiten millones de diplomas por año. El problema: no existe un estándar para verificarlos sin llamar al registro.',
    date: 'Nov 2025',
    readTime: '4 min',
    featured: false,
  },
  {
    slug: 'modelo-api-keys-github',
    category: 'Producto',
    title: 'El modelo GitHub para API keys: mostrar una vez, nunca más',
    excerpt: 'Cómo diseñamos el flujo de creación y visualización de credenciales para que sea seguro por defecto, sin sacrificar experiencia de usuario.',
    date: 'Nov 2025',
    readTime: '3 min',
    featured: false,
  },
  {
    slug: 'rrhh-verificacion-antecedentes-laborales',
    category: 'Casos de uso',
    title: 'RRHH: emisión de constancias laborales verificables al instante',
    excerpt: 'Con unickeys, cualquier área de RRHH puede emitir constancias de empleo, certificados de desempeño o cartas de recomendación con un QR que el receptor valida en segundos, sin llamar a nadie.',
    date: 'Mar 2026',
    readTime: '5 min',
    featured: false,
  },
  {
    slug: 'rrhh-certificados-capacitacion-falsificados',
    category: 'Casos de uso',
    title: 'Certificados de capacitación que no se pueden falsificar',
    excerpt: 'Emitís el certificado desde tu plataforma, unickeys lo firma criptográficamente y lo ancla en blockchain. Cualquier empresa puede verificarlo sin contactarte.',
    date: 'Feb 2026',
    readTime: '4 min',
    featured: false,
  },
  {
    slug: 'legal-contratos-con-prueba-criptografica',
    category: 'Casos de uso',
    title: 'Estudios jurídicos: documentos legales con trazabilidad inmutable',
    excerpt: 'Cada versión de un contrato, poder o acuerdo queda registrada con hash y timestamp en Solana. Si alguien altera el documento, la verificación falla. Punto.',
    date: 'Ene 2026',
    readTime: '7 min',
    featured: false,
  },
  {
    slug: 'legal-poderes-notariales-verificables',
    category: 'Casos de uso',
    title: 'Poderes notariales verificables para operaciones remotas',
    excerpt: 'Tu estudio emite el poder con unickeys. El receptor escanea el QR y ve en tiempo real si el documento es válido, sin intermediarios ni llamadas al escribano.',
    date: 'Dic 2025',
    readTime: '5 min',
    featured: false,
  },
  {
    slug: 'fintech-kyc-documentacion-resistente-fraude',
    category: 'Casos de uso',
    title: 'Fintech: onboarding KYC con verificación criptográfica de documentos',
    excerpt: 'Integrá unickeys en tu flujo de onboarding para validar que los documentos presentados por el usuario no fueron alterados, antes de aprobar cualquier operación.',
    date: 'Dic 2025',
    readTime: '6 min',
    featured: false,
  },
  {
    slug: 'fintech-comprobantes-transferencia-falsificados',
    category: 'Casos de uso',
    title: 'Comprobantes de pago que el receptor puede verificar sin confiar en el emisor',
    excerpt: 'Tu plataforma emite el comprobante firmado. El receptor lo valida escaneando el QR. Sin posibilidad de adulteración, sin depender de que tu sistema esté online.',
    date: 'Nov 2025',
    readTime: '4 min',
    featured: false,
  },
]

const CATEGORIES = ['Todo', 'Casos de uso', 'Tecnología', 'Industria', 'Producto', 'Decisiones']

function useFadeIn(threshold = 0.1) {
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

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todo')

  const filtered = activeCategory === 'Todo'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory)

  const featured = filtered.find(p => p.featured) ?? filtered[0]
  const rest     = filtered.filter(p => p !== featured)

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
      <section style={{ position: 'relative', zIndex: 1, borderBottom: RULE, overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '-10%', left: '60%',
          width: '60vw', height: '50vh',
          background: `radial-gradient(ellipse at center, ${ACCENT}12 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(120px, 14vw, 180px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 72px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <p style={{
                fontSize: 10, letterSpacing: '0.18em',
                color: DIM, textTransform: 'uppercase', marginBottom: 40,
              }}>Blog</p>
              <h1 style={{
                fontSize: 'clamp(36px, 5.5vw, 78px)',
                fontWeight: 200, letterSpacing: '-0.04em',
                lineHeight: 1.04, color: '#fff', margin: 0,
              }}>
                Tecnología, producto<br />
                <span style={{ color: ACCENT }}>y confianza digital.</span>
              </h1>
            </div>
            <p style={{
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 300, color: DIM,
              lineHeight: 1.75, maxWidth: '38ch',
              margin: 0, paddingBottom: 8,
            }}>
              Escribimos sobre lo que construimos, las decisiones que tomamos y el problema que intentamos resolver.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filtros ───────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'flex', gap: 0,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '20px 24px',
                fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeCategory === cat ? '#fff' : DIM,
                borderBottom: 'none',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                whiteSpace: 'nowrap',
                marginBottom: -1,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Posts ────────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)' }}>

        {/* Featured post */}
        {featured && <FeaturedPost post={featured} />}

        {/* Rest */}
        {rest.length > 0 && <PostsGrid posts={rest} />}

      </div>

      <LandingFooter />
    </main>
  )
}

// ─── Featured post ────────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: typeof POSTS[0] }) {
  const { ref, visible } = useFadeIn()
  const [hovered, setHovered] = useState(false)

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.9s ease, transform 0.9s ease',
      marginBottom: 2,
    }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            border: RULE,
            background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
            transition: 'background 0.3s ease',
            cursor: 'pointer',
          }}
        >
          {/* Left */}
          <div style={{
            padding: 'clamp(40px, 5vw, 64px)',
            borderRight: RULE,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 320,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.14em',
                  color: ACCENT, textTransform: 'uppercase',
                }}>
                  {post.category}
                </span>
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)' }} />
                <span style={{ fontSize: 10, letterSpacing: '0.1em', color: DIM, textTransform: 'uppercase' }}>
                  Destacado
                </span>
              </div>

              <h2 style={{
                fontSize: 'clamp(22px, 2.8vw, 38px)',
                fontWeight: 200, letterSpacing: '-0.03em',
                lineHeight: 1.12, color: '#fff', margin: '0 0 24px',
              }}>
                {post.title}
              </h2>

              <p style={{
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                fontWeight: 300, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75, margin: 0, maxWidth: '60ch',
              }}>
                {post.excerpt}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
              <span style={{ fontSize: 11, color: DIM, letterSpacing: '0.08em' }}>{post.date}</span>
              <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 11, color: DIM, letterSpacing: '0.08em' }}>{post.readTime} lectura</span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 11, letterSpacing: '0.08em',
                color: hovered ? ACCENT : DIM,
                transition: 'color 0.2s ease',
              }}>
                Leer →
              </span>
            </div>
          </div>

          {/* Right — index number */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40,
          }}>
            <span style={{
              fontSize: 'clamp(80px, 12vw, 160px)',
              fontWeight: 200,
              letterSpacing: '-0.06em',
              color: hovered ? ACCENT : 'rgba(255,255,255,0.05)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              transition: 'color 0.3s ease',
              userSelect: 'none',
            }}>
              01
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ─── Posts grid ───────────────────────────────────────────────────────────────

function PostsGrid({ posts }: { posts: typeof POSTS }) {
  const { ref, visible } = useFadeIn()

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 2,
      marginTop: 2,
    }}>
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i + 2} visible={visible} delay={i * 0.1} />
      ))}
    </div>
  )
}

function PostCard({
  post, index, visible, delay,
}: {
  post: typeof POSTS[0]
  index: number
  visible: boolean
  delay: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: RULE,
          padding: '36px 32px',
          background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
          transition: `background 0.3s ease, opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 280,
        }}
      >
        {/* Index + category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <span style={{
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 200, letterSpacing: '-0.05em',
            color: hovered ? ACCENT : 'rgba(255,255,255,0.07)',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            transition: 'color 0.3s ease',
          }}>
            {String(index).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 10, letterSpacing: '0.12em',
            color: hovered ? ACCENT : DIM,
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'clamp(16px, 1.5vw, 20px)',
          fontWeight: 300, letterSpacing: '-0.02em',
          lineHeight: 1.25, color: '#fff',
          margin: '0 0 16px', flex: 1,
        }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontSize: 13, fontWeight: 300,
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.7, margin: '0 0 28px',
        }}>
          {post.excerpt}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
          <span style={{ fontSize: 10, color: DIM, letterSpacing: '0.08em' }}>{post.date}</span>
          <span style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 10, color: DIM, letterSpacing: '0.08em' }}>{post.readTime}</span>
          <span style={{
            marginLeft: 'auto', fontSize: 10,
            color: hovered ? ACCENT : 'transparent',
            transition: 'color 0.2s ease',
            letterSpacing: '0.08em',
          }}>
            Leer →
          </span>
        </div>
      </div>
    </Link>
  )
}
