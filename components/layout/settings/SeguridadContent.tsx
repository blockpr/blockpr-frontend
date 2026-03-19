'use client'

import { getUserSessions } from "@/lib/server-user-sessions"
import { UserSession } from "@/types"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors'

export default function SeguridadContent() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userSessions, setUserSessions] = useState<UserSession[]>([])
  const [userSessionsLoading, setUserSessionsLoading] = useState(false)
  const [sessionsLoaded, setSessionsLoaded] = useState(false)
  async function handleChangePassword() {
    if (loading) return

    setError(null)
    setSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Completá todos los campos')
      return
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo actualizar la contraseña')
        return
      }
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Error de red al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (sessionsLoaded) return
    setUserSessionsLoading(true)
    getUserSessions()
      .then((data) => {
        setUserSessions(data)
      })
      .catch(() => setUserSessions([]))
      .finally(() => {
        setUserSessionsLoading(false)
        setSessionsLoaded(true)
      })
  }, [sessionsLoaded])
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
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-border)] disabled:text-[var(--color-text-muted)] text-white text-xs font-medium transition-colors"
        >
          {loading ? 'Actualizando…' : 'Actualizar contraseña'}
        </button>
        {error && (
          <p className="text-xs text-[var(--color-danger)] mt-2">{error}</p>
        )}
        {success && !error && (
          <p className="text-xs text-[var(--color-success)] mt-2">
            Contraseña actualizada correctamente.
          </p>
        )}
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Dispositivos conectados */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
          Dispositivos conectados
        </p>
        <div className="space-y-2">
          {userSessionsLoading ? (
            <div className="text-xs text-[var(--color-text-muted)]">Cargando sesiones…</div>
          ) : (
            userSessions.length === 0 ? (
              <div className="text-xs text-[var(--color-text-muted)]">No hay sesiones registradas.</div>
            ) : (
              <>
                {userSessions.map((s) => {
                  const name = (s.device_name ?? '').toLowerCase()
                  const specs = (s.device_specs ?? '').toLowerCase()
                  const isCurrent = s.is_opened ?? false

                  const icon =
                    name.includes('iphone') || specs.includes('ios') ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3"
                        />
                      </svg>
                    ) : name.includes('mac') || specs.includes('mac') ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
                        />
                      </svg>
                    )

                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
                    >
                      <div className="text-[var(--color-text-muted)] shrink-0">{icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-[var(--color-text-primary)]">{s.device_name ?? 'Dispositivo'}</p>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-success-muted)] text-[var(--color-success)] font-medium">
                              Este dispositivo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          {s.device_specs ?? 'Sistema operativo'} · {s.is_opened ? 'Sesión abierta' : 'Sesión cerrada'}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)]">
                          Última actividad:{' '}
                          {s.updated_at ? new Date(s.updated_at).toLocaleString('es-AR') : '—'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}
