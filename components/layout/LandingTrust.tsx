'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── Animated counter hook ─────────────────────────── */
function useCounter(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    const startTime = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return value
}

/* ─── Merkle node data ───────────────────────────────── */
const TREE_NODES = [
  { id: 'root', label: 'Merkle Root', hash: 'ae9f2b…4c7d', x: 300, y: 32, delay: '0.2s' },
  { id: 'l1',   label: 'Nodo L',     hash: '3f9a2b…e8c4', x: 150, y: 132, delay: '0.5s' },
  { id: 'r1',   label: 'Nodo R',     hash: 'd7c3f1…9a2e', x: 450, y: 132, delay: '0.5s' },
  { id: 'll',   label: 'Cert 001',   hash: '8f4c2a…1b9d', x:  75, y: 232, delay: '0.8s' },
  { id: 'lr',   label: 'Cert 002',   hash: 'c5e7b3…4f2a', x: 225, y: 232, delay: '0.8s' },
  { id: 'rl',   label: 'Cert 003',   hash: '2d6a9c…7e1b', x: 375, y: 232, delay: '0.8s' },
  { id: 'rr',   label: 'Cert 004',   hash: 'f1a3d5…8c2e', x: 525, y: 232, delay: '0.8s' },
]

const TREE_LINES = [
  { x1: 300, y1: 55, x2: 150, y2: 117, delay: '0s' },
  { x1: 300, y1: 55, x2: 450, y2: 117, delay: '0.1s' },
  { x1: 150, y1: 155, x2:  75, y2: 217, delay: '0.4s' },
  { x1: 150, y1: 155, x2: 225, y2: 217, delay: '0.5s' },
  { x1: 450, y1: 155, x2: 375, y2: 217, delay: '0.4s' },
  { x1: 450, y1: 155, x2: 525, y2: 217, delay: '0.5s' },
]

const TERMINAL_LINES = [
  { txt: '$ unickeys certify ./contrato_legal.pdf', color: 'rgba(255,255,255,0.5)', delay: '0s' },
  { txt: '', color: '', delay: '0.2s' },
  { txt: '  [hashing]   SHA-256...', color: 'rgba(255,255,255,0.3)', delay: '0.4s' },
  { txt: '  → 3f9a2b8e4c1d7a9f2e5b8c3d6a1f4e7b2c9d8f5a', color: '#34d399', delay: '0.7s' },
  { txt: '', color: '', delay: '0.9s' },
  { txt: '  [batching]  Merkle tree #4821...', color: 'rgba(255,255,255,0.3)', delay: '1.1s' },
  { txt: '  → root: ae9f2b8e4c1d7a9fc3d6a1f4e7b2c9d8f5a1', color: '#34d399', delay: '1.4s' },
  { txt: '', color: '', delay: '1.6s' },
  { txt: '  [broadcast] Solana mainnet...', color: 'rgba(255,255,255,0.3)', delay: '1.8s' },
  { txt: '  → tx: 5KJn8xVpMzQ3Yak...8fPr ✓', color: '#34d399', delay: '2.1s' },
  { txt: '', color: '', delay: '2.3s' },
  { txt: '  Certificate ID: cert_4821_0042  [issued]', color: 'rgba(255,255,255,0.5)', delay: '2.5s' },
]

export function LandingTrust() {
  const sectionRef  = useRef<HTMLElement>(null)
  const merkleRef   = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const [statsVisible,   setStatsVisible]   = useState(false)
  const [merkleVisible,  setMerkleVisible]  = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(false)

  const certsCount = useCounter(10000, 1800, statsVisible)

  useEffect(() => {
    const makeIO = (cb: () => void, threshold = 0.25) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) { cb(); } }, { threshold })

    const ioStats    = makeIO(() => setStatsVisible(true))
    const ioMerkle   = makeIO(() => setMerkleVisible(true))
    const ioTerminal = makeIO(() => setTerminalVisible(true), 0.15)

    if (statsRef.current)    ioStats.observe(statsRef.current)
    if (merkleRef.current)   ioMerkle.observe(merkleRef.current)
    if (terminalRef.current) ioTerminal.observe(terminalRef.current)

    return () => { ioStats.disconnect(); ioMerkle.disconnect(); ioTerminal.disconnect() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        }}
      >
        {/* ── Big headline ── */}
        <div style={{ marginBottom: 'clamp(64px, 9vw, 100px)', maxWidth: '900px' }}>
          <h2
            className="font-display"
            style={{
              fontWeight: 300,
              fontSize: 'clamp(44px, 6vw, 88px)',
              lineHeight: 1.04,
              color: 'rgba(255,255,255,0.38)',
              margin: '0 0 24px',
              letterSpacing: '-0.025em',
            }}
          >
            Un hash.
            <br />
            <span style={{ color: '#fff' }}>
              Para siempre.
            </span>
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.32)',
              maxWidth: '520px',
              margin: 0,
            }}
          >
            Criptografía de grado militar aplicada a la certificación de documentos.
            Sin bases de datos centralizadas que hackear, sin autoridades que coaccionar.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div
          ref={statsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: 'clamp(64px, 9vw, 100px)',
          }}
        >
          {/* Stat 1 */}
          <div
            className="land-fadein"
            style={{
              background: '#050505',
              padding: 'clamp(28px, 4vw, 48px)',
              opacity: statsVisible ? 1 : 0,
              transition: 'opacity 0.8s ease 0s',
            }}
          >
            <div
              className="font-display"
              style={{
                fontWeight: 300,
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.9,
                color: '#fff',
                marginBottom: '16px',
                letterSpacing: '-0.04em',
              }}
            >
              0
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.5,
                maxWidth: '200px',
              }}
            >
              falsificaciones posibles
            </div>
            <div
              style={{
                marginTop: '16px',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '10px',
                color: 'rgba(52,211,153,0.5)',
                letterSpacing: '0.08em',
              }}
            >
              garantía criptográfica absoluta
            </div>
          </div>

          {/* Stat 2 */}
          <div
            style={{
              background: '#050505',
              padding: 'clamp(28px, 4vw, 48px)',
              opacity: statsVisible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.12s',
            }}
          >
            <div
              className="font-display"
              style={{
                fontWeight: 300,
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.9,
                color: '#fff',
                marginBottom: '16px',
                letterSpacing: '-0.04em',
              }}
            >
              <span style={{ fontSize: '0.5em', verticalAlign: '0.3em', color: 'rgba(255,255,255,0.4)' }}>&lt;</span>3s
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.5,
                maxWidth: '200px',
              }}
            >
              tiempo de verificación
            </div>
            <div
              style={{
                marginTop: '16px',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.18)',
                letterSpacing: '0.08em',
              }}
            >
              promedio global en producción
            </div>
          </div>

          {/* Stat 3 */}
          <div
            style={{
              background: '#050505',
              padding: 'clamp(28px, 4vw, 48px)',
              opacity: statsVisible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.24s',
            }}
          >
            <div
              className="font-display"
              style={{
                fontWeight: 300,
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.9,
                color: '#fff',
                marginBottom: '16px',
                letterSpacing: '-0.04em',
              }}
            >
              {statsVisible
                ? certsCount >= 10000
                  ? '10K'
                  : certsCount.toLocaleString()
                : '0'}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.5,
                maxWidth: '200px',
              }}
            >
              certificados por transacción
            </div>
            <div
              style={{
                marginTop: '16px',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.18)',
                letterSpacing: '0.08em',
              }}
            >
              gracias al árbol de Merkle
            </div>
          </div>
        </div>

        {/* ── Merkle tree + Terminal ── */}
        <div
          className="trust-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          {/* Merkle SVG */}
          <div
            ref={merkleRef}
            className={merkleVisible ? 'merkle-visible' : ''}
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: 'clamp(24px, 3vw, 40px)',
              background: 'rgba(255,255,255,0.015)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.22)',
                  textTransform: 'uppercase',
                }}
              >
                Árbol de Merkle — Batch #4821
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '9px',
                  color: 'rgba(52,211,153,0.5)',
                  letterSpacing: '0.06em',
                }}
              >
                4 certificados
              </span>
            </div>

            <svg
              viewBox="0 0 600 300"
              style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            >
              {/* Lines */}
              {TREE_LINES.map((line, i) => (
                <line
                  key={i}
                  className="merkle-line"
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  style={{
                    animationDelay: merkleVisible ? line.delay : '0s',
                    animationDuration: '0.6s',
                  }}
                />
              ))}

              {/* Nodes */}
              {TREE_NODES.map((node) => {
                const isRoot = node.id === 'root'
                const isLeaf = ['ll','lr','rl','rr'].includes(node.id)
                return (
                  <g
                    key={node.id}
                    className="merkle-node"
                    style={{
                      animationDelay: merkleVisible ? node.delay : '0s',
                    }}
                  >
                    <rect
                      x={node.x - (isRoot ? 72 : isLeaf ? 56 : 64)}
                      y={node.y - 18}
                      width={isRoot ? 144 : isLeaf ? 112 : 128}
                      height={36}
                      rx="4"
                      fill={isRoot ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)'}
                      stroke={isRoot ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth="1"
                    />
                    <text
                      x={node.x}
                      y={node.y - 4}
                      textAnchor="middle"
                      fill={isRoot ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.4)'}
                      fontSize="8"
                      fontFamily="var(--font-geist-mono)"
                      letterSpacing="0.05em"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 10}
                      textAnchor="middle"
                      fill={isRoot ? 'rgba(52,211,153,0.55)' : 'rgba(255,255,255,0.25)'}
                      fontSize="8"
                      fontFamily="var(--font-geist-mono)"
                    >
                      {node.hash}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Solana tx below tree */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
                <path
                  d="M8 12l3 3 5-5"
                  stroke="#34d399"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.22)',
                }}
              >
                Solana tx: 5KJn8xVpMzQ3Yak...8fPr
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '9px',
                  color: 'rgba(52,211,153,0.6)',
                }}
              >
                confirmed ✓
              </span>
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className={terminalVisible ? 'terminal-visible' : ''}
          >
            <h3
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                lineHeight: 1.1,
                color: 'rgba(255,255,255,0.38)',
                margin: '0 0 16px',
                letterSpacing: '-0.01em',
              }}
            >
              Emite en
              <span style={{ color: '#fff' }}>
                {' '}segundos.
              </span>
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.65,
                margin: '0 0 28px',
                maxWidth: '400px',
              }}
            >
              Via API REST o desde el dashboard. Cualquier documento se convierte en
              certificado blockchain en menos de 3 segundos.
            </p>

            {/* Terminal block */}
            <div
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Terminal title bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: c,
                      opacity: 0.7,
                    }}
                  />
                ))}
                <span
                  style={{
                    marginLeft: '8px',
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.06em',
                  }}
                >
                  unickeys-cli
                </span>
              </div>

              {/* Terminal lines */}
              <div style={{ padding: '16px 18px' }}>
                {TERMINAL_LINES.map((line, i) =>
                  line.txt === '' ? (
                    <div key={i} style={{ height: '8px' }} />
                  ) : (
                    <div
                      key={i}
                      className="terminal-line"
                      style={{
                        fontFamily: 'var(--font-geist-mono)',
                        fontSize: '11px',
                        color: line.color,
                        lineHeight: '1.6',
                        whiteSpace: 'pre',
                        animationDelay: terminalVisible ? line.delay : '0s',
                        animationDuration: '0.35s',
                      }}
                    >
                      {line.txt}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          [data-stats-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
