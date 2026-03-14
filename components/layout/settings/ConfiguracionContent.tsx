import { cn } from "@/lib/utils"
import { Theme, useThemeStore } from "@/stores/themeStore"

export default function ConfiguracionContent() {
    const themes = [
      {
        id: 'light',
        label: 'Claro',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ),
      },
      {
        id: 'dark',
        label: 'Oscuro',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        ),
      },
      {
        id: 'system',
        label: 'Sistema',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
          </svg>
        ),
      },
    ]
    const { theme, setTheme } = useThemeStore()
  
    return (
      <div className="space-y-6">
        {/* Tema */}
        <div>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">Apariencia</p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const active = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as Theme)}
                  className={cn(
                    'flex flex-col items-center gap-2 py-3 px-2 rounded-lg border text-xs font-medium transition-colors',
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
  

        {/* TODO: notificaciones — descomentar cuando el backend soporte preferencias
        <div className="h-px bg-[var(--color-border)]" />

        <div className="space-y-4">
          {[
            { label: 'Notificaciones por email', description: 'Recibir alertas de emisiones y verificaciones' },
            { label: 'Resumen semanal', description: 'Email con el resumen de actividad de la semana' },
            { label: 'Alertas de seguridad', description: 'Notificar accesos desde nuevos dispositivos' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-text-primary)]">{item.label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
              </div>
              <button className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-[var(--color-accent)] transition-colors focus:outline-none">
                <span className="translate-x-4 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
          ))}
        </div>
        */}
  
      </div>
    )
  }
  