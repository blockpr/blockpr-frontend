'use client'

import { useEffect, useRef } from 'react'

const ACCENT    = '#4db888'
const ACCENT_R  = 77
const ACCENT_G  = 184
const ACCENT_B  = 136

type NodeType = 'normal' | 'cert' | 'root'

type Node = {
  x: number; y: number
  vx: number; vy: number
  r: number; a: number
  type: NodeType
  label?: string
  pulse: number
  pulseDir: number
}

const CERT_LABELS = [
  'CERT #4821', 'CERT #4822', 'CERT #4823',
  'CERT #4824', 'CERT #4825', 'CERT #4826',
]

function buildNodes(W: number, H: number): Node[] {
  const nodes: Node[] = []

  // Normal wandering nodes
  for (let i = 0; i < 42; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.06 + Math.random() * 0.12
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.8 + Math.random() * 1.4,
      a: 0.12 + Math.random() * 0.28,
      type: 'normal',
      pulse: Math.random(),
      pulseDir: 1,
    })
  }

  // Cert nodes — distributed across the panel
  CERT_LABELS.forEach((label, i) => {
    const angle = Math.random() * Math.PI * 2
    const x = W * 0.15 + Math.random() * W * 0.7
    const y = H * 0.1  + Math.random() * H * 0.8
    nodes.push({
      x, y,
      vx: Math.cos(angle) * 0.05,
      vy: Math.sin(angle) * 0.05,
      r: 3.5,
      a: 1,
      type: 'cert',
      label,
      pulse: i / CERT_LABELS.length,
      pulseDir: 1,
    })
  })

  // Merkle Root — center-ish, very slow
  nodes.push({
    x: W * 0.48 + (Math.random() - 0.5) * W * 0.1,
    y: H * 0.42 + (Math.random() - 0.5) * H * 0.1,
    vx: 0.025,
    vy: 0.018,
    r: 6,
    a: 1,
    type: 'root',
    label: 'MERKLE ROOT',
    pulse: 0,
    pulseDir: 1,
  })

  return nodes
}

export function AuthNodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId: number
    let nodes: Node[] = []
    let W = 0, H = 0
    const LINE_D   = 180
    const LD2      = LINE_D * LINE_D
    const mouse    = { x: -999, y: -999, over: false }
    const MOUSE_R  = 130
    const MOUSE_R2 = MOUSE_R * MOUSE_R

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x    = e.clientX - rect.left
      mouse.y    = e.clientY - rect.top
      mouse.over = true
    }
    const onMouseLeave = () => { mouse.over = false; mouse.x = -999; mouse.y = -999 }
    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const init = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = parent.offsetWidth
      H = parent.offsetHeight
      if (!W || !H) return

      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      const ctx = canvas.getContext('2d')!
      ctx.scale(DPR, DPR)

      nodes = buildNodes(W, H)

      const draw = () => {
        ctx.clearRect(0, 0, W, H)
        const N = nodes.length

        // Update
        for (let i = 0; i < N; i++) {
          const n = nodes[i]

          // Gentle drift
          n.vx += (Math.random() - 0.5) * 0.002
          n.vy += (Math.random() - 0.5) * 0.002

          // Cursor repulsion — nodos se apartan suavemente
          if (mouse.over) {
            const dx = n.x - mouse.x
            const dy = n.y - mouse.y
            const d2 = dx * dx + dy * dy
            if (d2 < MOUSE_R2 && d2 > 0) {
              const d    = Math.sqrt(d2)
              const force = (1 - d / MOUSE_R) * 0.18
              n.vx += (dx / d) * force
              n.vy += (dy / d) * force
            }
          }

          // Speed cap per type
          const maxSpd = n.type === 'root' ? 0.06 : n.type === 'cert' ? 0.09 : 0.22
          const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
          if (spd > maxSpd) { n.vx *= maxSpd / spd; n.vy *= maxSpd / spd }

          n.x += n.vx; n.y += n.vy
          if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)) }
          if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)) }

          // Pulse
          n.pulse += n.pulseDir * 0.008
          if (n.pulse >= 1) { n.pulse = 1; n.pulseDir = -1 }
          if (n.pulse <= 0) { n.pulse = 0; n.pulseDir = 1 }
        }

        // Lines
        ctx.lineWidth = 0.6
        for (let i = 0; i < N; i++) {
          const a = nodes[i]
          for (let j = i + 1; j < N; j++) {
            const b = nodes[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 >= LD2) continue
            const t = 1 - Math.sqrt(d2) / LINE_D
            const isSpecial = a.type !== 'normal' || b.type !== 'normal'

            if (isSpecial) {
              ctx.strokeStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${t * 0.35})`
              ctx.lineWidth   = 0.8
            } else {
              ctx.strokeStyle = `rgba(255,255,255,${t * 0.1})`
              ctx.lineWidth   = 0.5
            }
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        // Nodes
        for (let i = 0; i < N; i++) {
          const n = nodes[i]

          if (n.type === 'root') {
            // Outer glow
            const glowR = 28 + n.pulse * 8
            const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
            grd.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.22)`)
            grd.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0)`)
            ctx.fillStyle = grd
            ctx.beginPath()
            ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
            ctx.fill()

            // Ring
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r + 4 + n.pulse * 2, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${0.3 + n.pulse * 0.2})`
            ctx.lineWidth = 1
            ctx.stroke()

            // Core
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
            ctx.fillStyle = ACCENT
            ctx.fill()

            // Label
            ctx.font = '8px "Geist Mono", monospace'
            ctx.textAlign = 'center'
            ctx.fillStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${0.55 + n.pulse * 0.25})`
            ctx.fillText(n.label!, n.x, n.y + 22)

          } else if (n.type === 'cert') {
            // Ring
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r + 3.5, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${0.25 + n.pulse * 0.15})`
            ctx.lineWidth = 0.8
            ctx.stroke()

            // Core
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,255,0.85)`
            ctx.fill()

            // Label
            ctx.font = '7.5px "Geist Mono", monospace'
            ctx.textAlign = 'center'
            ctx.fillStyle = `rgba(255,255,255,0.28)`
            ctx.fillText(n.label!, n.x, n.y + 16)

          } else {
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,255,${n.a})`
            ctx.fill()
          }
        }

        // Cursor glow
        if (mouse.over) {
          const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_R)
          grd.addColorStop(0,   `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.07)`)
          grd.addColorStop(0.5, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.03)`)
          grd.addColorStop(1,   `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0)`)
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, MOUSE_R, 0, Math.PI * 2)
          ctx.fill()
        }

        rafId = requestAnimationFrame(draw)
      }

      draw()
    }

    // Double RAF to wait for real layout dimensions
    requestAnimationFrame(() => requestAnimationFrame(init))

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
