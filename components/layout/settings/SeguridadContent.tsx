export default function SeguridadContent() {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Contraseña actual
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
        </div>
  
        <button className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium transition-colors">
          Actualizar contraseña
        </button>
  
        <div className="h-px bg-[var(--color-border)]" />
  
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Autenticación de dos factores
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Añade una capa extra de seguridad a tu cuenta.
          </p>
          <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors">
            Activar 2FA
          </button>
        </div>
  
        <div className="h-px bg-[var(--color-border)]" />
  
        {/* Dispositivos conectados */}
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
            Dispositivos conectados
          </p>
          <div className="space-y-2">
            {[
              {
                name: 'MacBook Pro',
                os: 'macOS 15 · Safari 18',
                location: 'Buenos Aires, Argentina',
                lastSeen: 'Ahora',
                current: true,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                ),
              },
              {
                name: 'iPhone 16 Pro',
                os: 'iOS 18 · Chrome 131',
                location: 'Buenos Aires, Argentina',
                lastSeen: 'Hace 2 horas',
                current: false,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
                  </svg>
                ),
              },
              {
                name: 'Windows PC',
                os: 'Windows 11 · Edge 131',
                location: 'Córdoba, Argentina',
                lastSeen: 'Hace 5 días',
                current: false,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                ),
              },
            ].map((device) => (
              <div
                key={device.name}
                className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
              >
                <div className="text-[var(--color-text-muted)] shrink-0">
                  {device.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">{device.name}</p>
                    {device.current && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-success-muted)] text-[var(--color-success)] font-medium">
                        Este dispositivo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{device.os} · {device.location}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Último acceso: {device.lastSeen}</p>
                </div>
                {!device.current && (
                  <button className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                    Cerrar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }