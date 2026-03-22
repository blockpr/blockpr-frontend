'use client'

import { useEffect, useRef, useState } from 'react'

type Node = {
  x: number; y: number
  vx: number; vy: number
  tx: number; ty: number
  r: number; a: number
}

const TITLE = [
  'Durante años confiamos en que los documentos eran prueba suficiente.',
  'Hoy, esa confianza ya no es garantía.',
  'Con tecnología accesible, muchos pueden falsificarse en minutos.',
  'Sin ruido, sin señales evidentes.',
  '¿Qué tan seguro está el tuyo?',
]
const TITLE_CHARS = TITLE.flatMap((line, li) =>
  line.split('').map((ch, ci) => ({ ch, li, ci }))
)
const TOTAL_CHARS = TITLE_CHARS.length

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
  const wrapperRef         = useRef<HTMLDivElement>(null)
  const canvasRef          = useRef<HTMLCanvasElement>(null)
  const h2Ref              = useRef<HTMLHeadingElement>(null)
  const nodesRef           = useRef<Node[]>([])
  const convergingRef      = useRef(false)
  const convergingStartRef = useRef(0)
  const revealedRef        = useRef(false)
  const rafId              = useRef<number | undefined>(undefined)
  const scrollProgressRef  = useRef(0)
  const canConvergeRef     = useRef(true)
  const readyToRevealRef   = useRef(false)
  const revealThresholdRef = useRef(0)
  const revealOriginRef    = useRef(0)

  const resetAll = () => {
    setTextVisible(false)
    nodesRef.current.forEach(n => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.25 + Math.random() * 0.6
      n.vx = Math.cos(angle) * speed
      n.vy = Math.sin(angle) * speed
    })
    convergingRef.current      = false
    convergingStartRef.current = 0
    revealedRef.current        = false
    readyToRevealRef.current   = false
    revealThresholdRef.current = 0
    revealOriginRef.current    = 0
    canConvergeRef.current     = false
    setTimeout(() => { canConvergeRef.current = true }, 500)
  }

  const startConverging = () => {
    const h2 = h2Ref.current
    if (h2) {
      const rect = h2.getBoundingClientRect()
      const px = 100, py = 80
      nodesRef.current.forEach(n => {
        n.tx = rect.left - px + Math.random() * (rect.width  + px * 2)
        n.ty = rect.top  - py + Math.random() * (rect.height + py * 2)
      })
    }
    convergingRef.current    = true
    readyToRevealRef.current = false
    setTimeout(() => {
      readyToRevealRef.current   = true
      revealThresholdRef.current = scrollProgressRef.current + 0.04
    }, 350)
  }

  const [textVisible,    setTextVisible]    = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // ── Canvas ─────────────────────────────────────────────────────────────────
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

    const LINE_D = Math.min(W, H) * 0.13
    const LD2    = LINE_D * LINE_D

    // Build ~480 random wandering nodes
    const nodes: Node[] = Array.from({ length: 480 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.12 + Math.random() * 0.22
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tx: 0, ty: 0,
        r:  0.8 + Math.random() * 1.4,
        a:  0.18 + Math.random() * 0.42,
      }
    })
    nodesRef.current = nodes
    const N = nodes.length

    // Spatial grid
    const GCOLS = Math.ceil(W / LINE_D) + 2
    const GROWS = Math.ceil(H / LINE_D) + 2
    const grid: number[][] = Array.from({ length: GCOLS * GROWS }, () => [])

    // Pre-allocated draw buffers
    const L_BUCKETS = 8
    const N_BUCKETS = 12
    const linePts    = Array.from({ length: L_BUCKETS }, () => new Float32Array(12000))
    const lineCounts = new Int32Array(L_BUCKETS)
    const nodeXYR    = Array.from({ length: N_BUCKETS }, () => new Float32Array(N * 3 + 12))
    const nodeCounts = new Int32Array(N_BUCKETS)
    const RGBA_LUT   = Array.from({ length: 256 }, (_, i) =>
      `rgba(255,255,255,${(i / 255).toFixed(3)})`
    )

    const draw = (_now: number) => {
      ctx.clearRect(0, 0, W, H)

      if (convergingRef.current) {
        // Spring toward text targets
        if (convergingStartRef.current === 0) convergingStartRef.current = _now
        nodes.forEach(n => {
          n.vx = (n.vx + (n.tx - n.x) * 0.012) * 0.92
          n.vy = (n.vy + (n.ty - n.y) * 0.012) * 0.92
          n.x += n.vx; n.y += n.vy
        })
      } else {
        // Free wander with gentle drift
        nodes.forEach(n => {
          n.vx += (Math.random() - 0.5) * 0.006
          n.vy += (Math.random() - 0.5) * 0.006
          // Soft speed cap
          const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
          if (spd > 0.55) { n.vx *= 0.55 / spd; n.vy *= 0.55 / spd }
          n.x += n.vx; n.y += n.vy
          if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)) }
          if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)) }
        })
      }

      // Rebuild spatial grid
      for (let gi = 0; gi < grid.length; gi++) grid[gi].length = 0
      for (let i = 0; i < N; i++) {
        const col = Math.floor(nodes[i].x / LINE_D)
        const row = Math.floor(nodes[i].y / LINE_D)
        if (col >= 0 && col < GCOLS && row >= 0 && row < GROWS)
          grid[row * GCOLS + col].push(i)
      }

      // Accumulate lines by alpha bucket
      for (let i = 0; i < L_BUCKETS; i++) lineCounts[i] = 0
      for (let i = 0; i < N; i++) {
        const a   = nodes[i]
        const col = Math.floor(a.x / LINE_D)
        const row = Math.floor(a.y / LINE_D)
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const c2 = col + dc, r2 = row + dr
            if (c2 < 0 || c2 >= GCOLS || r2 < 0 || r2 >= GROWS) continue
            for (const j of grid[r2 * GCOLS + c2]) {
              if (j <= i) continue
              const b  = nodes[j]
              const dx = a.x - b.x, dy = a.y - b.y
              const d2 = dx * dx + dy * dy
              if (d2 >= LD2) continue
              const alpha = (1 - Math.sqrt(d2) / LINE_D) * 0.30
              const bi = Math.min(L_BUCKETS - 1, alpha * L_BUCKETS / 0.55 | 0)
              const lc = lineCounts[bi]
              if (lc * 4 + 3 < linePts[bi].length) {
                linePts[bi][lc * 4]     = a.x
                linePts[bi][lc * 4 + 1] = a.y
                linePts[bi][lc * 4 + 2] = b.x
                linePts[bi][lc * 4 + 3] = b.y
                lineCounts[bi]++
              }
            }
          }
        }
      }
      // Flush lines
      ctx.lineWidth = 1.0
      for (let bi = 0; bi < L_BUCKETS; bi++) {
        const count = lineCounts[bi]
        if (count === 0) continue
        const alpha = (bi + 0.5) / L_BUCKETS * 0.55
        ctx.strokeStyle = RGBA_LUT[Math.min(255, alpha * 255 | 0)]
        ctx.beginPath()
        const lp = linePts[bi]
        for (let k = 0; k < count; k++) {
          ctx.moveTo(lp[k * 4], lp[k * 4 + 1])
          ctx.lineTo(lp[k * 4 + 2], lp[k * 4 + 3])
        }
        ctx.stroke()
      }

      // Accumulate nodes by opacity bucket
      for (let i = 0; i < N_BUCKETS; i++) nodeCounts[i] = 0
      for (let i = 0; i < N; i++) {
        const n  = nodes[i]
        const bi = Math.min(N_BUCKETS - 1, n.a * N_BUCKETS | 0)
        const nc = nodeCounts[bi]
        nodeXYR[bi][nc * 3]     = n.x
        nodeXYR[bi][nc * 3 + 1] = n.y
        nodeXYR[bi][nc * 3 + 2] = n.r
        nodeCounts[bi]++
      }
      // Flush nodes
      for (let bi = 0; bi < N_BUCKETS; bi++) {
        const count = nodeCounts[bi]
        if (count === 0) continue
        const opacity = (bi + 0.5) / N_BUCKETS
        ctx.fillStyle = RGBA_LUT[Math.min(255, opacity * 255 | 0)]
        ctx.beginPath()
        const nd = nodeXYR[bi]
        for (let k = 0; k < count; k++) {
          const x = nd[k * 3], y = nd[k * 3 + 1], r = nd[k * 3 + 2]
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        ctx.fill()
      }

      rafId.current = requestAnimationFrame(draw)
    }

    rafId.current = requestAnimationFrame(draw)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [])

  // ── Trigger convergencia ───────────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      const el = wrapperRef.current
      if (!el || convergingRef.current || !canConvergeRef.current) return
      const top = el.getBoundingClientRect().top
      if (top > 0) return
      const maxScroll = el.offsetHeight - window.innerHeight
      const p = Math.max(0, -top / maxScroll)
      if (p >= 0.20) startConverging()
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  // ── Scroll progress → highlight ────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (top > 0) {
        scrollProgressRef.current = 0
        setScrollProgress(0)
        // Salió de la sección por arriba — reset completo
        if (revealedRef.current || convergingRef.current) resetAll()
        return
      }
      const maxScroll = el.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -top / maxScroll))
      scrollProgressRef.current = p
      setScrollProgress(p)

      // Scrolleó hacia arriba pasando el punto donde se activó el texto
      if (revealedRef.current && p < revealOriginRef.current - 0.03) {
        resetAll()
        return
      }

      // Scrolleó hacia arriba antes de que el texto apareciera — cancelar converge
      if (!revealedRef.current && convergingRef.current && p < 0.16) {
        convergingRef.current      = false
        convergingStartRef.current = 0
        readyToRevealRef.current   = false
        revealThresholdRef.current = 0
        nodesRef.current.forEach(n => {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.2 + Math.random() * 0.4
          n.vx = Math.cos(angle) * speed
          n.vy = Math.sin(angle) * speed
        })
      }

      if (!revealedRef.current && readyToRevealRef.current && p >= revealThresholdRef.current) {
        revealedRef.current     = true
        revealOriginRef.current = p
        setTextVisible(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Trigger convergencia con wheel (hacia abajo) ───────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const el = wrapperRef.current
      if (!el) return
      const { top } = el.getBoundingClientRect()
      if (top > 0) return
      if (e.deltaY > 0 && canConvergeRef.current && !convergingRef.current && !revealedRef.current) {
        if (scrollProgressRef.current >= 0.20) startConverging()
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const TEXT_RANGE  = 0.22
  const CARDS_RANGE = 0.10
  const SMOOTH      = 3

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

  const charOpacity = (globalIndex: number) => {
    if (!textVisible) return 0.3
    const rel = Math.max(0, scrollProgress - revealOriginRef.current)
    const p   = clamp(rel / TEXT_RANGE)
    const t   = clamp((p * (TOTAL_CHARS + SMOOTH - 1) - globalIndex) / SMOOTH)
    return 0.3 + t * 0.7
  }

  const textRevealP   = !textVisible ? 0 : clamp((scrollProgress - revealOriginRef.current) / TEXT_RANGE)
  const textDoneAt    = revealOriginRef.current + TEXT_RANGE
  const cardsProgress = !textVisible ? 0 : clamp((scrollProgress - textDoneAt) / CARDS_RANGE)

  const charsPerLine = TITLE.map(l => l.length)
  const lineStart = charsPerLine.reduce<number[]>((acc, _, i) =>
    [...acc, i === 0 ? 0 : acc[i - 1] + charsPerLine[i - 1]], []
  )

  // suppress unused warning
  void textRevealP

  return (
    <div ref={wrapperRef} style={{ height: '700vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#050505',
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute', inset: 0,
          filter: cardsProgress > 0 ? `blur(${cardsProgress * 18}px)` : undefined,
        }}>
          <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: textVisible ? 0 : 1,
            filter: textVisible ? 'blur(8px)' : 'blur(0px)',
            transition: 'opacity 1.8s ease, filter 1.8s ease',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 1.4s ease 0.4s',
            pointerEvents: 'none',
          }}>
            <h2 ref={h2Ref} style={{
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
          padding: '0 48px',
          pointerEvents: cardsProgress > 0.05 ? 'auto' : 'none',
          zIndex: 2,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            maxWidth: 1200,
            width: '100%',
          }}>
            {PROBLEMS.map((p, i) => {
              const triggered = cardsProgress >= 0.4
              return (
                <div key={p.num} style={{
                  opacity: triggered ? 1 : 0,
                  transform: triggered ? 'translateY(0px)' : 'translateY(32px)',
                  transition: `opacity 0.8s ease ${i * 0.22}s, transform 0.8s ease ${i * 0.22}s`,
                  padding: '40px 36px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  textAlign: 'left',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: 14, letterSpacing: '0.08em',
                    color: '#000', marginBottom: 32,
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6,
                    padding: '4px 10px',
                  }}>{p.num}</span>
                  <p style={{
                    fontSize: 20, fontWeight: 400, color: '#fff',
                    margin: '0 0 18px', letterSpacing: '-0.03em', lineHeight: 1.25,
                  }}>{p.title}</p>
                  <p style={{
                    fontSize: 18, color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.75, margin: 0, fontWeight: 300,
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
