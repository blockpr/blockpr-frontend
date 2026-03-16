'use client'

import { useEffect, useRef } from 'react'

export function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, DPR = 1
    let animId: number
    let time = 0
    const FADE_DELAY    = 0.2   // segundos antes de empezar
    const FADE_DURATION = 1.0   // duración del fade

    const NODE_COUNT     = 320
    const LINE_DIST      = 90
    const LOGO_SCALE     = 0.52
    const CLUSTER_SIZE   = 22
    const CLUSTER_RADIUS = 22
    const MOUSE_RADIUS   = 240
    const MOUSE_ATTRACT  = 110
    const REPEL_RADIUS   = 120
    const REPEL_FORCE    = 130
    const RR2            = REPEL_RADIUS * REPEL_RADIUS
    const SPRING         = 0.022
    const DAMPING        = 0.91

    const mouse = { x: -9999, y: -9999 }

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

    type Ghost = { bx: number; by: number; r: number; waveAmp: number; waveFreq: number; brightness: number; wavePhaseX: number; wavePhaseY: number; ox: number; oy: number }
    type ClusterNode = { targetIdx?: number; targetX?: number; targetY?: number; x: number; y: number; vx: number; vy: number; orbitAngle: number; orbitR: number; orbitFreq: number; r: number; brightness: number }
    type LogoTarget = { x: number; y: number }

    let ghosts: Ghost[] = []
    let logoTargets: LogoTarget[] = []
    let clusters: ClusterNode[] = []
    let textClusters: ClusterNode[] = []
    // Pre-allocated spatial grids — reused every frame to avoid GC
    let ghostGrid: number[][] = []
    let tcGrid:    number[][] = []

    function buildNodes() {
      const cx = W * 0.50
      const cy = H * 0.35
      const sc = Math.min(W, H) * LOGO_SCALE

      const lp = (lx: number, ly: number) => ({
        x: cx + (lx - 100) / 100 * sc * 0.56,
        y: cy + (ly - 100) / 100 * sc * 0.56,
      })

      logoTargets = [
        lp(100, 42),
        lp(148, 128),
        lp(52, 128),
        lp(100, 100),
      ]

      clusters = []
      logoTargets.forEach((t, ti) => {
        for (let s = 0; s < CLUSTER_SIZE; s++) {
          const angle  = (s / CLUSTER_SIZE) * Math.PI * 2
          const spread = CLUSTER_RADIUS * (0.3 + Math.random() * 0.7)
          clusters.push({
            targetIdx: ti,
            x: t.x + Math.cos(angle) * spread,
            y: t.y + Math.sin(angle) * spread,
            vx: 0, vy: 0,
            orbitAngle: angle + Math.random() * 0.8,
            orbitR: spread * (0.5 + Math.random() * 0.8),
            orbitFreq: 0.06 + Math.random() * 0.10,
            r:  0.8 + Math.random() * 1.6,
            brightness: 0.55 + Math.random() * 0.40,
          })
        }
      })

      // Background nodes — 5 interlaced wave lines
      ghosts = []
      const NUM_ROWS = 9
      const STEP_X   = 9
      for (let row = 0; row < NUM_ROWS; row++) {
        const baseY    = H * 0.10 + (row / (NUM_ROWS - 1)) * H * 0.68
        const rowPhase = (row / NUM_ROWS) * Math.PI * 2   // interlaced phases
        for (let bx = 0; bx <= W; bx += STEP_X) {
          ghosts.push({
            bx,
            by: baseY,
            r: 0.7 + Math.random() * 1.0,
            waveAmp:  0.8 + Math.random() * 1.2,
            waveFreq: 0.45 + Math.random() * 0.35,
            brightness: 0.25 + Math.pow(Math.random(), 0.8) * 0.40,
            wavePhaseX: (Math.random() - 0.5) * 0.25,
            wavePhaseY: rowPhase,
            ox: 0, oy: 0,
          })
        }
      }

      buildTextNodes(cx, cy, sc)
    }

    function buildTextNodes(cx: number, cy: number, sc: number) {
      const logoBot  = cy + (128 - 100) / 100 * sc * 0.56
      const fontSize = Math.round(Math.min(W, H) * 0.255)
      const textCY   = logoBot + fontSize * 0.80
      const STEP     = 6

      const oc    = document.createElement('canvas')
      oc.width    = W
      oc.height   = fontSize * 3
      const octx  = oc.getContext('2d')!
      octx.fillStyle    = '#fff'
      octx.font         = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, Inter, sans-serif`
      ;(octx as any).letterSpacing = `${Math.round(fontSize * 0.08)}px`
      octx.textAlign    = 'center'
      octx.textBaseline = 'middle'
      octx.fillText('unickeys', W / 2, oc.height / 2)

      const data = octx.getImageData(0, 0, oc.width, oc.height).data
      const pts: { x: number; y: number }[] = []
      for (let py = 0; py < oc.height; py += STEP) {
        for (let px = 0; px < oc.width; px += STEP) {
          if (data[(py * oc.width + px) * 4 + 3] > 80) {
            pts.push({ x: px, y: py - oc.height / 2 + textCY })
          }
        }
      }
      while (pts.length > 700) pts.splice(Math.floor(Math.random() * pts.length), 1)

      textClusters = pts.map(t => ({
        targetX: t.x, targetY: t.y,
        x: t.x + (Math.random() - 0.5) * W * 0.5,
        y: t.y + (Math.random() - 0.5) * H * 0.3,
        vx: 0, vy: 0,
        r:  0.7 + Math.random() * 1.1,
        brightness: 0.55 + Math.random() * 0.40,
        orbitR:   2.5 + Math.random() * 4.0,
        orbitFreq: 0.05 + Math.random() * 0.09,
        orbitAngle: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      time += 0.016

      ctx.save()
      ctx.scale(DPR, DPR)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      // Ghost nodes — 5 interlaced traveling wave lines
      const gPos = ghosts.map(g => {
        const w1 = Math.sin(0.009 * g.bx - 0.38 * time + g.wavePhaseY)               * H * 0.16
        const w2 = Math.sin(0.017 * g.bx - 0.62 * time + g.wavePhaseY * 1.4 + 0.9)  * H * 0.05
        const wx = g.bx + Math.sin(time * g.waveFreq + g.wavePhaseX) * g.waveAmp * 0.3
        const wy = g.by + w1 + w2 + Math.cos(time * g.waveFreq + g.wavePhaseX) * g.waveAmp * 0.3
        const dx = mouse.x - wx, dy = mouse.y - wy
        const d2 = dx * dx + dy * dy
        const MR2 = MOUSE_RADIUS * MOUSE_RADIUS
        if (d2 < MR2 && d2 > 0) {
          const dist = Math.sqrt(d2)
          const pull = (1 - dist / MOUSE_RADIUS) * MOUSE_ATTRACT
          g.ox = lerp(g.ox, (dx / dist) * pull, 0.025)
          g.oy = lerp(g.oy, (dy / dist) * pull, 0.025)
          const near = 1 - dist / MOUSE_RADIUS
          return { x: wx + g.ox, y: wy + g.oy, r: g.r + near * 0.8, brightness: g.brightness + near * 0.3 }
        }
        g.ox = lerp(g.ox, 0, 0.025)
        g.oy = lerp(g.oy, 0, 0.025)
        return { x: wx + g.ox, y: wy + g.oy, r: g.r, brightness: g.brightness }
      })

      // Cluster nodes (logo)
      const cPos = clusters.map(c => {
        const target = logoTargets[c.targetIdx!]
        const restX = target.x + Math.cos(time * c.orbitFreq + c.orbitAngle) * c.orbitR
        const restY = target.y + Math.sin(time * c.orbitFreq + c.orbitAngle) * c.orbitR * 0.65
        c.vx += (restX - c.x) * SPRING
        c.vy += (restY - c.y) * SPRING
        const dx = c.x - mouse.x, dy = c.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < RR2 && d2 > 0) {
          const dist = Math.sqrt(d2)
          const f = (1 - dist / REPEL_RADIUS) * REPEL_FORCE
          c.vx += (dx / dist) * f * 0.07
          c.vy += (dy / dist) * f * 0.07
        }
        c.vx *= DAMPING; c.vy *= DAMPING
        c.x  += c.vx;   c.y  += c.vy
        return c
      })

      // Logo line centers
      const centers = logoTargets.map((_, ti) => {
        const pts = cPos.filter(c => c.targetIdx === ti)
        return {
          x: pts.reduce((s, c) => s + c.x, 0) / pts.length,
          y: pts.reduce((s, c) => s + c.y, 0) / pts.length,
        }
      })

      // Ghost lines — spatial grid + single batched stroke()
      const CELL  = LINE_DIST
      const gcols = Math.ceil(W / CELL) + 1
      const grows = Math.ceil(H / CELL) + 1
      const gSize = gcols * grows
      if (ghostGrid.length !== gSize) ghostGrid = Array.from({ length: gSize }, () => [])
      else ghostGrid.forEach(c => { c.length = 0 })
      gPos.forEach((g, i) => {
        const ci = Math.floor(g.x / CELL) + Math.floor(g.y / CELL) * gcols
        if (ci >= 0 && ci < gSize) ghostGrid[ci].push(i)
      })
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < gPos.length; i++) {
        const a   = gPos[i]
        const acx = Math.floor(a.x / CELL)
        const acy = Math.floor(a.y / CELL)
        for (let dy2 = -1; dy2 <= 1; dy2++) {
          for (let dx2 = -1; dx2 <= 1; dx2++) {
            const nx = acx + dx2, ny = acy + dy2
            if (nx < 0 || nx >= gcols || ny < 0 || ny >= grows) continue
            for (const j of ghostGrid[ny * gcols + nx]) {
              if (j <= i) continue
              const b = gPos[j]
              const ddx = a.x - b.x, ddy = a.y - b.y
              if (ddx*ddx + ddy*ddy < CELL * CELL) {
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
              }
            }
          }
        }
      }
      ctx.stroke()

      // Fade-in para logo y texto (smoothstep)
      const ft = clamp((time - FADE_DELAY) / FADE_DURATION, 0, 1)
      const fi = ft * ft * (3 - 2 * ft)

      // Logo lines
      ;[[3, 0], [3, 1], [3, 2]].forEach(([ai, bi]) => {
        const a = centers[ai], b = centers[bi]
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${0.40 * fi})`
        ctx.lineWidth = 0.9
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })

      // Ghost dots — single batched fill
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      gPos.forEach(g => { ctx.moveTo(g.x + g.r, g.y); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2) })
      ctx.fill()

      // Cluster lines (logo nodes) — single batched stroke
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255,255,255,${0.18 * fi})`
      ctx.lineWidth = 0.5
      for (let i = 0; i < cPos.length - 1; i++) {
        for (let j = i + 1; j < cPos.length; j++) {
          const a = cPos[i], b = cPos[j]
          const dx = a.x - b.x, dy = a.y - b.y
          if (dx*dx + dy*dy < 38 * 38) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y) }
        }
      }
      ctx.stroke()

      // Cluster dots — single batched fill
      ctx.beginPath()
      ctx.fillStyle = `rgba(255,255,255,${0.75 * fi})`
      cPos.forEach(c => { ctx.moveTo(c.x + c.r, c.y); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2) })
      ctx.fill()

      // Text clusters — update positions
      textClusters.forEach(c => {
        const restX = c.targetX! + Math.cos(time * c.orbitFreq + c.orbitAngle) * c.orbitR
        const restY = c.targetY! + Math.sin(time * c.orbitFreq + c.orbitAngle) * c.orbitR * 0.65
        c.vx += (restX - c.x) * SPRING
        c.vy += (restY - c.y) * SPRING
        const dx = c.x - mouse.x, dy = c.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < RR2 && d2 > 0) {
          const dist = Math.sqrt(d2)
          const f = (1 - dist / REPEL_RADIUS) * REPEL_FORCE
          c.vx += (dx / dist) * f * 0.07
          c.vy += (dy / dist) * f * 0.07
        }
        c.vx *= DAMPING; c.vy *= DAMPING
        c.x  += c.vx;   c.y  += c.vy
      })

      // Text cluster lines — spatial grid + single batched stroke
      const TC_DIST = 13
      const tccols  = Math.ceil(W / TC_DIST) + 1
      const tcrows  = Math.ceil(H / TC_DIST) + 1
      const tcSize  = tccols * tcrows
      if (tcGrid.length !== tcSize) tcGrid = Array.from({ length: tcSize }, () => [])
      else tcGrid.forEach(c => { c.length = 0 })
      textClusters.forEach((c, i) => {
        const ci = Math.floor(c.x / TC_DIST) + Math.floor(c.y / TC_DIST) * tccols
        if (ci >= 0 && ci < tcSize) tcGrid[ci].push(i)
      })
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255,255,255,${0.15 * fi})`
      ctx.lineWidth = 0.4
      for (let i = 0; i < textClusters.length; i++) {
        const a = textClusters[i]
        const acx = Math.floor(a.x / TC_DIST), acy = Math.floor(a.y / TC_DIST)
        for (let dy2 = -1; dy2 <= 1; dy2++) {
          for (let dx2 = -1; dx2 <= 1; dx2++) {
            const nx = acx + dx2, ny = acy + dy2
            if (nx < 0 || nx >= tccols || ny < 0 || ny >= tcrows) continue
            for (const j of tcGrid[ny * tccols + nx]) {
              if (j <= i) continue
              const b = textClusters[j]
              const ddx = a.x - b.x, ddy = a.y - b.y
              if (ddx*ddx + ddy*ddy < TC_DIST * TC_DIST) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y) }
            }
          }
        }
      }
      ctx.stroke()

      // Text cluster dots — single batched fill
      ctx.beginPath()
      ctx.fillStyle = `rgba(255,255,255,${0.70 * fi})`
      textClusters.forEach(c => { ctx.moveTo(c.x + c.r, c.y); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2) })
      ctx.fill()

      ctx.restore()
      animId = requestAnimationFrame(draw)
    }

    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect()
      DPR = window.devicePixelRatio || 1
      W   = rect.width
      H   = rect.height
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      buildNodes()
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
    <section className="w-full" style={{ height: 'calc(100vh + 80px)' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </section>
  )
}
