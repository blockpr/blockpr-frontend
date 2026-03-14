'use client'

import { useState, useEffect } from "react"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors'
const disabledClass =
  'w-full px-3 py-2 rounded-lg bg-[var(--color-base)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] cursor-not-allowed select-none'

export default function PerfilContent() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [address, setAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [taxId, setTaxId] = useState('')
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const initials = companyName
    .split(' ')
    .map((w: string) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  // Cargar perfil al montar
  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const [res] = await Promise.all([
          fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
            signal: controller.signal,
          }),
          new Promise(r => setTimeout(r, 400)),
        ])
        if (!res.ok) return
        const data = await res.json()
        const user = data.user ?? data
        setCompanyName(user.company_name ?? '')
        setEmail(user.email ?? '')
        setContactName(user.contact_name ?? '')
        setAddress(user.address ?? '')
        setContactPhone(user.contact_phone ?? '')
        setTaxId(user.tax_id ?? '')
      } catch {
        // Silenciar errores de carga
      } finally {
        // En React Strict Mode el effect corre dos veces: la primera pasada
        // aborta la request durante la limpieza. Solo quitamos el loader si
        // la request no fue abortada (es decir, si es la pasada "real").
        if (!controller.signal.aborted) {
          setProfileLoading(false)
        }
      }
    })()

    return () => controller.abort()
  }, [])

  async function handleSave() {
    if (loading) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    const body = {
      company_name: companyName || undefined,
      contact_name: contactName || undefined,
      address: address || undefined,
      contact_phone: contactPhone || undefined,
      tax_id: taxId || undefined,
    }

    try {
      const res = await fetch(`${API_URL}/users/update-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudieron guardar los cambios')
        return
      }
      setSuccess(true)
    } catch {
      setError('Error de red al guardar los cambios')
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xl font-semibold">
            {initials}
          </div>
          <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {companyName || '—'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{email}</p>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Campos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Email
            <span className="ml-1.5 text-[var(--color-text-muted)] font-normal">· no editable</span>
          </label>
          <div className={disabledClass}>{email}</div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Nombre de contacto
          </label>
          <input
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Domicilio
          </label>
          <input
            type="text"
            placeholder="Av. Corrientes 1234, CABA"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Celular
          </label>
          <input
            type="tel"
            placeholder="+54 9 11 0000-0000"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            CUIT / Tax ID
          </label>
          <input
            type="text"
            value={taxId}
            onChange={e => setTaxId(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-border)] disabled:text-[var(--color-text-muted)] text-white text-xs font-medium transition-colors"
        >
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {error && (
          <p className="text-xs text-[var(--color-danger)] mt-1">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-xs text-[var(--color-success)] mt-1">
            Cambios guardados correctamente.
          </p>
        )}
      </div>
    </div>
  )
}
