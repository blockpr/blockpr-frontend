export type VerifyState = 'verified' | 'pending' | 'not_found' | 'failed'

interface VerifyBannerProps {
  state: VerifyState
}

const CONFIG = {
  verified: {
    bg: '#071a0a',
    border: '#1a4a1e',
    iconBg: '#0d2e11',
    iconBorder: '#1f6b26',
    iconColor: '#3dd65c',
    titleColor: '#3dd65c',
    subColor: 'rgba(61,214,92,0.5)',
    title: 'Documento válido',
    sub: 'Hash verificado en blockchain · Solana',
  },
  pending: {
    bg: '#160d04',
    border: '#4a2a0a',
    iconBg: '#2a1505',
    iconBorder: '#8b4a12',
    iconColor: '#e8832a',
    titleColor: '#e8832a',
    subColor: 'rgba(232,131,42,0.55)',
    title: 'Pendiente de confirmación',
    sub: 'El documento fue registrado, aguardando confirmación en blockchain',
  },
  not_found: {
    bg: '#111',
    border: '#222',
    iconBg: '#1a1a1a',
    iconBorder: '#333',
    iconColor: '#555',
    titleColor: '#666',
    subColor: '#333',
    title: 'No encontrado',
    sub: 'No existe ningún registro con este ID',
  },
  failed: {
    bg: '#1a0707',
    border: '#4a1a1a',
    iconBg: '#2e0d0d',
    iconBorder: '#6b1f1f',
    iconColor: '#d63d3d',
    titleColor: '#d63d3d',
    subColor: 'rgba(214,61,61,0.5)',
    title: 'Error de verificación',
    sub: 'Ocurrió un error al procesar este registro',
  },
}

export function VerifyBanner({ state }: VerifyBannerProps) {
  const c = CONFIG[state]

  return (
    <>
      {state === 'pending' && (
        <style>{`
          @keyframes vb-dot-bounce {
            0%, 80%, 100% { opacity: .25; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.15); }
          }
          .vb-dot {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #e8832a;
            animation: vb-dot-bounce 1.4s ease-in-out infinite;
          }
          .vb-dot:nth-child(2) { animation-delay: 0.2s; }
          .vb-dot:nth-child(3) { animation-delay: 0.4s; }
        `}</style>
      )}
      <div
        style={{
          borderRadius: 12,
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          background: c.bg,
          border: `1px solid ${c.border}`,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 20,
            background: c.iconBg,
            border: `1.5px solid ${c.iconBorder}`,
            color: c.iconColor,
          }}
        >
          {state === 'verified' && '✓'}
          {state === 'pending' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="vb-dot" />
              <span className="vb-dot" />
              <span className="vb-dot" />
            </span>
          )}
          {state === 'not_found' && '?'}
          {state === 'failed' && '✗'}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 3, color: c.titleColor }}>
            {c.title}
          </div>
          <div style={{ fontSize: 12, color: c.subColor }}>{c.sub}</div>
        </div>
      </div>
    </>
  )
}
