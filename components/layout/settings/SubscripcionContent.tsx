export default function SubscripcionContent() {
    return (
      <div className="space-y-6">
        {/* Plan actual */}
        <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-[var(--color-accent)]">Plan Pro</span>
            <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full">Activo</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">USD $49 / mes · Renueva el 1 abr 2026</p>
        </div>
  
        {/* Uso */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Certificados emitidos</span>
            <span className="text-xs text-[var(--color-text-muted)]">1.847 / 5.000</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-card)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: '37%' }} />
          </div>
        </div>
  
        <div className="h-px bg-[var(--color-border)]" />
  
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium transition-colors">
            Mejorar plan
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors">
            Ver facturas
          </button>
        </div>
      </div>
    )
  }