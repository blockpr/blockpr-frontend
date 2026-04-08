'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const METRICS = [
  { id: 'certs',  raw: 124830,   display: '124K',  label: 'Certificados\nemitidos',     sub: '+18% este mes' },
  { id: 'verifs', raw: 841200,   display: '841K',  label: 'Verificaciones\nrealizadas', sub: '+34% este mes' },
  { id: 'docs',   raw: 3720000,  display: '3.7M',  label: 'Documentos\nprotegidos',     sub: '+22% vs año anterior', hero: true },
]

const CHART_POINTS = [21, 28, 31, 39, 43, 51, 58, 65, 72, 81, 91, 100] // normalized 0-100
const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'

// ─── Chart ───────────────────────────────────────────────────────────────────

function drawChart(canvas: HTMLCanvasElement, progress: number, hoverIdx: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const W   = canvas.offsetWidth
  const H   = canvas.offsetHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, W, H)

  const n      = CHART_POINTS.length
  const padT   = 12
  const padB   = 0
  const usableH = H - padT - padB

  const px = (i: number) => (i / (n - 1)) * W
  const py = (v: number) => padT + (1 - v / 100) * usableH

  const cutX = progress * W

  // Clip to progress
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, cutX, H)
  ctx.clip()

  // Area gradient
  const areaGrad = ctx.createLinearGradient(0, 0, 0, H)
  areaGrad.addColorStop(0,   ACCENT + '18')
  areaGrad.addColorStop(0.6, ACCENT + '06')
  areaGrad.addColorStop(1,   ACCENT + '00')

  ctx.beginPath()
  ctx.moveTo(px(0), py(CHART_POINTS[0]))
  for (let i = 1; i < n; i++) {
    const cx = (px(i - 1) + px(i)) / 2
    ctx.bezierCurveTo(cx, py(CHART_POINTS[i - 1]), cx, py(CHART_POINTS[i]), px(i), py(CHART_POINTS[i]))
  }
  ctx.lineTo(px(n - 1), H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fillStyle = areaGrad
  ctx.fill()

  // Glow line
  for (let pass = 0; pass < 3; pass++) {
    ctx.beginPath()
    ctx.moveTo(px(0), py(CHART_POINTS[0]))
    for (let i = 1; i < n; i++) {
      const cx = (px(i - 1) + px(i)) / 2
      ctx.bezierCurveTo(cx, py(CHART_POINTS[i - 1]), cx, py(CHART_POINTS[i]), px(i), py(CHART_POINTS[i]))
    }
    ctx.strokeStyle = pass === 0 ? ACCENT + '18' : pass === 1 ? ACCENT + '55' : ACCENT + 'cc'
    ctx.lineWidth   = pass === 0 ? 8 : pass === 1 ? 3 : 1.5
    ctx.lineJoin    = 'round'
    ctx.stroke()
  }

  // Leading dot
  if (progress < 1) {
    const frac  = progress * (n - 1)
    const i0    = Math.min(n - 2, Math.floor(frac))
    const t     = frac - i0
    const leadX = px(i0) + (px(i0 + 1) - px(i0)) * t
    const leadY = py(CHART_POINTS[i0] + (CHART_POINTS[i0 + 1] - CHART_POINTS[i0]) * t)

    ctx.beginPath()
    ctx.arc(leadX, leadY, 14, 0, Math.PI * 2)
    const dotGrad = ctx.createRadialGradient(leadX, leadY, 0, leadX, leadY, 14)
    dotGrad.addColorStop(0, ACCENT + '55')
    dotGrad.addColorStop(1, ACCENT + '00')
    ctx.fillStyle = dotGrad
    ctx.fill()

    ctx.beginPath()
    ctx.arc(leadX, leadY, 3, 0, Math.PI * 2)
    ctx.fillStyle = ACCENT
    ctx.fill()
  }

  ctx.restore()

  // Hover crosshair
  if (hoverIdx >= 0 && hoverIdx < n && progress >= 1) {
    const hx = px(hoverIdx)
    const hy = py(CHART_POINTS[hoverIdx])

    ctx.beginPath()
    ctx.moveTo(hx, 0)
    ctx.lineTo(hx, H)
    ctx.strokeStyle = ACCENT + '30'
    ctx.lineWidth   = 1
    ctx.setLineDash([3, 5])
    ctx.stroke()
    ctx.setLineDash([])

    const ringGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 18)
    ringGrad.addColorStop(0, ACCENT + '44')
    ringGrad.addColorStop(1, ACCENT + '00')
    ctx.beginPath()
    ctx.arc(hx, hy, 18, 0, Math.PI * 2)
    ctx.fillStyle = ringGrad
    ctx.fill()

    ctx.beginPath()
    ctx.arc(hx, hy, 4, 0, Math.PI * 2)
    ctx.fillStyle = ACCENT
    ctx.fill()
  }
}

// ─── Number scramble animation ────────────────────────────────────────────────

function useScrambleCounter(target: string, triggered: boolean, delay: number) {
  const [display, setDisplay] = useState('—')
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!triggered) return
    const timeout = setTimeout(() => {
      const chars  = '0123456789'
      const dur    = 2800
      const start  = performance.now()
      const tick   = (now: number) => {
        const t    = Math.min(1, (now - start) / dur)
        const ease = 1 - Math.pow(1 - t, 3)
        const revealed = Math.floor(ease * target.length)
        let out = ''
        for (let i = 0; i < target.length; i++) {
          const ch = target[i]
          if (i < revealed) {
            out += ch
          } else if (/\d/.test(ch)) {
            out += chars[Math.floor(Math.random() * chars.length)]
          } else {
            out += ch
          }
        }
        setDisplay(out)
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered, target, delay])

  return display
}

// ─── Metric card ─────────────────────────────────────────────────────────────

function MetricCard({
  metric, triggered, index,
}: {
  metric: typeof METRICS[0]
  triggered: boolean
  index: number
}) {
  const display = useScrambleCounter(metric.display, triggered, index * 180)
  const isHero  = metric.hero

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      justifyContent:'flex-end',
      padding:       isHero ? '0 0 0 48px' : '0',
      borderLeft:    isHero ? `1px solid rgba(255,255,255,0.08)` : 'none',
      opacity:       triggered ? 1 : 0,
      transform:     triggered ? 'translateY(0)' : 'translateY(20px)',
      transition:    `opacity 0.9s ease ${index * 0.15}s, transform 0.9s ease ${index * 0.15}s`,
    }}>
      <div style={{
        fontSize:      11,
        letterSpacing: '0.12em',
        color:         isHero ? ACCENT + 'aa' : DIM,
        textTransform: 'uppercase',
        marginBottom:  14,
        fontWeight:    400,
        whiteSpace:    'pre-line',
        lineHeight:    1.6,
      }}>
        {metric.label}
      </div>

      <div style={{
        fontSize:      isHero ? 'clamp(64px, 7vw, 104px)' : 'clamp(48px, 5.5vw, 80px)',
        fontWeight:    200,
        letterSpacing: '-0.04em',
        color:         isHero ? ACCENT : '#fff',
        lineHeight:    0.9,
        fontVariantNumeric: 'tabular-nums',
        marginBottom:  20,
      }}>
        {display}
      </div>

      <div style={{
        fontSize:   16,
        color:      isHero ? ACCENT + '99' : 'rgba(255,255,255,0.4)',
        letterSpacing: '0.04em',
      }}>
        {metric.sub}
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function LandingStats() {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [hoverIdx,  setHoverIdx]  = useState(-1)
  const [tooltip,   setTooltip]   = useState<{ x: number; y: number; text: string } | null>(null)
  const chartDoneRef = useRef(false)
  const animRef      = useRef<number | undefined>(undefined)

  // IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.15 }
    )
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  // Chart animation — espera un frame para que el canvas tenga dimensiones reales
  useEffect(() => {
    if (!triggered || chartDoneRef.current) return
    chartDoneRef.current = true

    // Esperar dos frames: primero el layout, luego arrancar
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        const start = performance.now()
        const dur   = 3800
        const tick  = (now: number) => {
          const t    = Math.min(1, (now - start) / dur)
          const ease = 1 - Math.pow(1 - t, 3)
          if (canvasRef.current && canvasRef.current.offsetWidth > 0) {
            drawChart(canvasRef.current, ease, -1)
          }
          if (t < 1) animRef.current = requestAnimationFrame(tick)
        }
        animRef.current = requestAnimationFrame(tick)
      })
      return raf2
    })

    return () => {
      cancelAnimationFrame(raf1)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [triggered])

  // Redraw on hover
  useEffect(() => {
    if (!triggered) return
    if (canvasRef.current) drawChart(canvasRef.current, 1, hoverIdx)
  }, [hoverIdx, triggered])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx   = e.clientX - rect.left
    const idx  = Math.max(0, Math.min(CHART_POINTS.length - 1,
      Math.round((mx / rect.width) * (CHART_POINTS.length - 1))
    ))
    setHoverIdx(idx)
    const vals = [210000,280000,310000,390000,430000,510000,580000,650000,720000,810000,910000,3720000]
    setTooltip({ x: e.clientX, y: e.clientY, text: `${MONTHS[idx]}: ${vals[idx].toLocaleString('es-AR')}` })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverIdx(-1)
    setTooltip(null)
  }, [])

  return (
    <div ref={wrapperRef} style={{ background: '#050505', position: 'relative', overflow: 'hidden' }}>

      {/* Graph-paper background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Top rule */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 0 }} />

      {/* Metrics row */}
      <div style={{
        display:       'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap:           0,
        padding:       'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 80px)',
        paddingBottom: 'clamp(40px, 6vw, 72px)',
        position:      'relative',
        zIndex:        1,
      }}>
        {METRICS.map((m, i) => (
          <MetricCard key={m.id} metric={m} triggered={triggered} index={i} />
        ))}
      </div>

      {/* Divider + label */}
      <div style={{
        padding:        '0 clamp(24px, 5vw, 80px)',
        marginBottom:   24,
        display:        'flex',
        alignItems:     'center',
        gap:            20,
        position:       'relative',
        zIndex:         1,
        opacity:        triggered ? 1 : 0,
        transition:     'opacity 1s ease 0.5s',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Crecimiento acumulado
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Ene → Dic
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width:   '100%',
            height:  160,
            cursor:  'crosshair',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {/* Month labels */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          padding:        '10px clamp(24px, 5vw, 80px) clamp(32px, 5vw, 56px)',
        }}>
          {MONTHS.map(m => (
            <span key={m} style={{ fontSize: 10, color: DIM, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} />

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position:    'fixed',
          left:        tooltip.x + 14,
          top:         tooltip.y - 12,
          background:  'rgba(8,8,8,0.96)',
          border:      `1px solid ${ACCENT}33`,
          borderRadius: 4,
          padding:     '5px 10px',
          fontSize:    11,
          color:       ACCENT,
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          zIndex:      999,
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
