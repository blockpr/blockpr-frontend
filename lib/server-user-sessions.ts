import type { UserSession } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/**
 * Fetch autenticado para uso en componentes `use client`.
 * El backend devuelve una lista: `UserSession[]` (una por dispositivo).
 */
export async function getUserSessions(): Promise<UserSession[]> {
  const res = await fetch(`${API_URL}/users/user-sessions`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  const data = (await res.json().catch(() => [])) as UserSession[]

  if (!res.ok) {
    const message = (data as any)?.error ?? `Error ${res.status}`
    throw new Error(message)
  }

  return Array.isArray(data) ? data : []
}

