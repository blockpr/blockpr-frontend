'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useContactStore } from '@/stores/contactStore'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const TOPICS = [
  'Ventas',
  'Soporte técnico',
  'Integración / API',
  'Prensa',
  'Otro',
]

// ── Topic Dropdown ────────────────────────────────────────────────────────────

function TopicSelect({
  value, onChange, focused, onFocus, onBlur,
}: {
  value: string
  onChange: (v: string) => void
  focused: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
        onBlur()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onBlur])

  const handleToggle = () => {
    if (!open) { setOpen(true); onFocus() }
    else        { setOpen(false); onBlur() }
  }

  const handleSelect = (v: string) => {
    onChange(v)
    setOpen(false)
    onBlur()
  }

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: open ? '6px 6px 0 0' : 6,
          padding: '11px 36px 11px 14px',
          fontSize: 13,
          color: value ? '#fff' : 'rgba(255,255,255,0.28)',
          outline: 'none',
          fontFamily: 'inherit',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
      >
        <span>{value || 'Seleccioná un motivo'}</span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{
            position: 'absolute', right: 14, top: '50%',
            transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            transition: 'transform 0.2s',
            pointerEvents: 'none',
          }}
        >
          <path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.10)',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          overflow: 'hidden',
        }}>
          {TOPICS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => handleSelect(t)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                fontSize: 13,
                fontFamily: 'inherit',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: t === value ? ACCENT : 'rgba(255,255,255,0.65)',
                background: 'none',
                border: 'none',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = t === value ? ACCENT : 'rgba(255,255,255,0.65)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Contact Modal ─────────────────────────────────────────────────────────────

function ContactModal({ onClose }: { onClose: () => void }) {
  const [topic,   setTopic]   = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, name, email, message }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('No se pudo enviar el mensaje. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6,
    padding: '11px 14px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 300,
    letterSpacing: '-0.01em',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: DIM,
    marginBottom: 7,
    fontWeight: 500,
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: isMobile ? '#0d0d0d' : 'rgba(0,0,0,0.72)',
        backdropFilter: isMobile ? 'none' : 'blur(6px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: 0,
        overflowY: isMobile ? 'auto' : 'hidden',
      }}
    >
      <div style={{
        background: '#0d0d0d',
        border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.09)',
        borderRadius: isMobile ? 0 : 12,
        padding: isMobile ? '80px 24px 48px' : 'clamp(28px, 4vw, 40px)',
        width: '100%',
        maxWidth: isMobile ? '100%' : 460,
        minHeight: isMobile ? '100dvh' : 'auto',
        maxHeight: isMobile ? 'none' : 'calc(100dvh - 80px)',
        overflowY: isMobile ? 'visible' : 'auto',
        marginTop: isMobile ? 0 : 60,
        position: 'relative',
        boxShadow: isMobile ? 'none' : '0 32px 80px rgba(0,0,0,0.6)',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: isMobile ? 20 : 16,
            left: isMobile ? 20 : 'auto',
            right: isMobile ? 'auto' : 16,
            background: isMobile ? 'rgba(255,255,255,0.07)' : 'none',
            border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            padding: isMobile ? '8px 14px' : 4,
            lineHeight: 1,
            borderRadius: isMobile ? 8 : 0,
            fontSize: isMobile ? 13 : 18,
            letterSpacing: isMobile ? '0.04em' : 0,
            transition: 'color 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
            zIndex: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          {isMobile ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </>
          ) : '✕'}
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(77,184,136,0.12)',
              border: `1px solid ${ACCENT}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 20,
            }}>
              ✓
            </div>
            <p style={{ fontSize: 16, fontWeight: 300, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Mensaje enviado
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.36)', fontWeight: 300 }}>
              Te respondemos a la brevedad.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontSize: 9, letterSpacing: '0.16em', color: DIM,
                textTransform: 'uppercase', marginBottom: 8, fontWeight: 500,
              }}>
                unickeys
              </p>
              <h2 style={{
                fontSize: 22, fontWeight: 200, color: '#fff',
                letterSpacing: '-0.04em', margin: 0,
              }}>
                Contacto
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Topic */}
              <div>
                <label style={labelStyle}>Motivo</label>
                <TopicSelect
                  value={topic}
                  onChange={setTopic}
                  focused={focusedField === 'topic'}
                  onFocus={() => setFocusedField('topic')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input
                  type="text"
                  required
                  placeholder="Juan García"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBase,
                    borderColor: focusedField === 'name' ? ACCENT : 'rgba(255,255,255,0.10)',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="juan@empresa.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBase,
                    borderColor: focusedField === 'email' ? ACCENT : 'rgba(255,255,255,0.10)',
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Mensaje</label>
                  <span style={{
                    fontSize: 10, letterSpacing: '0.06em',
                    color: message.length > 360
                      ? message.length >= 400 ? '#e05252' : '#d4a83a'
                      : 'rgba(255,255,255,0.18)',
                    transition: 'color 0.2s',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {message.length}/400
                  </span>
                </div>
                <textarea
                  required
                  maxLength={400}
                  placeholder="Contanos en qué podemos ayudarte..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  style={{
                    ...inputBase,
                    borderColor: focusedField === 'message' ? ACCENT : 'rgba(255,255,255,0.10)',
                    resize: 'none',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p style={{ fontSize: 12, color: '#e05252', margin: 0, letterSpacing: '-0.01em' }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  background: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontSize: 12,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: '#050505',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1' }}
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ── Mini hero canvas ──────────────────────────────────────────────────────────

function FooterWordmark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, DPR = 1
    let animId: number
    let time = 0

    const SPRING  = 0.020
    const DAMPING = 0.90
    const REPEL_R = 80
    const RR2     = REPEL_R * REPEL_R
    const REPEL_F = 90
    const STEP    = 2

    const mouse = { x: -9999, y: -9999 }

    type TC = {
      targetX: number; targetY: number
      x: number; y: number
      vx: number; vy: number
      r: number; brightness: number
      orbitR: number; orbitFreq: number; orbitAngle: number
      linked: boolean
    }

    let textClusters: TC[] = []
    let tcGrid: number[][] = []

    function build() {
      const fontSize = Math.round(H * 0.82)

      const oc       = document.createElement('canvas')
      oc.width       = W
      oc.height      = H * 2
      const octx     = oc.getContext('2d')!
      octx.fillStyle = '#fff'
      octx.font      = `100 ${fontSize}px -apple-system, BlinkMacSystemFont, Inter, sans-serif`
      octx.textAlign    = 'left'
      octx.textBaseline = 'middle'
      octx.fillText('unickeys', W * 0.03, oc.height / 2)

      const data = octx.getImageData(0, 0, oc.width, oc.height).data
      const pts: { x: number; y: number }[] = []
      for (let py = 0; py < oc.height; py += STEP) {
        for (let px = 0; px < oc.width; px += STEP) {
          if (data[(py * oc.width + px) * 4 + 3] > 80) {
            pts.push({ x: px, y: py - oc.height / 2 + H / 2 })
          }
        }
      }

      textClusters = pts.map(t => ({
        targetX: t.x, targetY: t.y,
        x: t.x + (Math.random() - 0.5) * W * 0.6,
        y: t.y + (Math.random() - 0.5) * H * 0.8,
        vx: 0, vy: 0,
        r:  0.6 + Math.random() * 1.0,
        brightness: 0.45 + Math.random() * 0.45,
        orbitR:    1.5 + Math.random() * 3.0,
        orbitFreq: 0.04 + Math.random() * 0.08,
        orbitAngle: Math.random() * Math.PI * 2,
        linked: Math.random() < 0.30,
      }))
    }

    function draw() {
      time += 0.016
      ctx.save()
      ctx.scale(DPR, DPR)
      ctx.clearRect(0, 0, W, H)

      const TC_DIST  = 14
      const linkedTC = textClusters.filter(c => c.linked)
      const tccols   = Math.ceil(W / TC_DIST) + 1
      const tcrows   = Math.ceil(H / TC_DIST) + 1
      const tcSize   = tccols * tcrows
      if (tcGrid.length !== tcSize) tcGrid = Array.from({ length: tcSize }, () => [])
      else tcGrid.forEach(c => { c.length = 0 })

      textClusters.forEach(c => {
        const restX = c.targetX + Math.cos(time * c.orbitFreq + c.orbitAngle) * c.orbitR
        const restY = c.targetY + Math.sin(time * c.orbitFreq + c.orbitAngle) * c.orbitR * 0.65
        c.vx += (restX - c.x) * SPRING
        c.vy += (restY - c.y) * SPRING
        const dx = c.x - mouse.x, dy = c.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < RR2 && d2 > 0) {
          const dist = Math.sqrt(d2)
          const f = (1 - dist / REPEL_R) * REPEL_F
          c.vx += (dx / dist) * f * 0.001
          c.vy += (dy / dist) * f * 0.001
        }
        c.vx *= DAMPING; c.vy *= DAMPING
        c.x  += c.vx;   c.y  += c.vy
      })

      linkedTC.forEach((c, i) => {
        const ci = Math.floor(c.x / TC_DIST) + Math.floor(c.y / TC_DIST) * tccols
        if (ci >= 0 && ci < tcSize) tcGrid[ci].push(i)
      })

      // Lines
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.lineWidth = 0.4
      for (let i = 0; i < linkedTC.length; i++) {
        const a   = linkedTC[i]
        const acx = Math.floor(a.x / TC_DIST), acy = Math.floor(a.y / TC_DIST)
        for (let dy2 = -1; dy2 <= 1; dy2++) {
          for (let dx2 = -1; dx2 <= 1; dx2++) {
            const nx = acx + dx2, ny = acy + dy2
            if (nx < 0 || nx >= tccols || ny < 0 || ny >= tcrows) continue
            for (const j of tcGrid[ny * tccols + nx]) {
              if (j <= i) continue
              const b   = linkedTC[j]
              const ddx = a.x - b.x, ddy = a.y - b.y
              if (ddx * ddx + ddy * ddy < TC_DIST * TC_DIST) {
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
              }
            }
          }
        }
      }
      ctx.stroke()

      // Dots
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,255,255,0.60)'
      textClusters.forEach(c => {
        ctx.moveTo(c.x + c.r, c.y)
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
      })
      ctx.fill()

      ctx.restore()
      animId = requestAnimationFrame(draw)
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.parentElement!.getBoundingClientRect()
      DPR = window.devicePixelRatio || 1
      W   = rect.width
      H   = rect.height
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      build()
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', resize)
    resize()
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
    />
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const LINKS = [
  {
    label: 'Producto',
    items: [
      { name: 'Dashboard',      href: '/dashboard',           modal: false },
      { name: 'Emisiones',      href: '/dashboard/emissions', modal: false },
      { name: 'Verificación',   href: '/verify',              modal: false },
      { name: 'API Keys',       href: '/dashboard/api-keys',  modal: false },
    ],
  },
  {
    label: 'Developers',
    items: [
      { name: 'Documentación',  href: '/docs',          modal: false },
      { name: 'API Reference',  href: '/docs#api',       modal: false },
      { name: 'Webhooks',       href: '/docs#webhooks',  modal: false },
      { name: 'Changelog',      href: '/docs#changelog', modal: false },
    ],
  },
  {
    label: 'Compañía',
    items: [
      { name: 'Sobre nosotros', href: '/about', modal: false },
      { name: 'Blog',           href: '/blog',  modal: false },
      { name: 'Contacto',       href: '#',      modal: true  },
    ],
  },
  {
    label: 'Legal',
    items: [
      { name: 'Términos',   href: '/terms',   modal: false },
      { name: 'Privacidad', href: '/privacy', modal: false },
      { name: 'Seguridad',  href: '#',        modal: false },
    ],
  },
]

const linkStyle: React.CSSProperties = {
  fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
  letterSpacing: '-0.01em',
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundPosition: '0 100%',
  backgroundRepeat: 'no-repeat',
  transition: 'color 0.2s ease, background-size 0.3s ease',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
  fontWeight: 'inherit',
}

export function LandingFooter() {
  const { isOpen: contactOpen, open: openContact, close: closeContact } = useContactStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      {contactOpen && <ContactModal onClose={closeContact} />}

      <footer style={{ background: '#050505', position: 'relative', overflow: 'hidden' }}>

        {/* Graph-paper bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />

        {/* Top rule */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

        {/* Links + info */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          position: 'relative',
          zIndex: 1,
        }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
            gap: isMobile ? 32 : 'clamp(32px, 6vw, 100px)',
            alignItems: 'start',
            padding: 'clamp(40px, 6vw, 64px) 0 clamp(32px, 5vw, 56px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>

            {/* Left — logo + tagline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <svg width="16" height="16" viewBox="0 0 200 200" fill="none">
                  <path d="M100 100V42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M100 100L148 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M100 100L52 128" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="10" fill="white" />
                  <circle cx="100" cy="42" r="8" fill="white" />
                  <circle cx="148" cy="128" r="8" fill="white" />
                  <circle cx="52" cy="128" r="8" fill="white" />
                </svg>
                <span style={{ fontSize: 11, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase' }}>
                  unickeys
                </span>
              </div>

              {/* Mini wordmark canvas — oculto en mobile */}
              {!isMobile && (
                <div style={{ width: 360, height: 120, marginBottom: 16 }}>
                  <FooterWordmark />
                </div>
              )}

              <p style={{
                fontSize: 13, color: 'rgba(255,255,255,0.28)',
                lineHeight: 1.7, margin: '0 0 24px', fontWeight: 300, maxWidth: 260,
              }}>
                Infraestructura de certificados verificables para empresas. Inmutable, auditable, confiable.
              </p>
            </div>

            {/* Right — link columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '28px 20px' : 'clamp(28px, 3.5vw, 52px)',
              alignItems: 'start',
            }}>
              {LINKS.map(col => (
                <div key={col.label}>
                  <div style={{
                    fontSize: 9, letterSpacing: '0.16em', color: DIM,
                    textTransform: 'uppercase', marginBottom: 18, fontWeight: 500,
                  }}>
                    {col.label}
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                    {col.items.map(item => (
                      <li key={item.name}>
                        {item.modal ? (
                          <button
                            onClick={openContact}
                            style={linkStyle}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = '#fff'
                              e.currentTarget.style.backgroundImage = 'linear-gradient(currentColor, currentColor)'
                              e.currentTarget.style.backgroundPosition = '0 100%'
                              e.currentTarget.style.backgroundSize = '100% 1px'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
                              e.currentTarget.style.backgroundPosition = '100% 100%'
                              e.currentTarget.style.backgroundSize = '0% 1px'
                            }}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            style={linkStyle}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = '#fff'
                              e.currentTarget.style.backgroundPosition = '0 100%'
                              e.currentTarget.style.backgroundSize = '100% 1px'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
                              e.currentTarget.style.backgroundPosition = '100% 100%'
                              e.currentTarget.style.backgroundSize = '0% 1px'
                            }}
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 0', gap: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.08em' }}>
              unickeys © 2025 — B2B certificate infrastructure
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.10)', letterSpacing: '0.06em' }}>
              SHA-256 · Merkle Tree · Solana · SOC2 in progress
            </span>
          </div>

        </div>
      </footer>
    </>
  )
}
