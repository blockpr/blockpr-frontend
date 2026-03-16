'use client'

import { useEffect, useState } from 'react'

export function PageLoader({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1900)
    const t2 = setTimeout(onDone, 2550)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <>
      <style>{`
        @keyframes pl-draw {
          from { stroke-dashoffset: 70 }
          to   { stroke-dashoffset: 0  }
        }
        @keyframes pl-node {
          0%   { opacity: 0; transform: scale(0)    }
          65%  {             transform: scale(1.18)  }
          100% { opacity: 1; transform: scale(1)    }
        }
        @keyframes pl-text {
          from { opacity: 0; transform: translateY(7px) }
          to   { opacity: 1; transform: translateY(0)   }
        }
        @keyframes pl-spin {
          from { transform: rotate(0deg)   }
          to   { transform: rotate(360deg) }
        }
        @keyframes pl-ring-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
        opacity: out ? 0 : 1,
        transform: out ? 'translateY(-10px)' : 'translateY(0)',
        transition: out ? 'opacity 0.65s cubic-bezier(0.4,0,1,1), transform 0.65s cubic-bezier(0.4,0,1,1)' : 'none',
      }}>

        {/* Logo + spinning ring wrapper */}
        <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Spinning comet ring */}
          <div style={{
            position: 'absolute',
            inset: -14,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0.12) 80%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
            maskImage:        'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
            opacity: 0,
            animation: 'pl-ring-in 0.45s 1.0s forwards, pl-spin 1.6s 1.0s linear infinite',
          }} />

          <svg width="64" height="64" viewBox="0 0 200 200" fill="none">

            {/* Lines — draw in staggered */}
            <path d="M100 100V42" stroke="white" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="70" strokeDashoffset="70"
              style={{ animation: 'pl-draw 0.45s 0.05s cubic-bezier(0.4,0,0.2,1) forwards' }} />
            <path d="M100 100L148 128" stroke="white" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="70" strokeDashoffset="70"
              style={{ animation: 'pl-draw 0.45s 0.20s cubic-bezier(0.4,0,0.2,1) forwards' }} />
            <path d="M100 100L52 128" stroke="white" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="70" strokeDashoffset="70"
              style={{ animation: 'pl-draw 0.45s 0.35s cubic-bezier(0.4,0,0.2,1) forwards' }} />

            {/* Expanding pulse ring */}
            <circle cx="100" cy="100" r="16" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1">
              <animate attributeName="r"       values="16;44"    dur="1.9s" begin="0.95s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 1 1" />
              <animate attributeName="opacity" values="0.45;0"   dur="1.9s" begin="0.95s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 1 1" />
            </circle>

            {/* Nodes — pop in staggered */}
            <g style={{ transformBox: 'fill-box', transformOrigin: 'center',
              animation: 'pl-node 0.38s 0.52s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <path d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z"
                fill="white" stroke="white" strokeWidth="4.5"/>
            </g>
            <g style={{ transformBox: 'fill-box', transformOrigin: 'center',
              animation: 'pl-node 0.38s 0.64s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <path d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z"
                fill="white" stroke="white" strokeWidth="4.5"/>
            </g>
            <g style={{ transformBox: 'fill-box', transformOrigin: 'center',
              animation: 'pl-node 0.38s 0.76s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <path d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z"
                fill="white" stroke="white" strokeWidth="4.5"/>
            </g>
            <g style={{ transformBox: 'fill-box', transformOrigin: 'center',
              animation: 'pl-node 0.38s 0.88s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <path d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z"
                fill="white" stroke="white" strokeWidth="4.5"/>
            </g>

            {/* Inner center dot */}
            <path d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z"
              fill="white"/>
          </svg>
        </div>

        <span style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.38)',
          fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
          animation: 'pl-text 0.5s 0.72s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          unickeys
        </span>

      </div>
    </>
  )
}
