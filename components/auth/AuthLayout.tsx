import Link from 'next/link'
import { UnickeysLogo } from '@/components/brand/UnickeysLogo'
import { cn } from '@/lib/utils'

export type AuthFormBrand = 'left' | 'center' | 'none'

const features = [
  'Hash SHA-256 único por certificado',
  'Registro inmutable en blockchain Solana',
  'Verificación pública sin necesidad de cuenta',
  'Auditoría completa y trazable por lote',
]

function BrandLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 min-w-0 text-[var(--color-text-primary)]"
    >
      <UnickeysLogo className="w-9 h-9" />
      <span className="font-semibold tracking-tight whitespace-nowrap text-lg">unickeys</span>
    </Link>
  )
}

export function AuthLayout({
  children,
  formBrand = 'left',
}: {
  children: React.ReactNode
  /** Marca encima del formulario (panel derecho). */
  formBrand?: AuthFormBrand
}) {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - solo desktop */}
      <div className="hidden lg:flex w-[460px] shrink-0 flex-col justify-between p-12 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
        <BrandLink />

        <div>
          <p className="text-[22px] font-semibold text-[var(--color-text-primary)] leading-snug">
            Documentos digitales con respaldo criptográfico inmutable
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
          © {new Date().getFullYear()} unickeys. Todos los derechos reservados.
        </p>
      </div>

      {/* Panel derecho - contenido */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-base)] overflow-y-auto">
        <div className="w-full max-w-md">
          {formBrand !== 'none' && (
            <div
              className={cn(
                'mb-8',
                formBrand === 'center' && 'flex justify-center w-full'
              )}
            >
              <BrandLink />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
