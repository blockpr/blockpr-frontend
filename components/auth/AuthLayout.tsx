import Link from 'next/link'

const features = [
  'Hash SHA-256 único por certificado',
  'Registro inmutable en blockchain Solana',
  'Verificación pública sin necesidad de cuenta',
  'Auditoría completa y trazable por lote',
]

function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
  const svgSize = size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'
  const textSize = size === 'sm' ? 'text-base' : 'text-lg'

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${iconSize} rounded-[6px] bg-[var(--color-accent)] flex items-center justify-center shrink-0`}>
        <svg className={`${svgSize} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      </div>
      <span className={`font-semibold text-[var(--color-text-primary)] ${textSize}`}>BlockPR</span>
    </div>
  )
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - solo desktop */}
      <div className="hidden lg:flex w-[460px] shrink-0 flex-col justify-between p-12 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
        <Link href="/">
          <BrandLogo size="md" />
        </Link>

        <div>
          <p className="text-[22px] font-semibold text-[var(--color-text-primary)] leading-snug">
            Certificados técnicos con respaldo criptográfico inmutable
          </p>
          <ul className="mt-8 space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="mt-0.5 w-4.5 h-4.5 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} BlockPR. Todos los derechos reservados.
        </p>
      </div>

      {/* Panel derecho - contenido */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-base)] overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link href="/" className="lg:hidden inline-block mb-8">
            <BrandLogo size="sm" />
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
