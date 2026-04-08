'use client'

import { useEffect, useRef, useState } from 'react'

const TITLE = [
  'Durante años confiamos en que los documentos eran prueba suficiente.',
  'Hoy, esa confianza ya no es garantía.',
  'Con tecnología accesible, muchos pueden falsificarse en minutos.',
  'Sin ruido, sin señales evidentes.',
  '¿Qué tan seguro está el tuyo?',
]
const TOTAL_CHARS = TITLE.reduce((sum, l) => sum + l.length, 0)

const PROBLEMS = [
  {
    num: '01',
    title: 'Un PDF se edita en minutos',
    body: 'Acrobat, Photoshop, cualquier herramienta. El documento parece idéntico al original. Nadie lo nota.',
  },
  {
    num: '02',
    title: 'Sin registro independiente',
    body: 'Las bases de datos del emisor se pueden hackear, modificar o simplemente desaparecer.',
  },
  {
    num: '03',
    title: 'Verificar toma días',
    body: 'Sin verificación automática, el fraude pasa desapercibido hasta que ya es tarde.',
  },
]

export function LandingProblem() {
  const wrapperRef       = useRef<HTMLDivElement>(null)
  const revealedRef      = useRef(false)
  const revealOriginRef  = useRef(0)
  const scrollProgressRef = useRef(0)

  const [textVisible,    setTextVisible]    = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile,       setIsMobile]       = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const resetAll = () => {
    setTextVisible(false)
    revealedRef.current     = false
    revealOriginRef.current = 0
  }

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (top > 0) {
        scrollProgressRef.current = 0
        setScrollProgress(0)
        if (revealedRef.current) resetAll()
        return
      }
      const maxScroll = el.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -top / maxScroll))
      scrollProgressRef.current = p
      setScrollProgress(p)

      if (revealedRef.current && p < revealOriginRef.current - 0.03) {
        resetAll()
        return
      }

      if (!revealedRef.current && p >= 0.05) {
        revealedRef.current     = true
        revealOriginRef.current = p
        setTextVisible(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const TEXT_RANGE  = 0.65
  const CARDS_RANGE = 0.10
  const SMOOTH      = 8

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

  const charsPerLine = TITLE.map(l => l.length)
  const lineStart = charsPerLine.reduce<number[]>((acc, _, i) =>
    [...acc, i === 0 ? 0 : acc[i - 1] + charsPerLine[i - 1]], []
  )

  const charOpacity = (globalIndex: number) => {
    if (!textVisible) return 0.3
    const rel = Math.max(0, scrollProgress - revealOriginRef.current)
    const p   = clamp(rel / TEXT_RANGE)
    const t   = clamp((p * (TOTAL_CHARS + SMOOTH - 1) - globalIndex) / SMOOTH)
    return 0.3 + t * 0.7
  }

  const textDoneAt    = revealOriginRef.current + TEXT_RANGE
  const cardsProgress = !textVisible ? 0 : clamp((scrollProgress - textDoneAt) / CARDS_RANGE)

  // Histéresis por dirección: aparecen en 0.4 (forward), desaparecen en 0.75 (backward, blur ~14px)
  const cardsActiveRef   = useRef(false)
  const prevCardsProgRef = useRef(0)
  const goingBack = cardsProgress < prevCardsProgRef.current
  prevCardsProgRef.current = cardsProgress
  if (!cardsActiveRef.current && cardsProgress >= 0.4) cardsActiveRef.current = true
  if (cardsActiveRef.current && goingBack && cardsProgress < 0.92) cardsActiveRef.current = false
  const cardsTriggered = cardsActiveRef.current

  return (
    <div ref={wrapperRef} style={{ height: '450vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#050505',
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute', inset: 0,
          filter: cardsProgress > 0 ? `blur(${cardsProgress * 18}px)` : undefined,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontWeight: 300, fontSize: 'clamp(20px, 2.4vw, 36px)',
            lineHeight: 1.06, margin: 0, letterSpacing: '-0.025em',
            textAlign: 'center', width: 'fit-content',
          }}>
            {TITLE.map((line, li) => (
              <span key={li} style={{ display: 'block' }}>
                {line.split('').map((ch, ci) => (
                  <span key={ci} style={{
                    color: '#fff',
                    opacity: charOpacity(lineStart[li] + ci),
                    transition: 'opacity 0.15s ease',
                    whiteSpace: ch === ' ' ? 'pre' : undefined,
                  }}>{ch}</span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(5,5,5,${cardsProgress * 0.72})`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '0 20px' : '0 48px',
          pointerEvents: cardsProgress > 0.05 ? 'auto' : 'none',
          zIndex: 2,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 14 : 24,
            maxWidth: 1200,
            width: '100%',
          }}>
            {PROBLEMS.map((p, i) => {
              return (
                <div key={p.num} style={{
                  opacity: cardsTriggered ? 1 : 0,
                  transform: cardsTriggered ? 'translateY(0px)' : 'translateY(32px)',
                  transition: `opacity 0.8s ease ${i * 0.22}s, transform 0.8s ease ${i * 0.22}s`,
                  padding: isMobile ? '24px 20px' : '40px 36px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  textAlign: 'left',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: 14, letterSpacing: '0.08em',
                    color: '#000', marginBottom: isMobile ? 16 : 32,
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6,
                    padding: '4px 10px',
                  }}>{p.num}</span>
                  <p style={{
                    fontSize: isMobile ? 17 : 20, fontWeight: 400, color: '#fff',
                    margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.25,
                  }}>{p.title}</p>
                  <p style={{
                    fontSize: isMobile ? 14 : 18, color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.7, margin: 0, fontWeight: 300,
                  }}>{p.body}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
