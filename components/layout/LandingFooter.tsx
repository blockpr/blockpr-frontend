'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

const LINKS = [
  {
    label: 'Producto',
    items: [
      { name: 'Dashboard',      href: '/dashboard' },
      { name: 'Emisiones',      href: '/dashboard/emissions' },
      { name: 'Verificación',   href: '/verify' },
      { name: 'API Keys',       href: '/dashboard/api-keys' },
    ],
  },
  {
    label: 'Developers',
    items: [
      { name: 'Documentación',  href: '/docs' },
      { name: 'API Reference',  href: '/docs#api' },
      { name: 'Webhooks',       href: '/docs#webhooks' },
      { name: 'Changelog',      href: '/docs#changelog' },
    ],
  },
  {
    label: 'Compañía',
    items: [
      { name: 'Sobre nosotros', href: '#' },
      { name: 'Blog',           href: '#' },
      { name: 'Contacto',       href: '#' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { name: 'Términos',       href: '#' },
      { name: 'Privacidad',     href: '#' },
      { name: 'Seguridad',      href: '#' },
    ],
  },
]

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

export function LandingFooter() {
  return (
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
          gridTemplateColumns: '1fr auto',
          gap: 'clamp(32px, 6vw, 100px)',
          alignItems: 'start',
          padding: 'clamp(40px, 6vw, 64px) 0 clamp(32px, 5vw, 56px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Left — logo + tagline + status */}
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

            {/* Mini wordmark canvas */}
            <div style={{ width: 360, height: 120, marginBottom: 16 }}>
              <FooterWordmark />
            </div>

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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(28px, 3.5vw, 52px)',
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
                      <Link
                        href={item.href}
                        style={{
                          fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
                          letterSpacing: '-0.01em',
                          backgroundImage: 'linear-gradient(currentColor, currentColor)',
                          backgroundSize: '0% 1px',
                          backgroundPosition: '0 calc(100% + 1px)',
                          backgroundRepeat: 'no-repeat',
                          transition: 'color 0.2s ease, background-size 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#fff'
                          e.currentTarget.style.backgroundPosition = '0 calc(100% + 1px)'
                          e.currentTarget.style.backgroundSize = '100% 1px'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
                          e.currentTarget.style.backgroundPosition = '100% calc(100% + 1px)'
                          e.currentTarget.style.backgroundSize = '0% 1px'
                        }}
                      >
                        {item.name}
                      </Link>
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
  )
}
