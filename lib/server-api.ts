import { cookies } from 'next/headers'

const API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

/**
 * Fetch autenticado para usar exclusivamente en Server Components / Route Handlers.
 * Lee la cookie `token` desde next/headers y la reenvía al backend.
 */
export async function serverFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const { headers: extraHeaders, ...restOptions } = options ?? {}

  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Cookie: `token=${token}` } : {}),
      ...(extraHeaders as Record<string, string> | undefined),
    },
    // Nunca cachear datos autenticados
    cache: 'no-store',
  })

  let data: unknown
  try {
    data = await res.json()
  } catch {
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
    return {} as T
  }

  if (!res.ok) {
    const err = data as { error?: string }
    throw new Error(err.error ?? `Error ${res.status}`)
  }

  return data as T
}
