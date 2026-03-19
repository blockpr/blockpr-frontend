const API_BASE =
  (typeof window === 'undefined'
    ? process.env.API_URL
    : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

interface ApiError {
  status: number
  message: string
}

async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  // Destructuramos headers para que no se sobreescriban con ...options
  const { headers: extraHeaders, ...restOptions } = options ?? {}
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...restOptions,
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      credentials: 'include', // Incluir cookies en todas las requests
    })
    
    // Si la respuesta no es JSON (por ejemplo, error de red), manejar el error
    let data
    try {
      data = await res.json()
    } catch {
      // Si no se puede parsear JSON, crear un error genérico
      if (!res.ok) {
        const err: ApiError = { 
          status: res.status, 
          message: `Error ${res.status}: ${res.statusText || 'Error de red'}` 
        }
        throw err
      }
      // Si está OK pero no es JSON, retornar un objeto vacío
      return {} as T
    }
    
    if (!res.ok) {
      const err: ApiError = { status: res.status, message: data.error ?? 'Error inesperado' }
      throw err
    }
    return data as T
  } catch (error) {
    // Si es un error de red (failed to fetch), lanzar un error más descriptivo
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const err: ApiError = { 
        status: 0, 
        message: 'Error de conexión. Verificá que el servidor esté corriendo y que CORS esté configurado correctamente.' 
      }
      throw err
    }
    // Re-lanzar otros errores
    throw error
  }
}

/**
 * Helper para refrescar el token usando next-auth
 * Esto actualiza la sesión con el nuevo token
 */
export async function refreshSession(): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    // Usar el evento de next-auth para refrescar la sesión
    const event = new Event('visibilitychange')
    document.dispatchEvent(event)
    
    // También intentar actualizar la sesión manualmente
    const { getSession } = await import('next-auth/react')
    await getSession()
  } catch (error) {
    console.error('Error refreshing session:', error)
  }
}

export interface RegisterPayload {
  email: string
  password: string
  company_name: string
  tax_id?: string
  contact_name?: string
  contact_phone?: string
  address?: string
  city?: string
  country?: string
}

export interface LoginResponse {
  message: string
  user: {
    id: string
    email: string
    company_name: string
    tax_id?: string | null
    contact_name?: string | null
    contact_phone?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
    email_verified: boolean
  }
}

export interface MeResponse {
  user: {
    id: string
    email: string
    company_name: string
    tax_id?: string | null
    contact_name?: string | null
    contact_phone?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
    email_verified: boolean
    last_login_at?: string | null
    created_at: string
  }
}

export const authApi = {
  login: (email: string, password: string, device_name?: string, device_specs?: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, device_name, device_specs, action: 'login' }),
    }),

  register: (payload: RegisterPayload) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyEmail: (token: string) =>
    apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  changePassword: (token: string, new_password: string) =>
    apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password }),
    }),

  refresh: (refresh_token: string) =>
    apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),

  logout: (device_name?: string, device_specs?: string) =>
    apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ device_name, device_specs, action: 'logout' }),
    }),

  me: () =>
    apiFetch<MeResponse>('/auth/me'),
}

export interface ApiKeyResponse {
  id: string
  name: string | null
  created_at: string
  last_used_at: string | null
}

export interface CreateApiKeyResponse {
  api_key: string
  id: string
  name: string | null
  created_at: string
}

export const apiKeysApi = {
  list: () =>
    apiFetch<ApiKeyResponse[]>('/auth/api-keys'),

  create: (name: string) => {
    const trimmedName = name.trim()
    console.log('Creating API key with name:', trimmedName)
    return apiFetch<CreateApiKeyResponse>('/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name: trimmedName }),
    })
  },

  delete: (api_key_id: string) =>
    apiFetch<{ message: string }>(`/auth/api-keys/${api_key_id}`, {
      method: 'DELETE',
    }),
}

export interface CertificatesListItem {
  id: string
  external_id: string | null
  certificate_type: string | null
  document_hash: string
  created_at: string
  blockchain: {
    transaction_signature: string | null
    explorer_url: string | null
    blockchain: string | null
    network: string | null
    status: string | null
    confirmed_at: string | null
  }
}

export interface CertificatesListResponse {
  success: boolean
  data: CertificatesListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const certificatesApi = {
  list: (page = 1, limit = 100) =>
    apiFetch<CertificatesListResponse>(`/certificates?page=${page}&limit=${limit}`),
}
