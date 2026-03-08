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
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    const err: ApiError = { status: res.status, message: data.error ?? 'Error inesperado' }
    throw err
  }
  return data as T
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
  user: { id: string; email: string; company_name: string }
  access_token: string
  refresh_token: string
  token_type: string
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

  logout: (refresh_token: string) =>
    apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),

  me: (access_token: string) =>
    apiFetch('/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    }),
}
