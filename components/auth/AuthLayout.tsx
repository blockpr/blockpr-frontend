import Link from 'next/link'
import { UnickeysLogo } from '@/components/brand/UnickeysLogo'
import { AuthNodeCanvas } from '@/components/auth/AuthNodeCanvas'
import { cn } from '@/lib/utils'

export type AuthFormBrand = 'left' | 'center' | 'none'

function BrandLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 min-w-0 text-white"
    >
      <UnickeysLogo className="w-8 h-8" />
      <span className="font-semibold tracking-tight whitespace-nowrap text-base" style={{ color: '#fff' }}>unickeys</span>
    </Link>
  )
}

export function AuthLayout({
  children,
  formBrand = 'left',
}: {
  children: React.ReactNode
  formBrand?: AuthFormBrand
}) {
  return (
    <div className="flex min-h-screen">

      {/* ── Panel izquierdo: canvas de nodos ── */}
      <div
        className="hidden lg:block relative"
        style={{
          width: 480,
          flexShrink: 0,
          background: '#050505',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}
      >
        {/* Canvas de nodos */}
        <AuthNodeCanvas />

        {/* Gradiente izquierdo: oscurece bordes para legibilidad */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,5,5,0.55) 100%)
          `,
        }} />

        {/* Gradiente top: fade para el logo */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 140, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.85) 0%, transparent 100%)',
        }} />

        {/* Gradiente bottom: fade para el tagline */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 140, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 100%)',
        }} />

        {/* Logo — top left */}
        <div style={{
          position: 'absolute', top: 40, left: 40,
          zIndex: 2,
        }}>
          <BrandLink />
        </div>

        {/* Tagline — bottom left */}
        <div style={{
          position: 'absolute', bottom: 40, left: 40, right: 40,
          zIndex: 2,
        }}>
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            margin: '0 0 10px',
          }}>
            SHA-256 · Merkle Tree · Solana Mainnet
          </p>
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto" style={{ background: '#000' }}>
        <div className="w-full max-w-md">
          {formBrand !== 'none' && (
            <div className={cn(
              'mb-8',
              formBrand === 'center' && 'flex justify-center w-full'
            )}>
              <BrandLink />
            </div>
          )}
          {children}
        </div>
      </div>

    </div>
  )
}
