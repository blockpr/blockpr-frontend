import Link from 'next/link'

// Landing pública — se construye en etapa posterior
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-base)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">BlockPR</h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          Certificados técnicos con respaldo blockchain
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  )
}
