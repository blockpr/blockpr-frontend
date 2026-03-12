import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function PerfilContent() {
    const { data: session, update } = useSession()
    const fallbackName = session?.user?.name ?? 'AutoCheck SA'
    const email = session?.user?.email ?? 'demo@blockpr.io'
  
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:8000'
  
    const [companyName, setCompanyName] = useState(fallbackName)
    const [contactName, setContactName] = useState('')
    const [address, setAddress] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [taxId, setTaxId] = useState('')
    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
  
    const initials = (companyName || fallbackName)
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  
    const inputClass =
      'w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors'
    const disabledClass =
      'w-full px-3 py-2 rounded-lg bg-[var(--color-base)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] cursor-not-allowed select-none'
  
    useEffect(() => {
      const accessToken = (session?.user as any)?.accessToken as string | undefined
      if (!accessToken) return
  
      const controller = new AbortController()
      setProfileLoading(true)
  
      ;(async () => {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          })
          if (!res.ok) return
          const data = await res.json()
          setCompanyName(data.company_name ?? fallbackName)
          setContactName(data.contact_name ?? '')
          setAddress(data.address ?? '')
          setContactPhone(data.contact_phone ?? '')
          setTaxId(data.tax_id ?? '')
        } catch {
          // Silenciar errores de carga del perfil
        } finally {
          setProfileLoading(false)
        }
      })()
  
      return () => controller.abort()
    }, [API_URL, fallbackName, session?.user])
  
    async function handleSave() {
      const accessToken = (session?.user as any)?.accessToken as string | undefined
      if (!accessToken || loading) return
  
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'No se pudieron guardar los cambios')
          return
        }
        setSuccess(true)

        // Refrescar la sesión de NextAuth para propagar los nuevos datos
        if (typeof update === 'function') {
          await update({
            ...session,
            user: {
              ...(session?.user ?? {}),
              name: companyName || fallbackName,
            },
          })
        }
      } catch {
        setError('Error de red al guardar los cambios')
      } finally {
        setLoading(false)
      }
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
              {companyName || fallbackName}
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
              disabled={profileLoading || loading}
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
              disabled={profileLoading || loading}
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
              disabled={profileLoading || loading}
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
              disabled={profileLoading || loading}
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
              disabled={profileLoading || loading}
              className={inputClass}
            />
          </div>
        </div>
  
        <div>
          <button
            onClick={handleSave}
            disabled={profileLoading || loading || !(session?.user as any)?.accessToken}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-border)] disabled:text-[var(--color-text-muted)] text-white text-xs font-medium transition-colors"
          >
            {profileLoading ? 'Cargando datos…' : loading ? 'Guardando…' : 'Guardar cambios'}
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
  