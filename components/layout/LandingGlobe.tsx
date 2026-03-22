'use client'

import { useEffect, useRef } from 'react'

export function LandingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const W   = window.innerWidth
    const H   = window.innerHeight
    canvas.width  = W * DPR
    canvas.height = H * DPR
    const ctx = canvas.getContext('2d')!
    ctx.scale(DPR, DPR)

    const N    = 220
    const R    = Math.min(W, H) * 0.28
    const LD   = R * 0.38
    const LD2  = LD * LD

    type P = { theta: number; phi: number; x3: number; y3: number; z3: number; x: number; y: number }

    const pts: P[] = Array.from({ length: N }, () => ({
      theta: Math.acos(2 * Math.random() - 1),
      phi:   Math.random() * Math.PI * 2,
      x3: 0, y3: 0, z3: 0, x: 0, y: 0,
    }))

    let rotY = 0
    const rotX = 0.28
    let rafId: number

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      rotY += 0.0028

      const cx = W / 2, cy = H / 2
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)

      pts.forEach(p => {
        const x0 = R * Math.sin(p.theta) * Math.cos(p.phi)
        const y0 = R * Math.cos(p.theta)
        const z0 = R * Math.sin(p.theta) * Math.sin(p.phi)

        // rotate Y
        const x1 =  x0 * cosY + z0 * sinY
        const z1 = -x0 * sinY + z0 * cosY

        // rotate X (tilt)
        const y1 = y0 * cosX - z1 * sinX
        const z2 = y0 * sinX + z1 * cosX

        p.x3 = x1; p.y3 = y1; p.z3 = z2
        p.x  = cx + x1
        p.y  = cy + y1
      })

      // Lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = pts[i], b = pts[j]
          const dx = a.x3 - b.x3, dy = a.y3 - b.y3, dz = a.z3 - b.z3
          const d2 = dx*dx + dy*dy + dz*dz
          if (d2 < LD2) {
            const t    = 1 - Math.sqrt(d2) / LD
            const avgZ = (a.z3 + b.z3) / 2
            const depth = (avgZ + R) / (2 * R)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${t * 0.22 * depth})`
            ctx.lineWidth = t * 0.9
            ctx.stroke()
          }
        }
      }

      // Nodes (sorted back → front for correct overlap)
      pts
        .slice()
        .sort((a, b) => a.z3 - b.z3)
        .forEach(p => {
          const depth   = (p.z3 + R) / (2 * R)
          const opacity = 0.08 + depth * 0.65
          const r       = 0.8 + depth * 1.6
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${opacity})`
          ctx.fill()
        })

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div style={{ height: '150vh', background: '#050505' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#050505',
        overflow: 'hidden',
      }}>
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
        }} />
      </div>
    </div>
  )
}
